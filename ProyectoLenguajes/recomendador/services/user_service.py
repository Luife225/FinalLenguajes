from django.contrib.auth.models import User
from recomendador.repositories.user_repo import UserRepository
from rest_framework_simplejwt.tokens import RefreshToken


class UserService:
    """Service para lógica de negocio de usuarios"""
    
    def __init__(self):
        self.user_repo = UserRepository()
    
    def register_user(self, username: str, email: str, password: str, 
                     genero_preferido: str = None, plataforma_preferida: str = None):
        """Registrar un nuevo usuario"""
        # Verificar si el usuario ya existe
        if self.user_repo.get_user_by_username(username):
            raise ValueError("El usuario ya existe")
        
        # Crear usuario
        user = self.user_repo.create_user(username, email, password)
        
        # Crear perfil (siempre crear, incluso sin preferencias)
        # Limpiar valores vacíos o None
        genero_clean = genero_preferido if genero_preferido and genero_preferido.strip() else None
        plataforma_clean = plataforma_preferida if plataforma_preferida and plataforma_preferida.strip() else None
        
        self.user_repo.create_or_update_profile(
            user, genero_clean, plataforma_clean
        )
        
        # Generar tokens
        refresh = RefreshToken.for_user(user)
        
        return {
            'user': user,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }
    
    def login_user(self, username: str, password: str):
        """Iniciar sesión de usuario"""
        user = self.user_repo.authenticate_user(username, password)
        
        if not user:
            raise ValueError("Credenciales inválidas")
        
        if not user.is_active:
            raise ValueError("Usuario inactivo")
        
        # Generar tokens
        refresh = RefreshToken.for_user(user)
        
        return {
            'user': user,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }
    
    def get_user_profile(self, user: User):
        """Obtener perfil de usuario completo"""
        profile = self.user_repo.get_user_profile(user)
        
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'profile': {
                'genero_preferido': profile.genero_preferido if profile else None,
                'plataforma_preferida': profile.plataforma_preferida if profile else None,
            } if profile else None
        }

