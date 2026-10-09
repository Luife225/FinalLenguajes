"""Descubrimiento de juegos con interpretación de lenguaje natural y catálogo real."""

import json
import math
import os
import re
import unicodedata
from collections import Counter
from difflib import SequenceMatcher

from groq import Groq

from recomendador.services.games_service import GamesService


GENRES = {
    "action": "Acción", "adventure": "Aventura", "role-playing-games-rpg": "RPG",
    "indie": "Indie", "shooter": "Disparos", "strategy": "Estrategia",
    "simulation": "Simulación", "racing": "Carreras", "sports": "Deportes",
    "horror": "Terror", "puzzle": "Puzles", "fighting": "Lucha",
    "platformer": "Plataformas",
}
PLATFORMS = {
    "4": "PC", "187": "PlayStation 5", "18": "PlayStation 4",
    "1": "Xbox One", "186": "Xbox Series X", "7": "Nintendo Switch",
    "3": "iOS", "21": "Android",
}
TAGS = {
    "co-op": "Cooperativo", "multiplayer": "Multijugador",
    "singleplayer": "Un jugador", "open-world": "Mundo abierto",
    "survival": "Supervivencia", "story-rich": "Buena historia",
    "turn-based": "Por turnos", "difficult": "Desafiante",
    "relaxing": "Relajante",
}

GENRE_WORDS = {
    "action": ["accion", "action"], "adventure": ["aventura", "adventure"],
    "role-playing-games-rpg": ["rpg", "rol", "role playing"],
    "indie": ["indie", "independiente"], "shooter": ["shooter", "disparos", "fps"],
    "strategy": ["estrategia", "strategy"], "simulation": ["simulacion", "simulator"],
    "racing": ["carreras", "conduccion", "racing"], "sports": ["deportes", "sports"],
    "horror": ["terror", "horror"], "puzzle": ["puzles", "puzzle", "rompecabezas"],
    "fighting": ["lucha", "peleas", "fighting"],
    "platformer": ["plataformas", "platformer"],
}
PLATFORM_WORDS = {
    "187": ["playstation 5", "ps5"], "18": ["playstation 4", "ps4"],
    "186": ["xbox series", "series x"], "1": ["xbox one"],
    "7": ["nintendo switch", "switch"], "4": ["pc", "computadora", "ordenador"],
    "21": ["android"], "3": ["ios", "iphone", "ipad"],
}
TAG_WORDS = {
    "co-op": ["cooperativo", "cooperativa", "coop", "co op", "dos jugadores"],
    "multiplayer": ["multijugador", "multiplayer", "con amigos"],
    "singleplayer": ["un jugador", "solo", "singleplayer"],
    "open-world": ["mundo abierto", "open world", "explorar"],
    "survival": ["supervivencia", "survival"],
    "story-rich": ["historia", "narrativa", "story"],
    "turn-based": ["por turnos", "turn based"],
    "difficult": ["dificil", "desafiante", "difficult"],
    "relaxing": ["relajante", "tranquilo", "relaxing"],
}
STOPWORDS = {"un", "una", "de", "del", "con", "para", "que", "quiero", "busco", "juego",
             "juegos", "algo", "en", "el", "la", "los", "las", "y", "a", "the", "game"}


def matching_catalog_game(title, results):
    """Acepta solo un título que RAWG realmente haya encontrado."""
    expected = normalize_text(title)
    if not expected or len(expected) < 4:
        return None
    candidates = []
    for game in results:
        actual = normalize_text(game.get("name"))
        ratio = SequenceMatcher(None, expected, actual).ratio()
        if actual == expected or ratio >= 0.82 or (actual.startswith(expected + " ") and ratio >= 0.70):
            candidates.append((ratio, int(game.get("added") or 0), game))
    return max(candidates, default=(0, 0, None))[-1]


def normalize_text(value):
    text = unicodedata.normalize("NFKD", str(value or "").casefold())
    text = "".join(char for char in text if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", " ", text).strip()


def keywords(value):
    return Counter(word for word in normalize_text(value).split() if word not in STOPWORDS and len(word) > 1)


def matches_phrase(text, phrase):
    return f" {normalize_text(phrase)} " in f" {text} "


def local_intent(prompt):
    """Extrae criterios sin servicios externos cuando el LLM no está disponible."""
    text = normalize_text(prompt)
    genre = next((slug for slug, words in GENRE_WORDS.items()
                  if any(matches_phrase(text, word) for word in words)), None)
    platform = next((code for code, words in PLATFORM_WORDS.items()
                     if any(matches_phrase(text, word) for word in words)), None)
    tags = [slug for slug, words in TAG_WORDS.items()
            if any(matches_phrase(text, word) for word in words)][:2]
    return {"genero": genre, "plataforma": platform, "etiquetas": tags}


def content_similarity(prompt, games, genre, tags):
    """Similitud coseno de vectores TF-IDF entre la petición y cada juego."""
    query = keywords(" ".join([prompt, genre or "", *tags]))
    documents = [keywords(" ".join([
        game.get("name") or "",
        *(item.get("name") or "" for item in (game.get("genres") or [])),
        *(item.get("slug") or "" for item in (game.get("genres") or [])),
        *(item.get("name") or "" for item in (game.get("tags") or [])),
        *(item.get("slug") or "" for item in (game.get("tags") or [])),
    ])) for game in games]
    if not query or not documents:
        return [0.0] * len(games)
    frequency = Counter(word for document in documents for word in document)
    size = len(documents)
    idf = {word: math.log((size + 1) / (count + 1)) + 1 for word, count in frequency.items()}

    def norm(vector):
        return math.sqrt(sum((count * idf.get(word, 1)) ** 2 for word, count in vector.items()))

    query_norm = norm(query)
    return [
        sum(query[word] * document[word] * idf.get(word, 1) ** 2
            for word in query.keys() & document.keys()) / (query_norm * norm(document))
        if query_norm and norm(document) else 0.0
        for document in documents
    ]


class AIDiscoveryService:
    def __init__(self, games_service=None, client=None):
        self.games_service = games_service or GamesService()
        api_key = os.getenv("GROQ_API_KEY")
        self.client = client if client is not None else (Groq(api_key=api_key) if api_key else None)

    def discover(self, prompt, user, use_preferences=True):
        favorites = list(self.games_service.game_repo.get_user_favorites(user))
        profile = getattr(user, "profile", None) if use_preferences else None
        favorite_genres = [genre.strip() for favorite in favorites[:8]
                           for genre in (favorite.genero or "").split(",") if genre.strip()]
        context = {
            "genero_preferido": getattr(profile, "genero_preferido", None),
            "plataforma_preferida": getattr(profile, "plataforma_preferida", None),
            "generos_de_favoritos": favorite_genres if use_preferences else [],
        }
        intent = None
        method = "similitud"
        if self.client:
            try:
                intent = self._interpret_with_ai(prompt, context)
                method = "ia_y_similitud"
            except Exception:
                intent = None
        if intent is None:
            intent = local_intent(prompt)

        # Groq reconoce referencias de historia/personajes y propone títulos reales.
        # RAWG confirma cada título antes de mostrarlo como recomendación.
        suggestions = intent.get("juegos_sugeridos")
        reference = intent.get("juego_referencia")
        reference = reference.strip()[:100] if isinstance(reference, str) else None
        if method == "ia_y_similitud" and isinstance(suggestions, list):
            found = []
            seen = set()
            favorite_ids = {favorite.api_id for favorite in favorites}
            for suggestion in suggestions[:8]:
                if not isinstance(suggestion, dict):
                    continue
                title = suggestion.get("titulo")
                if not isinstance(title, str) or not 4 <= len(title.strip()) <= 100:
                    continue
                page = self.games_service.fetch_games_page(
                    {"search": title.strip(), "page_size": 10}, raise_on_error=True
                )
                game = matching_catalog_game(title, page.get("results") or [])
                if not game or game.get("id") in favorite_ids or game.get("id") in seen:
                    continue
                if reference and normalize_text(game.get("name")) == normalize_text(reference):
                    continue
                seen.add(game["id"])
                reason = suggestion.get("motivo")
                reason = reason.strip()[:160] if isinstance(reason, str) else ""
                found.append({**game, "reason": reason or "Se relaciona con tu descripción"})
                if len(found) == 6:
                    break
            if found:
                raw_genre = intent.get("genero")
                genre = raw_genre if isinstance(raw_genre, str) and raw_genre in GENRES else None
                raw_platform = intent.get("plataforma")
                platform = str(raw_platform) if raw_platform is not None else None
                platform = platform if platform in PLATFORMS else None
                raw_tags = intent.get("etiquetas")
                tags = [tag for tag in raw_tags if isinstance(tag, str) and tag in TAGS][:2] if isinstance(raw_tags, list) else []
                return {
                    "games": found,
                    "intent": {"genre": GENRES.get(genre), "platform": PLATFORMS.get(platform),
                               "tags": [TAGS[tag] for tag in tags]},
                    "reference_game": reference,
                    "used_preferences": use_preferences,
                    "method": "ia_y_similitud",
                }

        raw_genre = intent.get("genero")
        genre = raw_genre if isinstance(raw_genre, str) and raw_genre in GENRES else None
        if not genre and use_preferences and getattr(profile, "genero_preferido", None) in GENRES:
            genre = profile.genero_preferido
        platform = str(intent.get("plataforma")) if intent.get("plataforma") is not None else None
        platform = platform if platform in PLATFORMS else None
        if not platform and use_preferences and getattr(profile, "plataforma_preferida", None) in PLATFORMS:
            platform = profile.plataforma_preferida
        raw_tags = intent.get("etiquetas")
        tags = list(dict.fromkeys(tag for tag in raw_tags if isinstance(tag, str) and tag in TAGS))[:2] if isinstance(raw_tags, list) else []

        params = {"page_size": 40, "ordering": "-added"}
        if genre:
            params["genres"] = genre
        if platform:
            params["platforms"] = platform
        if tags:
            params["tags"] = tags[0]
        games = self.games_service.fetch_games_page(params, raise_on_error=True).get("results", [])
        if not games and tags:
            params.pop("tags")
            games = self.games_service.fetch_games_page(params, raise_on_error=True).get("results", [])

        favorite_ids = {favorite.api_id for favorite in favorites}
        genre_affinity = {item.casefold() for item in favorite_genres} if use_preferences else set()
        similarities = content_similarity(prompt, games, genre, tags)
        ranked = []
        for game, similarity in zip(games, similarities):
            if game.get("id") in favorite_ids:
                continue
            game_genres = {item.get("slug") for item in (game.get("genres") or [])}
            genre_names = {item.get("name", "").casefold() for item in (game.get("genres") or [])}
            game_tags = {item.get("slug") for item in (game.get("tags") or [])}
            matching_tags = [tag for tag in tags if tag in game_tags]
            if tags and not matching_tags:
                continue
            score = (
                4 * similarity
                + 4 * len(matching_tags)
                + (2 if genre and genre in game_genres else 0)
                + (1 if genre_names & genre_affinity else 0)
                + float(game.get("rating") or 0)
                + min(int(game.get("added") or 0) / 3000, 2)
            )
            reasons = [TAGS[tag] for tag in matching_tags]
            if genre and genre in game_genres:
                reasons.append(GENRES[genre])
            if platform:
                reasons.append(f"Disponible en {PLATFORMS[platform]}")
            if not reasons:
                reasons.append("Popular en el catálogo")
            ranked.append((score, {**game, "reason": " · ".join(reasons)}))

        ranked.sort(key=lambda item: item[0], reverse=True)
        return {
            "games": [game for _, game in ranked[:6]],
            "intent": {
                "genre": GENRES.get(genre),
                "platform": PLATFORMS.get(platform),
                "tags": [TAGS[tag] for tag in tags],
            },
            "used_preferences": use_preferences,
            "reference_game": None,
            "method": method,
        }

    def _interpret_with_ai(self, prompt, context):
        completion = self.client.chat.completions.create(
            model="openai/gpt-oss-120b",
            temperature=0.1,
            max_tokens=1100,
            reasoning_effort="low",
            reasoning_format="hidden",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": (
                    "Eres un recomendador de videojuegos. Interpreta la solicitud y responde SOLO "
                    "un objeto JSON con genero, plataforma, etiquetas, juego_referencia y juegos_sugeridos. "
                    "juego_referencia es el título canónico si el usuario describe o nombra un juego "
                    "reconocible; si no, null. Por ejemplo, 'dios de la guerra' se refiere a 'God of War'; "
                    "'hermanos demonios y mitad humano que pelean' puede referirse a Devil May Cry. "
                    "juegos_sugeridos debe contener 6 a 8 objetos {titulo, motivo} con títulos exactos "
                    "de videojuegos existentes y un motivo breve en español que relacione el título "
                    "con la petición. Si hay un juego_referencia, recomienda juegos parecidos, "
                    "sin incluir exactamente ese título. Si el usuario describe personajes o historia, "
                    "prioriza esos elementos antes que la popularidad general. No inventes títulos. "
                    "Usa exactamente un género de "
                    f"{list(GENRES)} o null; una plataforma de {list(PLATFORMS)} o null; "
                    f"hasta 2 etiquetas de {list(TAGS)}. "
                    "Prioriza lo que pide el usuario. Usa preferencias solo si son compatibles."
                )},
                {"role": "user", "content": json.dumps({"solicitud": prompt, "contexto": context}, ensure_ascii=False)},
            ],
        )
        intent = json.loads(completion.choices[0].message.content)
        if not isinstance(intent, dict):
            raise ValueError("La IA no devolvió una interpretación válida")
        return intent
