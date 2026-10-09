import { useState, useCallback } from 'react';
import { chatConIA, getAnalisisIA, getIADelDia, IAChatResponse, IAAnalisisResponse, Game } from '../services/api';

export const useIA = () => {
  const [gameOfTheDay, setGameOfTheDay] = useState<Game | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [analisis, setAnalisis] = useState<IAAnalisisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener juego del día
  const loadGameOfTheDay = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const game = await getIADelDia();
      setGameOfTheDay(game);
      return game;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener juego del día';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chat con IA
  const askAI = useCallback(async (mensaje: string) => {
    if (!mensaje.trim()) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse('');

    try {
      const response: IAChatResponse = await chatConIA(mensaje);
      setAiResponse(response.respuesta);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al comunicarse con la IA';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener análisis del usuario
  const loadAnalisis = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const analisisData = await getAnalisisIA();
      setAnalisis(analisisData);
      return analisisData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener análisis';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpiar respuesta
  const clearResponse = useCallback(() => {
    setAiResponse('');
    setError(null);
  }, []);

  return {
    gameOfTheDay,
    aiResponse,
    analisis,
    isLoading,
    error,
    loadGameOfTheDay,
    askAI,
    loadAnalisis,
    clearResponse,
  };
};

