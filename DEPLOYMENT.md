# Despliegue

Este repositorio contiene dos aplicaciones y una base de datos externa:

| Servicio | Carpeta | Plataforma sugerida |
| --- | --- | --- |
| API Django | `ProyectoLenguajes` | Render Web Service |
| React/Vite | `frontend` | Vercel |
| PostgreSQL | Supabase `VideoJuego_Recomendar` | Ya migrada |

## Antes de publicar

- Las claves y contraseñas van en variables de entorno del proveedor, nunca en Git.
- `ProyectoLenguajes/.env` y `ProyectoLenguajes/db.sqlite3` son solo locales.
- Cambia la contraseña de Supabase que se compartió y la clave RAWG que aparecía en el historial anterior. Actualiza también los valores usados localmente y en Render.

## API en Render

El archivo [`render.yaml`](render.yaml) prepara un Web Service con raíz `ProyectoLenguajes`. Configura las variables solicitadas durante la creación:

- `DB_HOST`, `DB_USER` y `DB_PASSWORD`: toma los valores de **Connect → Session pooler** del proyecto Supabase. `DB_NAME=postgres` y `DB_PORT=5432` ya están definidos.
- `RAWG_API_KEY` y `GROQ_API_KEY`: claves de sus respectivos proveedores.
- `CORS_ALLOWED_ORIGINS`: URL HTTPS exacta del frontend en Vercel, sin `/` al final. Se puede completar después de crear el frontend.

Render genera una `SECRET_KEY` de producción, instala las dependencias, recoge archivos estáticos, aplica las migraciones de Django y ejecuta Gunicorn. No crees otra base de datos en Render: la aplicación usa Supabase. El nombre de host público de Render se toma de `RENDER_EXTERNAL_HOSTNAME`; si usas un dominio propio, añádelo a `ALLOWED_HOSTS`.

## Frontend en Vercel

Importa el mismo repositorio como un proyecto distinto y configura:

- **Root Directory:** `frontend`
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Environment Variable:** `VITE_API_URL=https://TU-BACKEND.onrender.com/api`

`frontend/vercel.json` permite abrir directamente rutas de React y recargarlas sin errores 404. Tras obtener la URL de Vercel, ponla en `CORS_ALLOWED_ORIGINS` de Render y vuelve a desplegar la API.

## Verificación

1. Abre el frontend desde la URL HTTPS de Vercel.
2. Prueba registro o acceso, favoritos y la búsqueda con IA.
3. Comprueba que las peticiones del navegador vayan a la URL HTTPS de Render y que Render lea la base Supabase.

En un servicio gratuito de Render la primera petición después de un periodo sin tráfico puede tardar mientras se reactiva.
