from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from recomendador.services.user_service import UserService
from recomendador.serializers.user_serializer import (
    RegisterSerializer, LoginSerializer, UserProfileSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """POST /api/auth/register/ - Registrar nuevo usuario"""
    serializer = RegisterSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user_service = UserService()
        result = user_service.register_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            genero_preferido=serializer.validated_data.get('genero_preferido'),
            plataforma_preferida=serializer.validated_data.get('plataforma_preferida')
        )
        
        user_serializer = UserProfileSerializer(result['user'])
        
        return Response({
            'user': user_serializer.data,
            'tokens': result['tokens']
        }, status=status.HTTP_201_CREATED)
    
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'Error al registrar usuario'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """POST /api/auth/login/ - Iniciar sesión"""
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user_service = UserService()
        result = user_service.login_user(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        
        user_serializer = UserProfileSerializer(result['user'])
        
        return Response({
            'user': user_serializer.data,
            'tokens': result['tokens']
        }, status=status.HTTP_200_OK)
    
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        return Response(
            {'error': 'Error al iniciar sesión'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """GET /api/auth/profile/ - Obtener perfil del usuario autenticado"""
    try:
        user_service = UserService()
        profile_data = user_service.get_user_profile(request.user)
        
        return Response(profile_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': 'Error al obtener perfil'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

