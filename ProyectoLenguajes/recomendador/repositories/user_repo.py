from django.contrib.auth.models import User
from recomendador.models.user import Profile


class UserRepository:
    """Repository para operaciones de usuario"""
    
    @staticmethod
    def create_user(username: str, email: str, password: str):
        """Crear un nuevo usuario"""
        return User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
    
    @staticmethod
    def get_user_by_username(username: str):
        """Obtener usuario por username"""
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def get_user_by_id(user_id: int):
        """Obtener usuario por ID"""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def authenticate_user(username: str, password: str):
        """Autenticar usuario"""
        from django.contrib.auth import authenticate
        return authenticate(username=username, password=password)
    
    @staticmethod
    def create_or_update_profile(user: User, genero_preferido: str = None, plataforma_preferida: str = None):
        """Crear o actualizar perfil de usuario"""
        profile, created = Profile.objects.get_or_create(
            user=user,
            defaults={
                'genero_preferido': genero_preferido,
                'plataforma_preferida': plataforma_preferida
            }
        )
        if not created and (genero_preferido or plataforma_preferida):
            if genero_preferido:
                profile.genero_preferido = genero_preferido
            if plataforma_preferida:
                profile.plataforma_preferida = plataforma_preferida
            profile.save()
        return profile
    
    @staticmethod
    def get_user_profile(user: User):
        """Obtener perfil de usuario"""
        try:
            return user.profile
        except Profile.DoesNotExist:
            return None

