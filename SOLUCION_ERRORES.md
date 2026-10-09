# 🔧 Solución a "Failed to fetch"

## Problemas Identificados y Solucionados

### 1. ✅ Permisos del Backend

**Problema:** El backend tenía `DEFAULT_PERMISSION_CLASSES` configurado como `IsAuthenticated`, lo que bloqueaba todos los endpoints públicos.

**Solución:** Cambiado a `AllowAny` en `settings.py`. Ahora cada endpoint puede especificar sus propios permisos.

### 2. ✅ Página Home usando datos mock

**Problema:** La página Home estaba usando `getPopularGames()` de `gamesMock.ts` en lugar de la API real.

**Solución:** Actualizada la página Home para usar `getRecomendaciones()` de la API real con manejo de estados de carga y error.

### 3. ✅ Manejo de errores mejorado

**Problema:** Los errores de conexión no mostraban mensajes claros.

**Solución:** Mejorado el manejo de errores en `api.ts` para mostrar mensajes más descriptivos.

## Pasos para verificar que todo funcione

### 1. Verificar que el backend esté corriendo

Abre una terminal y ejecuta:

```bash
cd ProyectoLenguajes
python manage.py runserver
```

Deberías ver algo como:
```
Starting development server at http://127.0.0.1:8000/
```

### 2. Verificar que el frontend pueda conectarse

Abre otra terminal y ejecuta:

```bash
cd frontend
npm run dev
```

Deberías ver algo como:
```
VITE v6.5.3  ready in 500 ms

➜  Local:   http://localhost:5173/
```

### 3. Probar el endpoint de registro directamente

Puedes probar el endpoint directamente con curl o Postman:

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123"
  }'
```

Deberías recibir una respuesta JSON con el usuario y los tokens.

### 4. Verificar en la consola del navegador

1. Abre el navegador en http://localhost:5173
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Console"
4. Intenta registrar un usuario
5. Revisa los errores en la consola

### 5. Verificar en la pestaña Network

1. En las herramientas de desarrollador, ve a "Network"
2. Intenta registrar un usuario
3. Busca la petición a `/api/auth/register/`
4. Verifica:
   - **Status:** Debería ser 201 (Created) o mostrar el error específico
   - **Request Headers:** Debería incluir `Content-Type: application/json`
   - **Response:** Debería mostrar el JSON de respuesta o el error

## Errores Comunes y Soluciones

### Error: "Failed to fetch"

**Causas posibles:**
1. El backend no está corriendo
2. El backend está corriendo en un puerto diferente
3. Error de CORS
4. Problema de red

**Soluciones:**
1. Verifica que el backend esté corriendo en http://localhost:8000
2. Verifica que CORS esté configurado correctamente en `settings.py`
3. Verifica que `BASE_URL` en `api.ts` sea `http://localhost:8000/api`

### Error: "CORS policy"

**Solución:** Verifica que en `settings.py`:
- `CORS_ALLOWED_ORIGINS` incluya `http://localhost:5173`
- `CorsMiddleware` esté antes de `CommonMiddleware`
- `django-cors-headers` esté instalado

### Error: "401 Unauthorized"

**Solución:** Este error significa que el endpoint requiere autenticación. Verifica que el endpoint tenga `@permission_classes([AllowAny])` para endpoints públicos.

### Error: "500 Internal Server Error"

**Solución:** 
1. Revisa la terminal donde corre el backend para ver el error completo
2. Verifica que todas las migraciones estén aplicadas: `python manage.py migrate`
3. Verifica que todas las dependencias estén instaladas: `pip install -r requirements.txt`

## Verificación Final

Después de aplicar estos cambios:

1. ✅ El backend debería aceptar peticiones sin autenticación en endpoints públicos
2. ✅ La página Home debería cargar juegos de la API real de RAWG
3. ✅ El registro debería funcionar correctamente
4. ✅ Los errores deberían mostrar mensajes claros

## Si aún tienes problemas

1. **Verifica la consola del navegador** para ver errores específicos
2. **Verifica la terminal del backend** para ver errores del servidor
3. **Prueba el endpoint directamente** con curl o Postman
4. **Verifica que ambos servidores estén corriendo** (backend en puerto 8000, frontend en puerto 5173)

