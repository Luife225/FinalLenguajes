import os
import sys
from dotenv import load_dotenv

try:
    from groq import Groq
except ImportError:
    print("Error: La libreria 'groq' no esta instalada.")
    print("Ejecuta: pip install groq")
    sys.exit(1)

# Cargar variables de entorno
load_dotenv()

api_key = os.getenv('GROQ_API_KEY')

print(f"Directorio actual: {os.getcwd()}")
print(f"API Key encontrada: {'SI' if api_key else 'NO'}")

if not api_key or "gsk_" not in api_key:
    print("Error: No se encontro una API Key valida de Groq (debe empezar con 'gsk_').")
    sys.exit(1)

print("\nProbando conexion con Groq...")

try:
    client = Groq(api_key=api_key)
    
    print("Enviando mensaje a Llama 3...")
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Hola, estas funcionando?",
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    print(f"Exito! Respuesta: {chat_completion.choices[0].message.content}")

except Exception as e:
    print(f"\nError al conectar con Groq: {e}")
