# 🔍 Diagnóstico de Problemas de Conexión

## Problema: "Failed to fetch" o "No se pudo conectar con el servidor"

Si estás obteniendo estos errores pero el backend está corriendo, sigue estos pasos:

## ✅ Paso 1: Verificar que el backend esté corriendo

Abre una terminal y ejecuta:

```bash
cd "C:\Users\Luife\Desktop\CICLO 7\lenguaje\Proyecto\ProyectoLenguajes"
python manage.py runserver
```

**Deberías ver:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

Si ves un error, resuélvelo primero.

## ✅ Paso 2: Verificar que el backend responda

Abre tu navegador y ve a:
- http://localhost:8000/admin/
- O http://127.0.0.1:8000/admin/

**Si ves la página de administración de Django, el backend está funcionando.**

Si no ves nada o hay un error, el backend no está corriendo correctamente.

## ✅ Paso 3: Probar el endpoint directamente

Abre tu navegador y ve a:
- http://localhost:8000/api/juegos/recomendados/

**Deberías ver una respuesta JSON** (puede estar vacía o con datos).

Si ves un error 404, el endpoint no está configurado correctamente.
Si ves un error 500, hay un problema en el código del backend.

## ✅ Paso 4: Verificar CORS en la consola del navegador

1. Abre el frontend en http://localhost:5173
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Console"
4. Ve a la pestaña "Network"
5. Intenta cargar la página principal
6. Busca las peticiones en "Network"

**Busca errores como:**
- `CORS policy: No 'Access-Control-Allow-Origin' header`
- `Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

Si ves errores de CORS, verifica la configuración en `settings.py`.

## ✅ Paso 5: Verificar la URL base

Abre `frontend/src/services/api.ts` y verifica que la línea sea:

```typescript
const BASE_URL = 'http://localhost:8000/api';
```

Si tu backend está corriendo en otro puerto (por ejemplo 8001), cámbialo a:

```typescript
const BASE_URL = 'http://localhost:8001/api';
```

## ✅ Paso 6: Verificar en la terminal del backend

Cuando intentas hacer una petición desde el frontend, **deberías ver logs en la terminal del backend**:

```
[01/Jan/2024 12:00:00] "GET /api/juegos/recomendados/ HTTP/1.1" 200 1234
```

Si NO ves ningún log, significa que las peticiones no están llegando al backend.

## 🔧 Soluciones Comunes

### Problema 1: El backend no está corriendo

**Solución:**
```bash
cd "C:\Users\Luife\Desktop\CICLO 7\lenguaje\Proyecto\ProyectoLenguajes"
python manage.py runserver
```

### Problema 2: Puerto incorrecto

**Solución:** Verifica en qué puerto está corriendo el backend y actualiza `BASE_URL` en `api.ts`.

### Problema 3: Error de CORS

**Solución:** Verifica que en `settings.py` tengas:
- `CORS_ALLOW_ALL_ORIGINS = DEBUG` (para desarrollo)
- `CorsMiddleware` antes de `CommonMiddleware`

### Problema 4: Firewall bloqueando la conexión

**Solución:** 
1. Verifica que Windows Firewall no esté bloqueando Python
2. Intenta deshabilitar temporalmente el firewall para probar

### Problema 5: Backend escuchando en 127.0.0.1 pero frontend usa localhost

**Solución:** Cambia `BASE_URL` a:
```typescript
const BASE_URL = 'http://127.0.0.1:8000/api';
```

## 🧪 Prueba Rápida

Ejecuta esto en la consola del navegador (F12 > Console):

```javascript
fetch('http://localhost:8000/api/juegos/recomendados/')
  .then(r => r.json())
  .then(data => console.log('✅ Conexión exitosa:', data))
  .catch(err => console.error('❌ Error de conexión:', err));
```

**Si ves un error, copia el mensaje exacto** y compártelo.

## 📝 Verificación Final

Después de seguir estos pasos, deberías poder:

1. ✅ Ver logs en la terminal del backend cuando haces peticiones
2. ✅ Ver la respuesta JSON en la pestaña Network del navegador
3. ✅ No ver errores de CORS en la consola
4. ✅ La página Home cargar juegos de la API
5. ✅ Poder registrarte sin errores de conexión

Si aún tienes problemas después de seguir estos pasos, comparte:
1. El mensaje de error exacto de la consola del navegador
2. Los logs de la terminal del backend
3. El resultado de la prueba rápida en la consola del navegador

