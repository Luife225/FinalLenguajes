/**
 * Mapeo entre nombres legibles de géneros/plataformas y códigos del backend
 */

// Mapeo de géneros: nombre legible -> código del backend/RAWG
export const genreMapping: Record<string, string> = {
  'Action': 'action',
  'Adventure': 'adventure',
  'RPG': 'role-playing-games-rpg',
  'Shooter': 'shooter',
  'Strategy': 'strategy',
  'Simulation': 'simulation',
  'Racing': 'racing',
  'Sports': 'sports',
  'Horror': 'horror',
  'Puzzle': 'puzzle',
  'Fighting': 'fighting',
  'Platformer': 'platformer',
  'Indie': 'indie',
};

// Mapeo inverso: código -> nombre legible
export const genreReverseMapping: Record<string, string> = {
  'action': 'Action',
  'adventure': 'Adventure',
  'role-playing-games-rpg': 'RPG',
  'rpg': 'RPG',
  'shooter': 'Shooter',
  'strategy': 'Strategy',
  'simulation': 'Simulation',
  'racing': 'Racing',
  'sports': 'Sports',
  'horror': 'Horror',
  'puzzle': 'Puzzle',
  'fighting': 'Fighting',
  'platformer': 'Platformer',
  'indie': 'Indie',
};

// Mapeo de plataformas: nombre legible -> código del backend/RAWG
export const platformMapping: Record<string, string> = {
  'PC': '4',
  'PlayStation': '187',
  'PlayStation 5': '187',
  'PlayStation 4': '18',
  'Xbox': '1',
  'Xbox One': '1',
  'Xbox Series X': '186',
  'Nintendo Switch': '7',
  'Switch': '7',
  'Mobile': '3',
  'iOS': '3',
  'Android': '21',
};

// Mapeo inverso: código -> nombre legible
export const platformReverseMapping: Record<string, string> = {
  '4': 'PC',
  '187': 'PlayStation 5',
  '18': 'PlayStation 4',
  '1': 'Xbox One',
  '186': 'Xbox Series X',
  '7': 'Nintendo Switch',
  '3': 'iOS',
  '21': 'Android',
};

/**
 * Convierte un nombre de género legible al código del backend
 */
export const genreToCode = (genreName: string): string | undefined => {
  return genreMapping[genreName] || genreName.toLowerCase();
};

/**
 * Convierte un código de género al nombre legible formateado
 */
export const genreCodeToName = (code: string | undefined | null): string => {
  if (!code) return 'No especificado';
  const clean = String(code).trim().toLowerCase();
  if (genreReverseMapping[clean]) return genreReverseMapping[clean];
  const exact = Object.keys(genreMapping).find((k) => k.toLowerCase() === clean);
  if (exact) return exact;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

/**
 * Convierte un nombre de plataforma legible al código del backend
 */
export const platformToCode = (platformName: string): string | undefined => {
  return platformMapping[platformName] || platformName;
};

/**
 * Convierte un código o ID de plataforma al nombre legible formateado
 */
export const platformCodeToName = (code: string | number | undefined | null): string => {
  if (!code && code !== 0) return 'No especificada';
  const str = String(code).trim();
  if (platformReverseMapping[str]) return platformReverseMapping[str];
  const exact = Object.keys(platformMapping).find((k) => k.toLowerCase() === str.toLowerCase());
  if (exact) return exact;
  return str;
};

// Géneros disponibles para el formulario (usando nombres legibles)
export const availableGenres = Object.keys(genreMapping);

// Plataformas disponibles para el formulario (usando nombres legibles)
export const availablePlatforms = Object.keys(platformMapping);
