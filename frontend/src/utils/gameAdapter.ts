import { Game as APIGame } from '../services/api';
import { Game as ComponentGame } from '../services/gamesMock';

/**
 * Convierte un juego de la API al formato usado por los componentes
 */
export const adaptAPIGameToComponent = (apiGame: APIGame): ComponentGame => {
  return {
    id: String(apiGame.id),
    title: apiGame.name,
    image: apiGame.background_image || '',
    rating: apiGame.rating || 0,
    genres: apiGame.genres?.map((g) => g.name) || [],
    platforms: apiGame.platforms?.map((p) => p.platform.name) || [],
    description: '',
    isHighlighted: apiGame.es_favorito || false,
  };
};

/**
 * Convierte múltiples juegos de la API al formato usado por los componentes
 */
export const adaptAPIGamesToComponent = (apiGames: APIGame[]): ComponentGame[] => {
  return apiGames.map(adaptAPIGameToComponent);
};

/**
 * Verifica si un juego está en la lista de destacados
 */
export const isHighlightedGame = (
  gameName: string,
  highlightedNames: string[]
): boolean => {
  return highlightedNames.includes(gameName);
};

