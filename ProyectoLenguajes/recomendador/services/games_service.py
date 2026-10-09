import requests
import os
from html import unescape
from django.contrib.auth.models import User
from django.core.cache import cache
from django.utils.html import strip_tags
from recomendador.repositories.game_repo import GameRepository
from recomendador.processor import filtrar_videojuegos, calcular_ranking_funcional
from recomendador.logic import obtener_recomendacion_logica

API_KEY = os.getenv("RAWG_API_KEY")
API_URL = "https://api.rawg.io/api/games"


class GamesService:
    """Service para lógica de negocio de juegos"""
    
    def __init__(self):
        self.game_repo = GameRepository()
    
    def fetch_games_from_api(self, params=None):
        """Obtener juegos de la API externa"""
        if params is None:
            params = {}
        
        default_params = {"key": API_KEY}
        all_params = {**default_params, **params}
        
        try:
            response = requests.get(API_URL, params=all_params, timeout=10)
            response.raise_for_status()
            return response.json().get("results", [])
        except requests.RequestException as e:
            print(f"Error fetching games: {e}")
            return []

    def fetch_games_page(self, params, raise_on_error=False):
        """Obtener una página y sus metadatos de paginación de RAWG."""
        try:
            response = requests.get(API_URL, params={"key": API_KEY, **params}, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching games: {e}")
            if raise_on_error:
                raise
            return {"results": [], "count": 0, "next": None}
    
    def search_games(self, nombre: str = None, genero: str = None, plataforma: str = None, page: int = 1):
        """Buscar juegos con filtros"""
        search_params = {}
        
        if nombre:
            search_params["search"] = nombre
        if genero:
            # La API de RAWG espera slugs de género (ej: "action", "role-playing-games-rpg")
            search_params["genres"] = genero
        if plataforma:
            # La API de RAWG espera IDs de plataforma (ej: "4", "187")
            search_params["platforms"] = plataforma
        
        search_params["page_size"] = 12
        search_params["page"] = page

        api_page = self.fetch_games_page(search_params)
        videojuegos = api_page.get("results", [])
        
        # Obtener recomendados (Paradigma Lógico: rating >= 4)
        destacados = obtener_recomendacion_logica(videojuegos)
        
        # Ordenar resultados (Paradigma Funcional)
        videojuegos = calcular_ranking_funcional(videojuegos)
        
        # Formatear respuesta
        return {
            'results': videojuegos,
            'highlighted': destacados,
            'total': api_page.get('count', len(videojuegos)),
            'has_more': bool(api_page.get('next'))
        }

    def get_game_details(self, game_id: int):
        """Consultar el detalle de un juego solo cuando el usuario lo abre."""
        cache_key = f"rawg_game_detail_{game_id}"
        cached = cache.get(cache_key)
        if cached is not None:
            return cached

        response = requests.get(f"{API_URL}/{game_id}", params={"key": API_KEY}, timeout=10)
        if response.status_code == 404:
            return None
        response.raise_for_status()
        game = response.json()
        details = {
            "id": game.get("id", game_id),
            "name": game.get("name", "Sin nombre"),
            "background_image": game.get("background_image"),
            "description": game.get("description_raw") or unescape(strip_tags(game.get("description") or "")),
            "rating": game.get("rating"),
            "released": game.get("released"),
            "genres": [genre.get("name") for genre in (game.get("genres") or []) if genre.get("name")],
            "platforms": [entry.get("platform", {}).get("name") for entry in (game.get("platforms") or []) if entry.get("platform", {}).get("name")],
            "developers": [developer.get("name") for developer in (game.get("developers") or []) if developer.get("name")],
            "publishers": [publisher.get("name") for publisher in (game.get("publishers") or []) if publisher.get("name")],
            "playtime": game.get("playtime"),
            "metacritic": game.get("metacritic"),
            "esrb_rating": (game.get("esrb_rating") or {}).get("name"),
            "website": game.get("website"),
        }
        cache.set(cache_key, details, 60 * 60)
        return details
    
    def get_recommended_games(self, user: User = None):
        """Obtener juegos recomendados"""
        params = {"page_size": 12, "ordering": "-rating"}
        
        # Si hay usuario con perfil, usar sus preferencias
        if user and hasattr(user, 'profile'):
            profile = user.profile
            if profile.genero_preferido:
                params["genres"] = profile.genero_preferido
            if profile.plataforma_preferida:
                params["platforms"] = profile.plataforma_preferida
        
        games = self.fetch_games_from_api(params)
        
        return games
    
    def get_ia_game_of_the_day(self):
        """Obtener juego del día (IA Real con Groq)"""
        try:
            from groq import Groq
            api_key = os.getenv('GROQ_API_KEY')
            
            if api_key:
                client = Groq(api_key=api_key)
                
                # Prompt para la IA
                prompt = "Recomienda un videojuego único, una joya oculta o un clásico de culto que sea muy bueno. Solo responde con el título exacto del juego, nada más. No uses comillas ni puntuación extra."
                
                completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                    temperature=0.9, # Variedad
                )
                
                game_title = completion.choices[0].message.content.strip()
                print(f"IA recomendó: {game_title}")
                
                # Buscar el juego en la API
                params = {"search": game_title, "page_size": 1}
                games = self.fetch_games_from_api(params)
                
                if games:
                    return games[0]
                    
        except Exception as e:
            print(f"Error IA Game of Day: {e}")
            
        # Fallback: Juego popular si falla la IA
        print("Usando fallback (juego popular)")
        params = {"page_size": 1, "ordering": "-added"}
        games = self.fetch_games_from_api(params)
        
        if games:
            return games[0]
        return None
    
    def add_favorite(self, user: User, api_id: int):
        """Agregar juego a favoritos"""
        # Obtener información del juego de la API
        games = self.fetch_games_from_api({"ids": api_id})
        
        if not games:
            raise ValueError("Juego no encontrado")
        
        game = games[0]
        
        # Extraer información
        nombre = game.get('name', 'Sin nombre')
        imagen = game.get('background_image', '')
        rating = game.get('rating', 0)
        genero = ", ".join([g['name'] for g in game.get('genres', [])])
        plataforma = ", ".join([p['platform']['name'] for p in game.get('platforms', [])])
        
        # Agregar a favoritos
        favorito, created = self.game_repo.add_favorite(
            user, api_id, nombre, imagen, rating, genero, plataforma
        )
        
        if not created:
            raise ValueError("El juego ya está en favoritos")
        
        return favorito
    
    def remove_favorite(self, user: User, favorito_id: int):
        """Eliminar favorito"""
        success = self.game_repo.remove_favorite(user, favorito_id)
        
        if not success:
            raise ValueError("Favorito no encontrado")
        
        return True
    
    def get_user_favorites(self, user: User):
        """Obtener favoritos del usuario"""
        favoritos = self.game_repo.get_user_favorites(user)
        
        return [
            {
                'id': fav.id,
                'api_id': fav.api_id,
                'nombre': fav.nombre,
                'imagen': fav.imagen,
                'rating': fav.rating,
                'genero': fav.genero,
                'plataforma': fav.plataforma,
                'created_at': fav.created_at.isoformat() if hasattr(fav, 'created_at') else None,
            }
            for fav in favoritos
        ]
    
    def mark_games_as_favorites(self, games: list, user: User):
        """Marcar juegos que son favoritos del usuario"""
        if not user or not user.is_authenticated:
            for game in games:
                game['es_favorito'] = False
            return games
        
        # Obtener IDs de favoritos del usuario
        favoritos = self.game_repo.get_user_favorites(user)
        favoritos_ids = {fav.api_id for fav in favoritos}
        
        # Marcar juegos
        for game in games:
            game['es_favorito'] = game.get('id') in favoritos_ids
        
        return games

