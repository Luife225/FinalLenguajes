from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import random
from datetime import datetime
import os
from recomendador.services.ai_discovery_service import AIDiscoveryService


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def descubrir_juegos(request):
    """Interpreta una búsqueda libre y recomienda juegos verificados en RAWG."""
    prompt = request.data.get('prompt', '')
    if not isinstance(prompt, str) or not 8 <= len(prompt.strip()) <= 300:
        return Response({'error': 'Describe lo que buscas en 8 a 300 caracteres'}, status=status.HTTP_400_BAD_REQUEST)
    use_preferences = request.data.get('use_preferences', True)
    if not isinstance(use_preferences, bool):
        return Response({'error': 'use_preferences debe ser verdadero o falso'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        return Response(AIDiscoveryService().discover(prompt.strip(), request.user, use_preferences))
    except Exception:
        return Response({'error': 'No se pudieron generar recomendaciones en este momento'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['POST'])
@permission_classes([AllowAny])
def chat_ia(request):
    """POST /api/ia/chat/ - Chat con IA usando OpenAI"""
    mensaje = request.data.get('mensaje', '')
    
    if not mensaje:
        return Response(
            {'error': 'El mensaje es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Obtener API Key
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        return Response(
            {'error': 'Configuración de IA no encontrada (API Key faltante)'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    try:
        from groq import Groq
        
        client = Groq(api_key=api_key)
        
        # Contexto del sistema para la IA
        system_prompt = """Eres un experto en videojuegos y asistente virtual para una plataforma de recomendación de juegos.
        Tu objetivo es ayudar a los usuarios a encontrar juegos que les gusten, responder dudas sobre videojuegos,
        y ofrecer recomendaciones personalizadas.
        
        Pautas:
        1. Sé amable, entusiasta y conciso.
        2. Si te preguntan por un juego específico, da detalles interesantes.
        3. Si te piden recomendaciones, sugiere 3-5 títulos con una breve razón de por qué.
        4. Si no sabes la respuesta, admítelo honestamente.
        5. Mantén las respuestas en español."""

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": mensaje,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=500,
        )
        
        respuesta_ia = chat_completion.choices[0].message.content.strip()
        
        return Response({
            'respuesta': respuesta_ia,
            'timestamp': datetime.now().isoformat(),
            'modelo': 'llama-3.3-70b-versatile'
        }, status=status.HTTP_200_OK)

    except Exception:
        return Response(
            {'error': 'No se pudo consultar la IA en este momento'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analisis_usuario(request):
    """GET /api/ia/analisis-usuario/ - Análisis de usuario (mock)"""
    user = request.user
    
    # Obtener información básica del usuario
    genero_preferido = None
    plataforma_preferida = None
    
    try:
        profile = user.profile
        genero_preferido = profile.genero_preferido
        plataforma_preferida = profile.plataforma_preferida
    except:
        pass
    
    # Generar análisis mock
    generos_favoritos = ['Action', 'Adventure', 'RPG', 'Indie']
    plataformas_favoritas = ['PC', 'PS5', 'Xbox', 'Switch']
    
    analisis = {
        'usuario_id': user.id,
        'username': user.username,
        'preferencias_actuales': {
            'genero': genero_preferido or 'No especificado',
            'plataforma': plataforma_preferida or 'No especificada'
        },
        'analisis': {
            'generos_recomendados': random.sample(generos_favoritos, 3),
            'plataformas_recomendadas': random.sample(plataformas_favoritas, 2),
            'nivel_experiencia': random.choice(['Principiante', 'Intermedio', 'Avanzado']),
            'tipo_jugador': random.choice(['Casual', 'Competitivo', 'Explorador', 'Completista'])
        },
        'recomendaciones_personales': [
            "Explora juegos indie para descubrir experiencias únicas",
            "Prueba géneros diferentes para ampliar tus horizontes",
            "Considera juegos multiplayer para conectar con otros jugadores"
        ],
        'timestamp': datetime.now().isoformat(),
        'modelo': 'mock-ia-analytics-v1.0'
    }
    
    return Response(analisis, status=status.HTTP_200_OK)

