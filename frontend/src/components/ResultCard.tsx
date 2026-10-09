import { Star, Heart } from 'lucide-react';
import { Game } from '../services/gamesMock';
import { useAuth } from '../hooks/useAuth';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ResultCardProps {
  game: Game;
  onAddFavorite?: (game: Game) => void;
  onOpenDetails: (game: Game) => void;
  isFavorite?: boolean;
}

export const ResultCard = ({ game, onAddFavorite, onOpenDetails, isFavorite }: ResultCardProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <article className="card result-card">
      <button type="button" className="game-card-trigger" onClick={() => onOpenDetails(game)} aria-label={`Ver detalles de ${game.title}`}>
      {/* Cover image */}
      <div className="card-img">
        <ImageWithFallback
          src={game.image}
          alt={game.title}
        />
      </div>

      {/* Content */}
      <div className="card-body">
        {game.isHighlighted && (
          <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, marginBottom: 'var(--sp-2)' }}>
            DESTACADO PARA TI
          </div>
        )}
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: '0 0 var(--sp-3) 0',
          fontFamily: 'var(--font-heading)',
        }}>
          {game.title}
        </h3>

        {/* Rating */}
        <div className="rating" style={{ marginBottom: 'var(--sp-3)' }}>
          <Star style={{ width: 16, height: 16, fill: 'var(--rating)', stroke: 'var(--rating)' }} />
          <span style={{ fontSize: '1rem' }}>{game.rating}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8125rem' }}>/ 5</span>
        </div>

        {/* Genres — dot separated */}
        <div className="genre-text" style={{ marginBottom: 'var(--sp-2)' }}>
          {game.genres.join(' · ')}
        </div>

        {/* Platforms */}
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: 'var(--sp-4)',
        }}>
          {game.platforms.join(' · ')}
        </div>
      </div>
      </button>

      {/* Favorite button */}
      {(isAuthenticated || isFavorite) && <div className="result-card-action">
        {isAuthenticated && onAddFavorite && !isFavorite && (
          <button
            onClick={() => onAddFavorite(game)}
            className="btn btn-primary btn-block"
          >
            <Heart style={{ width: 16, height: 16 }} />
            Agregar a Favoritos
          </button>
        )}

        {isFavorite && (
          <div className="badge-fav">
            <Heart style={{ width: 14, height: 14, fill: 'var(--accent)' }} />
            En tus favoritos
          </div>
        )}
      </div>}
    </article>
  );
};
