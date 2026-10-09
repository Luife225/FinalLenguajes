export interface Game {
  id: string;
  title: string;
  image: string;
  rating: number;
  genres: string[];
  platforms: string[];
  description?: string;
  isHighlighted?: boolean;
}

// Datos mock de videojuegos populares
export const popularGames: Game[] = [
  {
    id: '1',
    title: 'Cyber Warriors 2077',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    rating: 9.2,
    genres: ['Action', 'RPG', 'Sci-Fi'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    description: 'Un juego de acción futurista en mundo abierto'
  },
  {
    id: '2',
    title: 'Medieval Legends',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
    rating: 8.9,
    genres: ['RPG', 'Adventure', 'Fantasy'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    description: 'Épica aventura medieval con dragones y magia'
  },
  {
    id: '3',
    title: 'Speed Racing Ultimate',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
    rating: 8.5,
    genres: ['Racing', 'Sports'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    description: 'Carreras de alta velocidad con gráficos realistas'
  },
  {
    id: '4',
    title: 'Galaxy Defenders',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800',
    rating: 9.0,
    genres: ['Shooter', 'Sci-Fi', 'Multiplayer'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    description: 'Shooter espacial cooperativo para hasta 4 jugadores'
  },
  {
    id: '5',
    title: 'Horror Mansion',
    image: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=800',
    rating: 8.7,
    genres: ['Horror', 'Survival', 'Adventure'],
    platforms: ['PC', 'PlayStation'],
    description: 'Terror psicológico en primera persona'
  },
  {
    id: '6',
    title: 'Fantasy Quest',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
    rating: 9.3,
    genres: ['RPG', 'Adventure', 'Fantasy'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    description: 'JRPG con combates por turnos y mundo mágico'
  },
  {
    id: '7',
    title: 'Battle Royale Extreme',
    image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800',
    rating: 8.8,
    genres: ['Shooter', 'Battle Royale', 'Multiplayer'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Mobile'],
    description: '100 jugadores, solo uno sobrevive'
  },
  {
    id: '8',
    title: 'City Builder Pro',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    rating: 8.4,
    genres: ['Strategy', 'Simulation'],
    platforms: ['PC'],
    description: 'Construye y administra tu propia metrópolis'
  },
  {
    id: '9',
    title: 'Stealth Assassin',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    rating: 9.1,
    genres: ['Action', 'Stealth', 'Adventure'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    description: 'Infiltración y sigilo en misiones históricas'
  }
];

// Juegos recomendados basados en filtros
export const getRecommendedGames = (filters?: {
  name?: string;
  genre?: string;
  platform?: string;
}): { results: Game[]; highlighted: Game[] } => {
  let filteredGames = [...popularGames];

  if (filters?.name) {
    filteredGames = filteredGames.filter(game =>
      game.title.toLowerCase().includes(filters.name!.toLowerCase())
    );
  }

  if (filters?.genre && filters.genre !== 'all') {
    filteredGames = filteredGames.filter(game =>
      game.genres.includes(filters.genre!)
    );
  }

  if (filters?.platform && filters.platform !== 'all') {
    filteredGames = filteredGames.filter(game =>
      game.platforms.includes(filters.platform!)
    );
  }

  // Seleccionar juegos destacados (los de mayor rating)
  const sortedByRating = [...filteredGames].sort((a, b) => b.rating - a.rating);
  const highlighted = sortedByRating.slice(0, 3).map(game => ({
    ...game,
    isHighlighted: true
  }));

  return {
    results: filteredGames,
    highlighted
  };
};

// Obtener juegos populares
export const getPopularGames = (): Game[] => {
  return popularGames;
};

// Géneros disponibles
export const genres = [
  'Action',
  'Adventure',
  'RPG',
  'Shooter',
  'Strategy',
  'Simulation',
  'Racing',
  'Sports',
  'Horror',
  'Puzzle',
  'Fighting',
  'Platformer'
];

// Plataformas disponibles
export const platforms = [
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Mobile'
];
