import { useState, useCallback } from 'react';
import { buscarJuegos, getRecomendaciones, SearchGamesParams, SearchGamesResponse, Game } from '../services/api';

export const useRecomendador = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar juegos con filtros
  const searchGames = useCallback(async (params: SearchGamesParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: SearchGamesResponse = await buscarJuegos(params);
      setGames(response.results || []);
      setHighlighted(response.highlighted || []);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar juegos';
      setError(errorMessage);
      setGames([]);
      setHighlighted([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener recomendaciones
  const getRecommended = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRecomendaciones();
      setGames(response.results || []);
      setHighlighted([]);
      return response.results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener recomendaciones';
      setError(errorMessage);
      setGames([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpiar resultados
  const clearResults = useCallback(() => {
    setGames([]);
    setHighlighted([]);
    setError(null);
  }, []);

  return {
    games,
    highlighted,
    isLoading,
    error,
    searchGames,
    getRecommended,
    clearResults,
  };
};

