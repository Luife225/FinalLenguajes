from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import requests
from recomendador.services.games_service import GamesService
from recomendador.serializers.game_serializer import (
    AddFavoritoSerializer, SearchGamesSerializer, FavoritoSerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def buscar_juegos(request):
    """GET /api/juegos/buscar/?nombre=&genero=&plataforma=&page= - Buscar juegos"""
    serializer = SearchGamesSerializer(data=request.query_params)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        games_service = GamesService()
        user = request.user if request.user.is_authenticated else None
        
        result = games_service.search_games(
            nombre=serializer.validated_data.get('nombre'),
            genero=serializer.validated_data.get('genero'),
            plataforma=serializer.validated_data.get('plataforma'),
            page=serializer.validated_data['page']
        )
        
        # Marcar favoritos si el usuario está autenticado
        if user:
            result['results'] = games_service.mark_games_as_favorites(
                result['results'], user
            )
        
        return Response(result, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': 'Error al buscar juegos'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def detalle_juego(request, id):
    """GET /api/juegos/<id>/ - Detalle de un juego de RAWG."""
    try:
        game = GamesService().get_game_details(id)
        if game is None:
            return Response({'error': 'Juego no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response(game, status=status.HTTP_200_OK)
    except requests.RequestException:
        return Response(
            {'error': 'No se pudo cargar el detalle del juego'},
            status=status.HTTP_502_BAD_GATEWAY
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def juegos_recomendados(request):
    """GET /api/juegos/recomendados/ - Obtener juegos recomendados"""
    try:
        games_service = GamesService()
        user = request.user if request.user.is_authenticated else None
        
        games = games_service.get_recommended_games(user)
        
        # Marcar favoritos si el usuario está autenticado
        if user:
            games = games_service.mark_games_as_favorites(games, user)
        
        return Response({'results': games}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': 'Error al obtener recomendaciones'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def ia_del_dia(request):
    """GET /api/juegos/ia-del-dia/ - Obtener juego del día (IA)"""
    try:
        games_service = GamesService()
        game = games_service.get_ia_game_of_the_day()
        
        if not game:
            return Response(
                {'error': 'No se encontró juego del día'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(game, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': 'Error al obtener juego del día'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorito(request):
    """POST /api/favoritos/add/ - Agregar juego a favoritos"""
    serializer = AddFavoritoSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        games_service = GamesService()
        favorito = games_service.add_favorite(
            user=request.user,
            api_id=serializer.validated_data['api_id']
        )
        
        favorito_serializer = FavoritoSerializer(favorito)
        return Response(favorito_serializer.data, status=status.HTTP_201_CREATED)
    
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'Error al agregar favorito'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_favorito(request, id):
    """DELETE /api/favoritos/remove/<id>/ - Eliminar favorito"""
    try:
        games_service = GamesService()
        games_service.remove_favorite(request.user, id)
        
        return Response(
            {'message': 'Favorito eliminado correctamente'},
            status=status.HTTP_200_OK
        )
    
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': 'Error al eliminar favorito'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_favoritos(request):
    """GET /api/favoritos/list/ - Listar favoritos del usuario"""
    try:
        games_service = GamesService()
        favoritos = games_service.get_user_favorites(request.user)
        
        return Response({'results': favoritos}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': 'Error al obtener favoritos'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

