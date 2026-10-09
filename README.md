# Videojuegos Recomendador - React + Django

Sistema de recomendación de videojuegos con React + TypeScript + Tailwind (frontend) y Django REST Framework (backend).

Para publicar ambas aplicaciones desde este repositorio, consulta [DEPLOYMENT.md](DEPLOYMENT.md).

## 📋 Estructura del Proyecto

```
/PROYECTO
│
├── ProyectoLenguajes/          # BACKEND DJANGO
│   ├── recomendador/
│   │   ├── api/                # Endpoints REST
│   │   ├── services/           # Lógica de negocio
│   │   ├── repositories/       # Acceso a datos
│   │   ├── models/             # Modelos Django
│   │   ├── serializers/        # Serializers DRF
│   │   └── urls.py
│   ├── videojuegos_recomendador/
│   │   └── settings.py
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                   # FRONTEND REACT
    ├── src/
    │   ├── services/
    │   │   └── api.ts          # Cliente API
    │   ├── hooks/
    │   │   ├── useAuth.tsx
    │   │   ├── useFavorites.tsx
    │   │   ├── useRecomendador.tsx
    │   │   └── useIA.tsx
    │   └── pages/
    ├── package.json
    └── vite.config.ts
```

## 🚀 Instalación y Configuración

### Backend (Django)

1. **Navegar a la carpeta del backend:**
   ```bash
   cd ProyectoLenguajes
   ```

2. **Crear un entorno virtual (recomendado):**
   ```bash
   python -m venv venv
   ```

3. **Activar el entorno virtual:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Aplicar migraciones:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Crear un superusuario (opcional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Ejecutar el servidor:**
   ```bash
   python manage.py runserver
   ```
   
   El backend estará disponible en: `http://localhost:8000`

### Frontend (React)

1. **Navegar a la carpeta del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   
   El frontend estará disponible en: `http://localhost:5173`

## 📡 Endpoints de la API

### Autenticación

- `POST /api/auth/register/` - Registrar nuevo usuario
- `POST /api/auth/login/` - Iniciar sesión
- `GET /api/auth/profile/` - Obtener perfil del usuario autenticado

### Juegos

- `GET /api/juegos/buscar/?nombre=&genero=&plataforma=` - Buscar juegos con filtros
- `GET /api/juegos/recomendados/` - Obtener juegos recomendados
- `GET /api/juegos/ia-del-dia/` - Obtener juego del día (IA)

### Favoritos

- `POST /api/favoritos/add/` - Agregar juego a favoritos
- `DELETE /api/favoritos/remove/<id>/` - Eliminar favorito
- `GET /api/favoritos/list/` - Listar favoritos del usuario

### IA (Mock)

- `POST /api/ia/chat/` - Chat con IA
- `GET /api/ia/analisis-usuario/` - Análisis del usuario (IA)

## 🔑 Autenticación

El proyecto usa **SimpleJWT** para autenticación. Los tokens se almacenan en `localStorage` del navegador.

### Headers requeridos para endpoints protegidos:
```
Authorization: Bearer <token>
```

## 🏗️ Arquitectura del Backend

El backend sigue una **arquitectura limpia** con separación por capas:

- **API (`api/`)**: Controladores que manejan las peticiones HTTP
- **Services (`services/`)**: Lógica de negocio
- **Repositories (`repositories/`)**: Acceso a datos (ORM)
- **Models (`models/`)**: Modelos Django
- **Serializers (`serializers/`)**: Serializers DRF

## 🎨 Frontend

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Hooks personalizados** para manejo de estado y API

### Hooks disponibles:

- `useAuth` - Autenticación y sesión de usuario
- `useFavorites` - Gestión de favoritos
- `useRecomendador` - Búsqueda y recomendaciones
- `useIA` - Funciones de IA

## 📝 Notas Importantes

1. **CORS**: El backend está configurado para aceptar peticiones desde `http://localhost:5173`

2. **Base de datos**: Por defecto se usa SQLite. Para producción, considera usar PostgreSQL o MySQL.

3. **API Externa**: El proyecto usa la API de [RAWG.io](https://rawg.io/) para obtener información de videojuegos.

4. **IA Mock**: Los endpoints de IA están implementados como mocks. Para implementar IA real, actualiza los archivos en `api/ia_api.py`.

## 🐛 Troubleshooting

### Error de CORS
Si encuentras errores de CORS, verifica que:
- `django-cors-headers` esté instalado
- `CORS_ALLOWED_ORIGINS` en `settings.py` incluya tu URL del frontend
- `CorsMiddleware` esté en `MIDDLEWARE` antes de `CommonMiddleware`

### Error de autenticación
- Verifica que el token esté guardado en `localStorage`
- Revisa que el backend esté corriendo en el puerto 8000
- Verifica que las credenciales sean correctas

## 📄 Licencia

Este proyecto es solo para fines educativos.

## 👨‍💻 Desarrollo

Para contribuir o hacer cambios:

1. Asegúrate de que el backend esté corriendo
2. Asegúrate de que el frontend esté corriendo
3. Realiza tus cambios
4. Prueba ambos lados (backend y frontend)
5. Verifica que no haya errores de TypeScript/Python

