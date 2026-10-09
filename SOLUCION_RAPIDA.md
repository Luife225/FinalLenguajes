# ⚡ Solución Rápida - Problema de Conexión

## 🔴 Error: "Failed to fetch" o "No se pudo conectar con el servidor"

### Solución 1: Verificar que el backend esté corriendo

**Abre una terminal y ejecuta:**

```bash
cd "C:\Users\Luife\Desktop\CICLO 7\lenguaje\Proyecto\ProyectoLenguajes"
python manage.py runserver
```

**Deberías ver:**
```
Starting development server at http://127.0.0.1:8000/
```

**Si ves esto, el backend está corriendo correctamente. ✅**

### Solución 2: Verificar en el navegador

Abre tu navegador y ve a:
- http://localhost:8000/admin/

**Si ves la página de administración de Django, el backend funciona. ✅**

Si NO ves nada o hay un error, el backend NO está corriendo.

### Solución 3: Probar el endpoint directamente

Abre tu navegador y ve a:
- http://localhost:8000/api/juegos/recomendados/

**Deberías ver una respuesta JSON** (aunque esté vacía).

Si ves un error 404, el endpoint no está configurado.
Si ves un error 500, hay un problema en el código.

### Solución 4: Verificar en la consola del navegador (Frontend)

1. Abre el frontend: http://localhost:5173
2. Presiona F12 para abrir las herramientas de desarrollador
3. Ve a la pestaña **"Console"**
4. Busca errores rojos

**Si ves:**
- `CORS policy` → Problema de CORS
- `Failed to fetch` → El backend no está respondiendo
- `Network Error` → Problema de red

### Solución 5: Verificar en la pestaña Network

1. En las herramientas de desarrollador (F12)
2. Ve a la pestaña **"Network"**
3. Intenta cargar la página o registrar un usuario
4. Busca las peticiones a `/api/...`

**Verifica:**
- **Status:** Debería ser 200 (éxito) o 201 (creado)
- **Request URL:** Debería ser `http://localhost:8000/api/...`
- **Response:** Debería mostrar JSON

Si ves:
- **Status: (failed)** → El backend no está corriendo
- **Status: 404** → El endpoint no existe
- **Status: 500** → Error en el backend (revisa la terminal del backend)

## 🛠️ Pasos Rápidos de Diagnóstico

### 1. Verifica que el backend esté corriendo:

```bash
# Terminal 1 - Backend
cd "C:\Users\Luife\Desktop\CICLO 7\lenguaje\Proyecto\ProyectoLenguajes"
python manage.py runserver
```

### 2. Verifica que el frontend esté corriendo:

```bash
# Terminal 2 - Frontend
cd "C:\Users\Luife\Desktop\CICLO 7\lenguaje\Proyecto\frontend"
npm run dev
```

### 3. Prueba en el navegador:

- Backend: http://localhost:8000/admin/ → Debe mostrar login de Django
- API: http://localhost:8000/api/juegos/recomendados/ → Debe mostrar JSON
- Frontend: http://localhost:5173 → Debe mostrar la página

### 4. Si aún no funciona, prueba en la consola del navegador:

Abre la consola del navegador (F12 > Console) y ejecuta:

```javascript
fetch('http://localhost:8000/api/juegos/recomendados/')
  .then(r => r.json())
  .then(data => console.log('✅ Conexión exitosa:', data))
  .catch(err => console.error('❌ Error:', err));
```

**Si ves un error, copia el mensaje exacto.**

## 🔧 Cambios Recientes Aplicados

He actualizado:

1. ✅ **CORS configurado para permitir todos los orígenes en desarrollo**
2. ✅ **Mejores mensajes de error en el frontend**
3. ✅ **URL base configurada correctamente**

## 📋 Checklist Final

Antes de reportar un problema, verifica:

- [ ] El backend está corriendo (ver terminal)
- [ ] Puedes acceder a http://localhost:8000/admin/
- [ ] Puedes acceder a http://localhost:8000/api/juegos/recomendados/
- [ ] El frontend está corriendo en http://localhost:5173
- [ ] Revisaste la consola del navegador (F12) para errores
- [ ] Revisaste la terminal del backend para errores

## 🆘 Si Nada Funciona

Si después de seguir todos estos pasos aún no funciona:

1. **Comparte el error exacto** de la consola del navegador (F12 > Console)
2. **Comparte los logs** de la terminal del backend
3. **Comparte el resultado** de la prueba en la consola del navegador

Esto me ayudará a diagnosticar el problema específico.

