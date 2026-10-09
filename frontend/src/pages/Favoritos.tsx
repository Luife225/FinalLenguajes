import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { FavoriteCard } from '../components/FavoriteCard';
import { GameDetailsDialog, SelectedGame } from '../components/GameDetailsDialog';
import { useFavorites } from '../hooks/useFavorites';
import { Heart, Compass } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DURATION, EASE, STAGGER, OFFSET, prefersReducedMotion } from '../utils/animationConstants';

export const Favoritos = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);

  useGSAP(() => {
    if (prefersReducedMotion() || favorites.length === 0) return;

    const cards = containerRef.current?.querySelectorAll('.card');
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: OFFSET.cardEnter },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.normal,
          stagger: STAGGER.grid,
          ease: EASE.out,
          clearProps: 'opacity,transform',
        }
      );
    }
  }, [favorites.length]);

  const handleRemove = async (favoritoId: number) => {
    try {
      await removeFavorite(favoritoId);
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  const avgRating =
    favorites.length > 0
      ? (favorites.reduce((sum, fav) => sum + (Number(fav.rating) || 0), 0) / favorites.length).toFixed(1)
      : '0.0';

  const uniqueGenresCount = new Set(
    favorites.flatMap((fav) => (fav.genero ? fav.genero.split(',').map((g) => g.trim()) : []))
  ).size;

  return (
    <MainLayout footerLinkText="Volver a la Página Principal" footerLinkTo="/">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{ marginBottom: 'var(--sp-8)' }}>
          <h1 style={{ margin: '0 0 var(--sp-2) 0' }}>Mis Favoritos</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
            {favorites.length > 0
              ? `Colección personal con ${favorites.length} videojuego${favorites.length !== 1 ? 's' : ''} guardado${favorites.length !== 1 ? 's' : ''}.`
              : 'Colección de videojuegos guardados.'}
          </p>
        </div>

        {/* Grid de favoritos */}
        {favorites.length > 0 ? (
          <div>
            <div className="results-grid" style={{ marginBottom: 'var(--sp-12)' }}>
              {favorites.map((favorito) => {
                const game = {
                  id: String(favorito.id),
                  title: favorito.nombre,
                  image: favorito.imagen,
                  rating: favorito.rating,
                  genres: favorito.genero ? favorito.genero.split(',').map((g) => g.trim()) : [],
                  platforms: favorito.plataforma ? favorito.plataforma.split(',').map((p) => p.trim()) : [],
                };
                return (
                  <FavoriteCard
                    key={favorito.id}
                    game={game}
                    onRemove={() => handleRemove(favorito.id)}
                    onOpenDetails={() => setSelectedGame({ id: favorito.api_id, title: game.title, image: game.image })}
                  />
                );
              })}
            </div>

            {/* Estadísticas de la colección */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--sp-4)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: 'var(--sp-8)',
            }}>
              <div style={{
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--sp-5)',
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1,
                  marginBottom: 'var(--sp-2)',
                }}>
                  {favorites.length}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Juegos Guardados</div>
              </div>

              <div style={{
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--sp-5)',
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1,
                  marginBottom: 'var(--sp-2)',
                }}>
                  {avgRating}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Rating Promedio</div>
              </div>

              <div style={{
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--sp-5)',
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1,
                  marginBottom: 'var(--sp-2)',
                }}>
                  {uniqueGenresCount}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Géneros Únicos</div>
              </div>
            </div>
          </div>
        ) : (
          /* Estado vacío */
          <div style={{
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--sp-12) var(--sp-6)',
            textAlign: 'center',
            maxWidth: 520,
            margin: 'var(--sp-8) auto',
          }}>
            <Heart style={{
              width: 44,
              height: 44,
              color: 'var(--text-muted)',
              margin: '0 auto var(--sp-4)',
            }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-2)' }}>
              Tu lista de favoritos está vacía
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.9375rem',
              marginBottom: 'var(--sp-6)',
              lineHeight: 1.5,
            }}>
              Guarda tus títulos preferidos para tener acceso rápido y permitir que las recomendaciones se adapten mejor a tu perfil.
            </p>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                <Compass style={{ width: 16, height: 16 }} />
                Explorar Catálogo
              </button>
              <button
                onClick={() => navigate('/recomendador')}
                className="btn btn-secondary"
              >
                Buscar con Filtros
              </button>
            </div>
          </div>
        )}
      </div>
      <GameDetailsDialog game={selectedGame} onClose={() => setSelectedGame(null)} />
    </MainLayout>
  );
};
