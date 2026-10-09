import json
from types import SimpleNamespace
from unittest.mock import Mock

from django.test import SimpleTestCase

from recomendador.services.ai_discovery_service import AIDiscoveryService


class AIDiscoveryServiceTests(SimpleTestCase):
    def test_narrative_request_returns_verified_titles_in_ai_order(self):
        games_service = Mock()
        games_service.game_repo.get_user_favorites.return_value = []
        games_service.fetch_games_page.side_effect = [
            {"results": [{"id": 10, "name": "Devil May Cry 5", "added": 3000}]},
            {"results": [{"id": 11, "name": "Bayonetta", "added": 1500}]},
            {"results": [{"id": 12, "name": "Demon Racing", "added": 9999}]},
        ]
        completion = SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(
            content=json.dumps({
                "genero": "action", "plataforma": None, "etiquetas": [],
                "juego_referencia": None,
                "juegos_sugeridos": [
                    {"titulo": "Devil May Cry 5", "motivo": "Dante y Vergil son hermanos mitad demonio."},
                    {"titulo": "Bayonetta", "motivo": "Combate sobrenatural de acción."},
                    {"titulo": "Título inventado", "motivo": "No debe salir."},
                ],
            })
        ))])
        client = Mock()
        client.chat.completions.create.return_value = completion

        result = AIDiscoveryService(games_service, client).discover(
            "juego de hermanos demonios y mitad humano que pelean",
            SimpleNamespace(profile=None), False,
        )

        self.assertEqual([game["name"] for game in result["games"]], ["Devil May Cry 5", "Bayonetta"])
        self.assertIn("Dante y Vergil", result["games"][0]["reason"])
        self.assertEqual(result["method"], "ia_y_similitud")

    def test_reference_request_excludes_exact_reference_title(self):
        games_service = Mock()
        games_service.game_repo.get_user_favorites.return_value = []
        games_service.fetch_games_page.side_effect = [
            {"results": [{"id": 1, "name": "God of War", "added": 9000}]},
            {"results": [{"id": 2, "name": "Darksiders", "added": 4000}]},
        ]
        completion = SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(
            content=json.dumps({
                "genero": "action", "plataforma": None, "etiquetas": [],
                "juego_referencia": "God of War",
                "juegos_sugeridos": [
                    {"titulo": "God of War", "motivo": "Referencia"},
                    {"titulo": "Darksiders", "motivo": "Combate mitológico"},
                ],
            })
        ))])
        client = Mock()
        client.chat.completions.create.return_value = completion

        result = AIDiscoveryService(games_service, client).discover(
            "juego de dios de la guerra", SimpleNamespace(profile=None), False,
        )

        self.assertEqual([game["id"] for game in result["games"]], [2])
        self.assertEqual(result["reference_game"], "God of War")

    def test_interprets_request_and_only_returns_matching_catalog_games(self):
        favorite = SimpleNamespace(api_id=1, genero="Action", nombre="Juego guardado")
        games_service = Mock()
        games_service.game_repo.get_user_favorites.return_value = [favorite]
        games_service.fetch_games_page.return_value = {"results": [
            {
                "id": 1, "name": "Juego guardado", "rating": 5,
                "genres": [{"slug": "action", "name": "Action"}],
                "tags": [{"slug": "co-op"}], "added": 1000,
            },
            {
                "id": 2, "name": "Juego recomendado", "rating": 4.2,
                "genres": [{"slug": "action", "name": "Action"}],
                "tags": [{"slug": "co-op"}], "added": 500,
            },
            {
                "id": 3, "name": "Sin cooperativo", "rating": 4.9,
                "genres": [{"slug": "action", "name": "Action"}],
                "tags": [], "added": 900,
            },
        ]}
        completion = SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(
            content=json.dumps({"genero": "action", "plataforma": "4", "etiquetas": ["co-op"]})
        ))])
        client = Mock()
        client.chat.completions.create.return_value = completion
        user = SimpleNamespace(profile=SimpleNamespace(genero_preferido="action", plataforma_preferida="4"))

        result = AIDiscoveryService(games_service, client).discover(
            "Quiero acción cooperativa en PC", user
        )

        self.assertEqual([game["id"] for game in result["games"]], [2])
        self.assertIn("Cooperativo", result["games"][0]["reason"])
        self.assertEqual(result["intent"], {
            "genre": "Acción", "platform": "PC", "tags": ["Cooperativo"]
        })
        games_service.fetch_games_page.assert_called_once_with({
            "page_size": 40, "ordering": "-added", "genres": "action",
            "platforms": "4", "tags": "co-op",
        }, raise_on_error=True)

    def test_empty_tag_page_retries_without_tag_and_keeps_match_requirement(self):
        games_service = Mock()
        games_service.game_repo.get_user_favorites.return_value = []
        games_service.fetch_games_page.side_effect = [
            {"results": []},
            {"results": [{"id": 4, "name": "Otro", "rating": 4,
                          "genres": [], "tags": [], "added": 100}]},
        ]
        completion = SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(
            content=json.dumps({"genero": None, "plataforma": None, "etiquetas": ["survival"]})
        ))])
        client = Mock()
        client.chat.completions.create.return_value = completion

        result = AIDiscoveryService(games_service, client).discover(
            "Quiero un juego de supervivencia", SimpleNamespace(profile=None), False
        )

        self.assertEqual(result["games"], [])
        self.assertEqual(games_service.fetch_games_page.call_count, 2)

    def test_invalid_groq_key_uses_local_similarity_recommendation(self):
        games_service = Mock()
        games_service.game_repo.get_user_favorites.return_value = []
        games_service.fetch_games_page.return_value = {"results": [
            {"id": 10, "name": "Historia épica", "rating": 4.3,
             "genres": [{"slug": "role-playing-games-rpg", "name": "RPG"}],
             "tags": [{"slug": "story-rich", "name": "Story Rich"}], "added": 800},
            {"id": 11, "name": "Carreras rápidas", "rating": 4.9,
             "genres": [{"slug": "racing", "name": "Racing"}],
             "tags": [], "added": 2000},
        ]}
        client = Mock()
        client.chat.completions.create.side_effect = RuntimeError("Invalid API Key")

        result = AIDiscoveryService(games_service, client).discover(
            "Quiero un RPG con buena historia para PC", SimpleNamespace(profile=None), False
        )

        self.assertEqual(result["method"], "similitud")
        self.assertEqual([game["id"] for game in result["games"]], [10])
        self.assertEqual(result["intent"], {
            "genre": "RPG", "platform": "PC", "tags": ["Buena historia"]
        })
