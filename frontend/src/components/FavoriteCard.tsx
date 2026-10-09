import { Star, Trash2 } from 'lucide-react';
import { Game } from '../services/gamesMock';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FavoriteCardProps {
  game: Game;
  onRemove: (gameId: string | number) => void;
  onOpenDetails: () => void;
}

export const FavoriteCard = ({ game, onRemove, onOpenDetails }: FavoriteCardProps) => {
  return (
    <article className="card result-card">
      <button type="button" className="game-card-trigger" onClick={onOpenDetails} aria-label={`Ver detalles de ${game.title}`}>
      {/* Cover image */}
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
          margin: '0 0 var(--sp-3) 0',
          fontFamily: 'var(--font-heading)',
        }}>
          {game.title}
        </h3>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Rating:</span>
            <span className="rating" style={{ fontSize: '0.875rem' }}>
              <Star style={{ width: 14, height: 14, fill: 'var(--rating)', stroke: 'var(--rating)' }} />
              {game.rating}/5
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Género:</span>
            <span className="genre-text">{game.genres[0]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Plataforma:</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{game.platforms[0]}</span>
          </div>
        </div>
      </div>
      </button>
      <div className="result-card-action">
        {/* Remove button */}
        <button
          onClick={() => onRemove(game.id)}
          className="btn btn-danger btn-block"
        >
          <Trash2 style={{ width: 16, height: 16 }} />
          Quitar de Favoritos
        </button>
      </div>
    </article>
  );
};
