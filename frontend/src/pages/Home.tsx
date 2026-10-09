import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { GameCard } from '../components/GameCard';
import { GameDetailsDialog, SelectedGame } from '../components/GameDetailsDialog';
import { getRecomendaciones } from '../services/api';
import { adaptAPIGamesToComponent } from '../utils/gameAdapter';
import { Game as ComponentGame } from '../services/gamesMock';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { DURATION, EASE, STAGGER, OFFSET, SCROLL, prefersReducedMotion } from '../utils/animationConstants';

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState<ComponentGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Obtener juegos recomendados de la API real
        const response = await getRecomendaciones();
        const adaptedGames = adaptAPIGamesToComponent(response.results || []);
        setGames(adaptedGames);
      } catch (err) {
        console.error('Error al cargar juegos:', err);
        setError('Error al cargar juegos. Por favor, intenta de nuevo.');
        // En caso de error, mantener la lista vacía o mostrar un mensaje
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, [isAuthenticated]);

  // GSAP animations
  useGSAP(() => {
    if (prefersReducedMotion() || isLoading) return;

    // Hero fade in
    gsap.from('.hero-section', {
      opacity: 0,
      y: OFFSET.sectionReveal,
      duration: DURATION.medium,
      ease: EASE.out,
    });

    // Grid cards staggered entrance
    const cards = containerRef.current?.querySelectorAll('.game-card');
    if (cards && cards.length > 0) {
      gsap.from(cards, {
        opacity: 0,
        y: OFFSET.cardEnter,
        duration: DURATION.medium,
        ease: EASE.out,
        stagger: STAGGER.grid,
        force3D: true,
      });
    }
  }, { scope: containerRef, dependencies: [isLoading, games] });

  return (
    <MainLayout footerLinkText="Ir al Recomendador" footerLinkTo="/recomendador">
      <div ref={containerRef} className="page-container">
        {/* Hero Section */}
        <div className="hero-section" style={{ textAlign: 'center', marginBottom: 'var(--sp-12)' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            marginBottom: 'var(--sp-3)',
          }}>
            {isAuthenticated
              ? `Recomendaciones para ${user?.username}`
              : 'Videojuegos Populares'}
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto var(--sp-8)',
          }}>
            {isAuthenticated
              ? 'Descubre juegos personalizados basados en tus preferencias'
              : 'Explora los mejores videojuegos del momento'}
          </p>

          {/* CTA */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--sp-6)',
            display: 'inline-block',
            maxWidth: '480px',
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--sp-2)' }}>
              ¿Buscas algo específico?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--sp-4)' }}>
              Usa nuestro sistema de recomendación para encontrar tu próximo juego favorito
            </p>
            <button
              onClick={() => navigate('/recomendador')}
              className="btn btn-primary btn-lg"
            >
              Probar el Recomendador
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="alert-error" style={{ marginBottom: 'var(--sp-6)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Loading state — skeletons */}
        {isLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--sp-5)',
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card" style={{ opacity: 0.6 }}>
                <div className="skeleton" style={{ aspectRatio: '16/9' }} />
                <div className="card-body">
                  <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 'var(--sp-2)' }} />
                  <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 'var(--sp-2)' }} />
                  <div className="skeleton" style={{ height: 12, width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : games.length > 0 ? (
          /* Games Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--sp-5)',
          }}>
            {games.map((game) => (
              <div key={game.id} className="game-card">
                <GameCard game={game} onOpenDetails={(selected) => setSelectedGame({ id: Number(selected.id), title: selected.title, image: selected.image })} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: 'var(--sp-16) 0' }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--sp-8)',
            }}>
              <AlertCircle style={{ width: 48, height: 48, color: 'var(--text-muted)', margin: '0 auto var(--sp-4)' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-2)' }}>
                No se encontraron juegos
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-5)' }}>
                Intenta recargar la página o usar el recomendador
              </p>
              <button
                onClick={() => navigate('/recomendador')}
                className="btn btn-primary"
              >
                Ir al Recomendador
              </button>
            </div>
          </div>
        )}
      </div>
      <GameDetailsDialog game={selectedGame} onClose={() => setSelectedGame(null)} />
    </MainLayout>
  );
};
