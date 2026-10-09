from django.contrib.auth.models import User
from recomendador.models.game import Favorito


class GameRepository:
    """Repository para operaciones de juegos y favoritos"""
    
    @staticmethod
    def get_user_favorites(user: User):
        """Obtener todos los favoritos de un usuario"""
        return Favorito.objects.filter(user=user)
    
    @staticmethod
    def add_favorite(user: User, api_id: int, nombre: str, imagen: str, 
                     rating: float, genero: str, plataforma: str):
        """Agregar un juego a favoritos"""
        favorito, created = Favorito.objects.get_or_create(
            user=user,
            api_id=api_id,
            defaults={
                'nombre': nombre,
                'imagen': imagen,
                'rating': rating,
                'genero': genero,
                'plataforma': plataforma
            }
        )
        return favorito, created
    
    @staticmethod
    def remove_favorite(user: User, favorito_id: int):
        """Eliminar un favorito"""
        try:
            favorito = Favorito.objects.get(id=favorito_id, user=user)
            favorito.delete()
            return True
        except Favorito.DoesNotExist:
            return False
    
    @staticmethod
    def remove_favorite_by_api_id(user: User, api_id: int):
        """Eliminar un favorito por API ID"""
        try:
            favorito = Favorito.objects.get(api_id=api_id, user=user)
            favorito.delete()
            return True
        except Favorito.DoesNotExist:
            return False
    
    @staticmethod
    def is_favorite(user: User, api_id: int):
        """Verificar si un juego es favorito"""
        return Favorito.objects.filter(user=user, api_id=api_id).exists()
    
    @staticmethod
    def get_favorite_by_api_id(user: User, api_id: int):
        """Obtener favorito por API ID"""
        try:
            return Favorito.objects.get(user=user, api_id=api_id)
        except Favorito.DoesNotExist:
            return None

