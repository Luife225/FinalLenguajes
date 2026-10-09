import { Star } from 'lucide-react';
import { Game } from '../services/gamesMock';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GameCardProps {
  game: Game;
  onOpenDetails: (game: Game) => void;
}

export const GameCard = ({ game, onOpenDetails }: GameCardProps) => {
  return (
    <button type="button" className="card game-card-trigger" onClick={() => onOpenDetails(game)} aria-label={`Ver detalles de ${game.title}`}>
      {/* Cover image — the main visual element */}
      <div className="card-img">
        <ImageWithFallback
          src={game.image}
          alt={game.title}
        />
      </div>

      {/* Content */}
      <div className="card-body">
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: '0 0 var(--sp-2) 0',
          fontFamily: 'var(--font-heading)',
        }}>
          {game.title}
        </h3>

        {/* Rating */}
        <div className="rating" style={{ marginBottom: 'var(--sp-2)' }}>
          <Star style={{ width: 14, height: 14, fill: 'var(--rating)', stroke: 'var(--rating)' }} />
          <span>{game.rating}</span>
        </div>

        {/* Genres — dot separated grey text */}
        <div className="genre-text">
          {game.genres.slice(0, 3).join(' · ')}
        </div>

        {/* Platforms */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
          {game.platforms.slice(0, 3).join(' · ')}
        </div>
      </div>
    </button>
  );
};
