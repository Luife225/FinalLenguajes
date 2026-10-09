# 🎮 GameRecommend - Sistema de Recomendación de Videojuegos

Aplicación web moderna y futurista para descubrir y recomendar videojuegos, construida con React, TypeScript, Vite y Tailwind CSS.

## 📋 Características

- ✨ **Diseño Futurista**: Interfaz moderna con gradientes, efectos de brillo y animaciones suaves
- 🔐 **Autenticación Simulada**: Sistema de login/registro sin backend (datos en localStorage)
- 🎯 **Sistema de Recomendación**: Filtros inteligentes por nombre, género y plataforma
- ❤️ **Gestión de Favoritos**: Guarda tus juegos favoritos
- 📱 **Responsive**: Optimizado para móvil, tablet y escritorio
- 🎨 **Tailwind CSS**: Estilizado moderno con Tailwind v4.0
- 🚀 **React Router**: Navegación fluida entre páginas

## 🏗️ Estructura del Proyecto

```
/
├── App.tsx                 # Componente principal con rutas
├── styles/
│   └── globals.css        # Estilos globales y variables CSS
├── pages/
│   ├── Home.tsx           # Página principal con juegos populares
│   ├── Recomendador.tsx   # Formulario de filtros de búsqueda
│   ├── Resultado.tsx      # Resultados de recomendación
│   ├── Register.tsx       # Registro de usuarios
│   ├── Login.tsx          # Inicio de sesión
│   └── Favoritos.tsx      # Lista de juegos favoritos
├── components/
│   ├── Header.tsx         # Encabezado con navegación
│   ├── Footer.tsx         # Pie de página
│   ├── GameCard.tsx       # Tarjeta de juego (Home)
│   ├── ResultCard.tsx     # Tarjeta de resultado con favoritos
│   └── FavoriteCard.tsx   # Tarjeta de favorito con botón eliminar
├── layouts/
│   └── MainLayout.tsx     # Layout principal con Header/Footer
├── hooks/
│   ├── useAuth.tsx        # Hook de autenticación
│   └── useFavorites.tsx   # Hook de gestión de favoritos
└── services/
    ├── gamesMock.ts       # Datos mock de videojuegos
    └── api.ts             # Funciones preparadas para API Django
```

## 🚀 Instalación

### Prerequisitos

- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

```bash
# Si está en un repositorio
git clone <url-del-repositorio>
cd gamerecommend

# Si es un archivo descargado, extraer y navegar a la carpeta
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:5173
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con hot reload

# Producción
npm run build        # Construye la app para producción en /dist
npm run preview      # Previsualiza el build de producción

# Linting
npm run lint         # Ejecuta ESLint para verificar código
```

## 🎨 Características de Diseño

### Paleta de Colores

- **Fondo**: Gradiente oscuro (#0a0e27 → #1a1f3a)
- **Primario**: Azul (#3b82f6)
- **Secundario**: Púrpura (#8b5cf6)
- **Acento**: Cyan (#06b6d4)
- **Éxito**: Verde (#10b981)
- **Peligro**: Rojo (#ef4444)
- **Destacado**: Amarillo (#fff3cd)

### Efectos Visuales

- Gradientes en botones y tarjetas
- Efectos de brillo (glow) en hover
- Animaciones de fade-in
- Transformaciones suaves
- Scrollbar personalizado
- Bordes con efectos de neón

### Tipografía

- Fuente: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif
- Tamaños responsivos para títulos y texto

## 🔗 Conectar con Backend Django

Actualmente la aplicación funciona con datos mock. Para conectar con un backend real:

### 1. Configurar URL del Backend

En `/services/api.ts`, actualizar la constante:

```typescript
const BASE_URL = 'https://tu-api-django.com/api';
```

### 2. Endpoints Necesarios

El backend debe implementar estos endpoints:

**Autenticación:**
- `POST /api/auth/login/` - Login de usuario
- `POST /api/auth/register/` - Registro de usuario
- `POST /api/auth/logout/` - Cerrar sesión

**Juegos:**
- `GET /api/games/popular/` - Obtener juegos populares
- `GET /api/games/recommend/?name=&genre=&platform=` - Obtener recomendaciones

**Favoritos:**
- `GET /api/favorites/` - Obtener favoritos del usuario
- `POST /api/favorites/` - Agregar juego a favoritos
- `DELETE /api/favorites/{id}/` - Eliminar favorito

### 3. Configurar CORS en Django

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    # Agregar tu dominio de producción
]
```

### 4. Descomentar Funciones API

En `/services/api.ts`, descomentar las funciones fetch y comentar los mocks.

### 5. Implementar Autenticación con Tokens

El sistema está preparado para usar tokens JWT:

```typescript
// Los tokens se guardan automáticamente en localStorage
// y se envían en el header Authorization: Bearer <token>
```

### 6. Modificar Hooks

Actualizar `/hooks/useAuth.tsx` para usar las funciones de `/services/api.ts`:

```typescript
import { apiLogin, apiRegister, apiLogout } from '../services/api';

const login = async (username: string, password: string) => {
  const user = await apiLogin(username, password);
  setUser(user);
  return true;
};
```

## 🗂️ Explicación de Carpetas

### `/pages`
Componentes de página completa, cada uno representa una ruta de la aplicación.

### `/components`
Componentes reutilizables más pequeños que se usan en múltiples páginas.

### `/layouts`
Componentes de layout que envuelven páginas (ej: Header + Content + Footer).

### `/hooks`
Hooks personalizados de React para lógica compartida:
- **useAuth**: Gestiona estado de autenticación y funciones login/register/logout
- **useFavorites**: Gestiona lista de favoritos en localStorage

### `/services`
Lógica de negocio y comunicación con APIs:
- **gamesMock.ts**: Datos de ejemplo y funciones de filtrado
- **api.ts**: Funciones preparadas para llamadas HTTP al backend

### `/styles`
Estilos globales, variables CSS y configuración de Tailwind.

## 🎯 Funcionalidades Principales

### 1. Home (/)
- Muestra juegos populares en cuadrícula responsiva
- Cambia el título según estado de autenticación
- Click en tarjetas lleva al recomendador
- Enlaces a login/registro o favoritos/logout

### 2. Recomendador (/recomendador)
- Formulario con 3 filtros: nombre, género, plataforma
- Validación en frontend
- Navega a resultados con query params

### 3. Resultados (/resultado)
- Lista de juegos filtrados
- Sección destacada con mejores ratings
- Botón "Agregar a Favoritos" (solo autenticados)
- Mensaje si no hay resultados

### 4. Login (/login)
- Formulario simple: usuario + contraseña
- En modo demo, acepta cualquier credencial
- Redirecciona a home después del login

### 5. Registro (/register)
- Formulario completo con preferencias de género/plataforma
- Validación de campos requeridos
- Auto-login después del registro

### 6. Favoritos (/favoritos)
- Requiere autenticación
- Lista personalizada de juegos guardados
- Botón para quitar de favoritos
- Estadísticas: total, rating promedio, géneros únicos

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router v6** - Enrutamiento
- **Tailwind CSS v4.0** - Framework de estilos
- **Lucide React** - Iconos
- **LocalStorage** - Persistencia en cliente

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1 columna)
- **Tablet**: 768px - 1023px (2 columnas)
- **Desktop**: ≥ 1024px (3 columnas)

## 🔐 Autenticación Mock

El sistema de autenticación actual es simulado para desarrollo:

- **Login**: Acepta cualquier usuario/contraseña
- **Registro**: Crea usuario en localStorage
- **Sesión**: Persiste en localStorage
- **Logout**: Limpia localStorage

**IMPORTANTE**: En producción, reemplazar con autenticación real y nunca almacenar contraseñas en texto plano.

## 💾 Datos Persistentes

Los siguientes datos se guardan en localStorage:

- `user`: Información del usuario autenticado
- `favorites`: Lista de juegos favoritos
- `authToken`: Token de autenticación (preparado para backend)

## 🎨 Personalización

### Cambiar Colores

Editar variables en `/styles/globals.css`:

```css
:root {
  --background: #0a0e27;
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  /* ... */
}
```

### Agregar Más Juegos

Editar `/services/gamesMock.ts` y agregar objetos al array `popularGames`:

```typescript
{
  id: '10',
  title: 'Nuevo Juego',
  image: 'https://...',
  rating: 9.0,
  genres: ['Action'],
  platforms: ['PC'],
  description: '...'
}
```

### Cambiar Géneros/Plataformas

Editar arrays en `/services/gamesMock.ts`:

```typescript
export const genres = ['Action', 'RPG', /* ... */];
export const platforms = ['PC', 'PlayStation', /* ... */];
```

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Estilos no se aplican
```bash
# Limpiar build de Tailwind
rm -rf .vite
npm run dev
```

### Las imágenes no cargan
Las imágenes usan Unsplash, verificar conexión a internet.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Desarrollo Futuro

- [ ] Integración con API real de Django
- [ ] Sistema de reseñas y comentarios
- [ ] Búsqueda avanzada con más filtros
- [ ] Sistema de puntuación de usuarios
- [ ] Recomendaciones personalizadas con IA
- [ ] Modo oscuro/claro
- [ ] Internacionalización (i18n)
- [ ] Progressive Web App (PWA)

## 📞 Contacto

Para preguntas o sugerencias sobre el proyecto, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ y ☕ para la comunidad gamer**
