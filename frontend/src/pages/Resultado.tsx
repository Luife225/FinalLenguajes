import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ResultCard } from '../components/ResultCard';
import { GameDetailsDialog, SelectedGame } from '../components/GameDetailsDialog';
import { Game as ComponentGame } from '../services/gamesMock';
import { buscarJuegos, SearchGamesParams } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { adaptAPIGamesToComponent, isHighlightedGame } from '../utils/gameAdapter';
import { AlertCircle, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DURATION, EASE, STAGGER, OFFSET, prefersReducedMotion } from '../utils/animationConstants';

export const Resultado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<ComponentGame[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);
  const { addFavorite, isFavorite } = useFavorites();
  const containerRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const animatedCount = useRef(0);

  const filters: SearchGamesParams = {
    nombre: searchParams.get('name') || undefined,
    genero: searchParams.get('genre') || undefined,
    plataforma: searchParams.get('platform') || undefined,
  };
  const searchKey = searchParams.toString();

  useEffect(() => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    setResults([]);
    animatedCount.current = 0;
    setTotal(0);
    setPage(1);
    setHasMore(false);
    setIsLoadingMore(false);

    const loadGames = async () => {
      try {
        const response = await buscarJuegos({ ...filters, page: 1 });
        if (currentRequest !== requestId.current) return;
        const adaptedGames = adaptAPIGamesToComponent(response.results);
        const markedGames = adaptedGames.map((game) => ({
          ...game,
          isHighlighted: isHighlightedGame(game.title, response.highlighted || []),
        }));
        setResults(markedGames);
        setTotal(response.total);
        setHasMore(response.has_more);
      } catch (err) {
        if (currentRequest !== requestId.current) return;
        setError(err instanceof Error ? err.message : 'Error al buscar juegos');
      } finally {
        if (currentRequest === requestId.current) setIsLoading(false);
      }
    };

    loadGames();
    return () => { requestId.current += 1; };
  }, [searchKey]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    const currentRequest = requestId.current;
    setIsLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const response = await buscarJuegos({ ...filters, page: nextPage });
      if (currentRequest !== requestId.current) return;
      const games = adaptAPIGamesToComponent(response.results).map((game) => ({
        ...game,
        isHighlighted: isHighlightedGame(game.title, response.highlighted || []),
      }));
      setResults((previous) => {
        const seen = new Set(previous.map((game) => game.id));
        return [...previous, ...games.filter((game) => !seen.has(game.id))];
      });
      setPage(nextPage);
      setTotal(response.total);
      setHasMore(response.has_more);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar más juegos');
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoadingMore(false);
    }
  };

  // GSAP animations on results change
  useGSAP(() => {
    if (prefersReducedMotion() || isLoading || results.length === 0) return;

    const cards = Array.from(containerRef.current?.querySelectorAll('.results-grid .card') || []);
    const newCards = cards.slice(animatedCount.current);
    animatedCount.current = cards.length;
    if (newCards.length > 0) {
      gsap.fromTo(
        newCards,
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
  }, [results, isLoading]);

  const handleAddFavorite = async (game: ComponentGame) => {
    try {
      const apiId = parseInt(game.id);
      await addFavorite(apiId);
    } catch (err) {
      console.error('Error al agregar favorito:', err);
    }
  };

  return (
    <MainLayout footerLinkText="Volver al Recomendador" footerLinkTo="/recomendador">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        {/* Header de resultados */}
        <div style={{ marginBottom: 'var(--sp-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-3)' }}>
            <h1 style={{ margin: 0 }}>Resultados de la Búsqueda</h1>
            <button
              onClick={() => navigate('/recomendador')}
              className="btn btn-secondary"
            >
              <SlidersHorizontal style={{ width: 16, height: 16 }} />
              Ajustar Filtros
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
            {isLoading
              ? 'Buscando juegos en la base de datos...'
              : `Se encontraron ${total} juego${total !== 1 ? 's' : ''} que coinciden con tus preferencias.`}
          </p>
        </div>

        {error && (
          <div style={{
            padding: 'var(--sp-4)',
            backgroundColor: 'var(--danger-subtle)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            marginBottom: 'var(--sp-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-3)'
          }}>
            <AlertCircle style={{ width: 20, height: 20, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="results-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton" style={{ height: 190 }} />
                <div style={{ padding: 'var(--sp-4)' }}>
                  <div className="skeleton" style={{ height: 22, width: '80%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div>
            <section>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                marginBottom: 'var(--sp-4)',
                paddingBottom: 'var(--sp-2)',
                borderBottom: '1px solid var(--border-color)',
              }}>
                <div style={{
                  width: 3,
                  height: 18,
                  backgroundColor: 'var(--text-muted)',
                  borderRadius: 2,
                }} />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Juegos para ti</h2>
              </div>
              <div className="results-grid">
                {results.map((game) => {
                  const apiId = parseInt(game.id);
                  return (
                    <ResultCard
                      key={game.id}
                      game={game}
                      onOpenDetails={(selected) => setSelectedGame({ id: Number(selected.id), title: selected.title, image: selected.image })}
                      onAddFavorite={handleAddFavorite}
                      isFavorite={isFavorite(apiId)}
                    />
                  );
                })}
              </div>
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 'var(--sp-8)' }}>
                  <button className="btn btn-primary" onClick={handleLoadMore} disabled={isLoadingMore}>
                    {isLoadingMore ? 'Cargando juegos...' : 'Cargar más juegos parecidos'}
                  </button>
                </div>
              )}
            </section>
          </div>
        ) : !error && (
          /* Estado sin resultados */
          <div style={{
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--sp-12) var(--sp-6)',
            textAlign: 'center',
            maxWidth: 520,
            margin: 'var(--sp-8) auto',
          }}>
            <AlertCircle style={{
              width: 48,
              height: 48,
              color: 'var(--text-muted)',
              margin: '0 auto var(--sp-4)',
            }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-2)' }}>
              No se encontraron resultados
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.9375rem',
              marginBottom: 'var(--sp-6)',
              lineHeight: 1.5,
            }}>
              No encontramos juegos que coincidan exactamente con tus filtros. Intenta seleccionar otros géneros o plataformas.
            </p>
            <button
              onClick={() => navigate('/recomendador')}
              className="btn btn-primary"
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Volver al Recomendador
            </button>
          </div>
        )}
      </div>
      <GameDetailsDialog game={selectedGame} onClose={() => setSelectedGame(null)} />
    </MainLayout>
  );
};
