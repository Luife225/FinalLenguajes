"""
Script de prueba para verificar que el backend esté funcionando correctamente.
Ejecuta este script desde la carpeta ProyectoLenguajes:
    python test_backend_connection.py
"""

import requests
import sys

BASE_URL = "http://localhost:8000"

def test_connection():
    """Prueba la conexión con el backend"""
    print("🔍 Verificando conexión con el backend...")
    print(f"URL base: {BASE_URL}")
    print("-" * 50)
    
    # Test 1: Verificar que el servidor responda
    print("\n1️⃣ Verificando que el servidor responda...")
    try:
        response = requests.get(f"{BASE_URL}/admin/", timeout=5)
        if response.status_code == 200:
            print("✅ El servidor está respondiendo")
        else:
            print(f"⚠️ El servidor respondió con código: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: No se pudo conectar con el servidor")
        print("   Verifica que el backend esté corriendo:")
        print("   python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    # Test 2: Verificar endpoint de juegos recomendados
    print("\n2️⃣ Verificando endpoint de juegos recomendados...")
    try:
        response = requests.get(f"{BASE_URL}/api/juegos/recomendados/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Endpoint funcionando correctamente")
            print(f"   Juegos encontrados: {len(data.get('results', []))}")
        else:
            print(f"⚠️ El endpoint respondió con código: {response.status_code}")
            print(f"   Respuesta: {response.text[:200]}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 3: Verificar endpoint de registro (debe permitir POST sin auth)
    print("\n3️⃣ Verificando endpoint de registro...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register/",
            json={
                "username": "test_user_" + str(int(sys.time.time())),
                "email": "test@test.com",
                "password": "testpass123",
                "password2": "testpass123"
            },
            timeout=10,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code in [201, 400]:  # 201 = creado, 400 = usuario ya existe (ok)
            print(f"✅ Endpoint de registro funcionando")
        else:
            print(f"⚠️ El endpoint respondió con código: {response.status_code}")
            print(f"   Respuesta: {response.text[:200]}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 4: Verificar CORS
    print("\n4️⃣ Verificando configuración CORS...")
    try:
        response = requests.options(
            f"{BASE_URL}/api/juegos/recomendados/",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET"
            },
            timeout=5
        )
        cors_headers = {
            "access-control-allow-origin": response.headers.get("Access-Control-Allow-Origin"),
            "access-control-allow-methods": response.headers.get("Access-Control-Allow-Methods"),
        }
        if cors_headers["access-control-allow-origin"]:
            print("✅ CORS configurado correctamente")
            print(f"   Allow-Origin: {cors_headers['access-control-allow-origin']}")
        else:
            print("⚠️ CORS puede no estar configurado correctamente")
    except Exception as e:
        print(f"❌ ERROR al verificar CORS: {e}")
    
    print("\n" + "-" * 50)
    print("✅ Verificación completada")
    print("\n💡 Si todos los tests pasaron, el backend está funcionando correctamente.")
    print("   Si hay errores, revisa la configuración en settings.py")
    
    return True

if __name__ == "__main__":
    import time
    sys.time = time
    test_connection()

