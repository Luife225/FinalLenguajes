import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ExternalLink, X } from 'lucide-react';
import { GameDetails, getGameDetails } from '../services/api';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface SelectedGame {
  id: number;
  title: string;
  image?: string;
}

interface GameDetailsDialogProps {
  game: SelectedGame | null;
  onClose: () => void;
}

export const GameDetailsDialog = ({ game, onClose }: GameDetailsDialogProps) => {
  const [details, setDetails] = useState<GameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!game) return;
    let active = true;
    setDetails(null);
    setError(null);
    setIsLoading(true);
    getGameDetails(game.id)
      .then((data) => { if (active) setDetails(data); })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'No se pudo cargar el juego');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [game?.id]);

  const released = details?.released
    ? new Date(`${details.released}T00:00:00`).toLocaleDateString('es-PE', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;
  const website = details?.website && /^https?:\/\//i.test(details.website) ? details.website : null;

  return (
    <Dialog.Root open={game !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="game-detail-overlay" />
        <Dialog.Content className="game-detail-dialog" aria-describedby="game-detail-description">
          <Dialog.Close className="game-detail-close" aria-label="Cerrar detalles del juego">
            <X size={20} />
          </Dialog.Close>
          <div className="game-detail-image">
            <ImageWithFallback src={details?.background_image || game?.image || ''} alt={details?.name || game?.title || 'Videojuego'} />
          </div>
          <div className="game-detail-body">
            <Dialog.Title className="game-detail-title">{details?.name || game?.title}</Dialog.Title>
            <Dialog.Description id="game-detail-description" className="game-detail-intro">
              Información del videojuego
            </Dialog.Description>

            {isLoading && <p role="status">Cargando descripción y detalles...</p>}
            {error && <div className="alert-error" role="alert">{error}</div>}
            {details && (
              <>
                <h3 className="game-detail-heading">Descripción</h3>
                <p className="game-detail-description">
                  {details.description || 'Este juego aún no tiene descripción disponible.'}
                </p>
                <div className="game-detail-facts">
                  {details.platforms.length > 0 && <div><strong>Plataformas</strong><span>{details.platforms.join(' · ')}</span></div>}
                  {details.genres.length > 0 && <div><strong>Géneros</strong><span>{details.genres.join(' · ')}</span></div>}
                  {released && <div><strong>Lanzamiento</strong><span>{released}</span></div>}
                  {details.developers.length > 0 && <div><strong>Desarrollador</strong><span>{details.developers.join(', ')}</span></div>}
                  {details.publishers.length > 0 && <div><strong>Editor</strong><span>{details.publishers.join(', ')}</span></div>}
                  {details.rating !== null && <div><strong>Valoración RAWG</strong><span>{details.rating} / 5</span></div>}
                  {details.metacritic !== null && <div><strong>Metacritic</strong><span>{details.metacritic} / 100</span></div>}
                  {details.playtime !== null && details.playtime > 0 && <div><strong>Tiempo medio</strong><span>{details.playtime} horas</span></div>}
                  {details.esrb_rating && <div><strong>Clasificación</strong><span>{details.esrb_rating}</span></div>}
                </div>
                {website && (
                  <a className="game-detail-link" href={website} target="_blank" rel="noopener noreferrer">
                    Sitio oficial <ExternalLink size={16} />
                  </a>
                )}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
