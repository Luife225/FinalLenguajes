from django.urls import path
from . import auth_api, games_api, ia_api

app_name = 'api'

urlpatterns = [
    # Autenticación
    path('auth/register/', auth_api.register, name='register'),
    path('auth/login/', auth_api.login, name='login'),
    path('auth/profile/', auth_api.profile, name='profile'),
    
    # Juegos
    path('juegos/buscar/', games_api.buscar_juegos, name='buscar_juegos'),
    path('juegos/<int:id>/', games_api.detalle_juego, name='detalle_juego'),
    path('juegos/recomendados/', games_api.juegos_recomendados, name='juegos_recomendados'),
    path('juegos/ia-del-dia/', games_api.ia_del_dia, name='ia_del_dia'),
    
    # Favoritos
    path('favoritos/add/', games_api.add_favorito, name='add_favorito'),
    path('favoritos/remove/<int:id>/', games_api.remove_favorito, name='remove_favorito'),
    path('favoritos/list/', games_api.list_favoritos, name='list_favoritos'),
    
    # Descubrimiento con IA
    path('ia/descubrir/', ia_api.descubrir_juegos, name='descubrir_juegos'),
    # Rutas existentes
    path('ia/chat/', ia_api.chat_ia, name='chat_ia'),
    path('ia/analisis-usuario/', ia_api.analisis_usuario, name='analisis_usuario'),
]

