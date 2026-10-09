/**
 * API Service - Conexión con Django backend
 * 
 * Este archivo contiene todas las funciones para comunicarse con la API REST de Django
 */

// URL base del backend
// IMPORTANTE: Si tienes problemas de conexión, verifica que:
// 1. El backend esté corriendo: python manage.py runserver
// 2. Esté escuchando en http://localhost:8000
// 3. Si sigue fallando, prueba cambiar a 'http://127.0.0.1:8000/api'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('🔗 API Base URL:', BASE_URL);

// Configuración de headers
const getHeaders = (includeAuth: boolean = true) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Función helper para hacer requests
const fetchAPI = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(true),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // Si no es JSON, usar el texto de la respuesta
        const text = await response.text();
        errorData = { error: text || `Error: ${response.status} ${response.statusText}` };
      }
      
      // Si el error tiene múltiples campos (como validación de Django)
      if (errorData.error) {
        throw new Error(errorData.error);
      } else if (typeof errorData === 'object') {
        // Si hay múltiples errores, combinarlos
        const errors = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        throw new Error(errors || `Error: ${response.status}`);
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error: any) {
    // Si es un error de red (Failed to fetch), dar un mensaje más claro
    if (error instanceof TypeError && (error.message === 'Failed to fetch' || error.message.includes('fetch'))) {
      console.error('Error de conexión con el servidor:', error);
      console.error('URL intentada:', url);
      console.error('Verifica que:');
      console.error('1. El backend esté corriendo: python manage.py runserver');
      console.error('2. Esté escuchando en http://localhost:8000');
      console.error('3. No haya problemas de firewall');
      throw new Error(`No se pudo conectar con el servidor en ${BASE_URL}. Verifica que el backend esté corriendo en http://localhost:8000`);
    }
    console.error('API Error:', error);
    throw error;
  }
};

// ========== AUTENTICACIÓN ==========

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  genero_preferido?: string;
  plataforma_preferida?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile?: {
    genero_preferido: string | null;
    plataforma_preferida: string | null;
  };
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const data = await fetchAPI('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    // Guardar token
    if (data.tokens?.access) {
      localStorage.setItem('authToken', data.tokens.access);
    }

    return data;
  } catch (error: any) {
    // Mejorar mensajes de error
    if (error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8000');
    }
    throw error;
  }
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const data = await fetchAPI('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Guardar token
    if (data.tokens?.access) {
      localStorage.setItem('authToken', data.tokens.access);
    }

    return data;
  } catch (error: any) {
    // Mejorar mensajes de error
    if (error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8000');
    }
    throw error;
  }
};

export const getUserProfile = async (): Promise<User> => {
  const data = await fetchAPI('/auth/profile/', {
    method: 'GET',
  });

  return data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// ========== JUEGOS ==========

export interface Game {
  id: number;
  name: string;
  background_image?: string | null;
  rating?: number | null;
  genres?: Array<{ name: string }>;
  platforms?: Array<{ platform: { name: string } }>;
  es_favorito?: boolean;
}

export interface SearchGamesParams {
  nombre?: string;
  genero?: string;
  plataforma?: string;
  page?: number;
}

export interface SearchGamesResponse {
  results: Game[];
  highlighted: string[];
  total: number;
  has_more: boolean;
}

export const buscarJuegos = async (
  params: SearchGamesParams
): Promise<SearchGamesResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.nombre) queryParams.append('nombre', params.nombre);
  if (params.genero) queryParams.append('genero', params.genero);
  if (params.plataforma) queryParams.append('plataforma', params.plataforma);
  if (params.page) queryParams.append('page', String(params.page));

  const queryString = queryParams.toString();
  const endpoint = `/juegos/buscar/${queryString ? `?${queryString}` : ''}`;

  return await fetchAPI(endpoint, {
    method: 'GET',
  });
};

export interface GameDetails {
  id: number;
  name: string;
  background_image: string | null;
  description: string;
  rating: number | null;
  released: string | null;
  genres: string[];
  platforms: string[];
  developers: string[];
  publishers: string[];
  playtime: number | null;
  metacritic: number | null;
  esrb_rating: string | null;
  website: string | null;
}

export const getGameDetails = async (id: number): Promise<GameDetails> => {
  return await fetchAPI(`/juegos/${id}/`, { method: 'GET' });
};

export const getRecomendaciones = async (): Promise<{ results: Game[] }> => {
  return await fetchAPI('/juegos/recomendados/', {
    method: 'GET',
  });
};

export const getIADelDia = async (): Promise<Game> => {
  return await fetchAPI('/juegos/ia-del-dia/', {
    method: 'GET',
  });
};

// ========== FAVORITOS ==========

export interface Favorito {
  id: number;
  api_id: number;
  nombre: string;
  imagen: string;
  rating: number;
  genero: string;
  plataforma: string;
  created_at?: string;
}

export const getFavoritos = async (): Promise<{ results: Favorito[] }> => {
  return await fetchAPI('/favoritos/list/', {
    method: 'GET',
  });
};

export const addFavorito = async (apiId: number): Promise<Favorito> => {
  return await fetchAPI('/favoritos/add/', {
    method: 'POST',
    body: JSON.stringify({ api_id: apiId }),
  });
};

export const removeFavorito = async (favoritoId: number): Promise<{ message: string }> => {
  return await fetchAPI(`/favoritos/remove/${favoritoId}/`, {
    method: 'DELETE',
  });
};

// ========== IA ==========

export interface AIDiscoveryResponse {
  games: Array<Game & { reason: string }>;
  intent: {
    genre: string | null;
    platform: string | null;
    tags: string[];
  };
  used_preferences: boolean;
  reference_game: string | null;
  method: 'ia_y_similitud' | 'similitud';
}

export const discoverWithAI = async (prompt: string, usePreferences: boolean): Promise<AIDiscoveryResponse> => {
  return await fetchAPI('/ia/descubrir/', {
    method: 'POST',
    body: JSON.stringify({ prompt, use_preferences: usePreferences }),
  });
};

export interface IAChatResponse {
  respuesta: string;
  timestamp: string;
  modelo: string;
}

export interface IAAnalisisResponse {
  usuario_id: number;
  username: string;
  preferencias_actuales: {
    genero: string;
    plataforma: string;
  };
  analisis: {
    generos_recomendados: string[];
    plataformas_recomendadas: string[];
    nivel_experiencia: string;
    tipo_jugador: string;
  };
  recomendaciones_personales: string[];
  timestamp: string;
  modelo: string;
}

export const chatConIA = async (mensaje: string): Promise<IAChatResponse> => {
  return await fetchAPI('/ia/chat/', {
    method: 'POST',
    body: JSON.stringify({ mensaje }),
  });
};

export const getAnalisisIA = async (): Promise<IAAnalisisResponse> => {
  return await fetchAPI('/ia/analisis-usuario/', {
    method: 'GET',
  });
};
