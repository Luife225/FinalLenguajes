import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getFavoritos, addFavorito, removeFavorito, Favorito as FavoritoType } from '../services/api';

export interface FavoritoGame {
  id: string;
  title: string;
  image: string;
  rating: number;
  genres: string[];
  platforms: string[];
}

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoritoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar favoritos desde la API
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getFavoritos();
      setFavorites(response.results || []);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Cargar favoritos al montar o cuando cambia la autenticación
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Agregar favorito
  const addFavorite = async (apiId: number) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para agregar favoritos');
    }

    try {
      const newFavorito = await addFavorito(apiId);
      setFavorites((prev) => [...prev, newFavorito]);
      return newFavorito;
    } catch (error) {
      console.error('Error al agregar favorito:', error);
      throw error;
    }
  };

  // Eliminar favorito
  const removeFavorite = async (favoritoId: number) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para eliminar favoritos');
    }

    try {
      await removeFavorito(favoritoId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoritoId));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      throw error;
    }
  };

  // Verificar si un juego es favorito
  const isFavorite = (apiId: number): boolean => {
    return favorites.some((fav) => fav.api_id === apiId);
  };

  // Obtener ID del favorito por api_id
  const getFavoriteId = (apiId: number): number | null => {
    const favorito = favorites.find((fav) => fav.api_id === apiId);
    return favorito ? favorito.id : null;
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    refreshFavorites: loadFavorites,
  };
};
