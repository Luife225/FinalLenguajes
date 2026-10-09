import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Compass, Sparkles, WandSparkles } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { GameCard } from '../components/GameCard';
import { GameDetailsDialog, SelectedGame } from '../components/GameDetailsDialog';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { AIDiscoveryResponse, discoverWithAI } from '../services/api';
import { adaptAPIGameToComponent } from '../utils/gameAdapter';
import { genreCodeToName, platformCodeToName } from '../utils/genrePlatformMapping';

const suggestions = [
  'Quiero un RPG con buena historia para PC',
  'Juego de hermanos demonios y mitad humano que pelean',
  'Un juego de terror y supervivencia para PlayStation 5',
];

export const IAHub = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const [prompt, setPrompt] = useState('');
  const [usePreferences, setUsePreferences] = useState(true);
  const [response, setResponse] = useState<AIDiscoveryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (prompt.trim().length < 8 || isLoading) return;
    setIsLoading(true);
    setError(null);
    setResponse(null);
    try {
      setResponse(await discoverWithAI(prompt.trim(), usePreferences));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron buscar juegos');
    } finally {
      setIsLoading(false);
    }
  };

  const profileGenre = user?.profile?.genero_preferido;
  const profilePlatform = user?.profile?.plataforma_preferida;
  const intentLabels = response
    ? [response.intent.genre, response.intent.platform, ...response.intent.tags].filter(Boolean)
    : [];

  return (
    <MainLayout>
      <div className="ai-page">
        <div className="ai-hero">
          <div className="ai-eyebrow"><Sparkles size={15} /> DESCUBRIMIENTO CON IA</div>
          <h1>Cuéntanos qué quieres jugar</h1>
          <p>Describe una experiencia, un género o cómo quieres jugar. Comparamos tu idea con juegos reales para encontrar los que mejor encajan contigo.</p>
        </div>

        <div className="ai-workspace">
          <section className="ai-search-panel" aria-labelledby="ai-search-title">
            <div className="ai-panel-heading">
              <div className="ai-icon"><WandSparkles size={21} /></div>
              <div>
                <h2 id="ai-search-title">Tu próxima aventura empieza aquí</h2>
                <p>Escribe con tus propias palabras. No necesitas conocer filtros ni categorías.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="ai-prompt">¿Qué te apetece jugar?</label>
              <textarea
                id="ai-prompt"
                className="ai-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Por ejemplo: quiero explorar un mundo abierto, con buena historia y que pueda jugar en PC..."
                maxLength={300}
                rows={4}
                required
                minLength={8}
              />
              <div className="ai-form-footer">
                <span>{prompt.length}/300 caracteres</span>
                <button type="submit" className="btn btn-primary" disabled={isLoading || prompt.trim().length < 8}>
                  {isLoading ? 'Buscando juegos...' : 'Encontrar juegos'}
                  {!isLoading && <ArrowRight size={17} />}
                </button>
              </div>
            </form>
            <div className="ai-examples">
              <span>Prueba una idea:</span>
              <div>
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" className="chip" onClick={() => setPrompt(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="ai-context-panel">
            <div className="ai-icon ai-icon-muted"><Compass size={21} /></div>
            <h2>Tu punto de partida</h2>
            <p>Podemos tener en cuenta las preferencias que guardaste en tu perfil y los géneros de tus favoritos.</p>
            <dl className="ai-context-list">
              <div><dt>Género preferido</dt><dd>{profileGenre ? genreCodeToName(profileGenre) : 'Sin definir'}</dd></div>
              <div><dt>Plataforma</dt><dd>{profilePlatform ? platformCodeToName(profilePlatform) : 'Sin definir'}</dd></div>
              <div><dt>Favoritos</dt><dd>{favorites.length} juegos</dd></div>
            </dl>
            <label className="ai-preferences-toggle">
              <input type="checkbox" checked={usePreferences} onChange={(event) => setUsePreferences(event.target.checked)} />
              <span>Usar mis preferencias</span>
            </label>
            <p className="ai-context-note">Tu descripción siempre tiene prioridad. Los juegos que ya guardaste no se repiten en los resultados.</p>
          </aside>
        </div>

        {error && <div className="alert-error ai-feedback" role="alert">{error}</div>}
        {isLoading && <div className="ai-feedback ai-loading" role="status"><Brain size={20} /> Interpretando tu idea y buscando en el catálogo...</div>}

        {response && (
          <section className="ai-results" aria-live="polite">
            <div className="ai-results-heading">
              <div>
                <div className="ai-eyebrow">RESULTADO DE TU BÚSQUEDA</div>
                <h2>{response.reference_game ? `Juegos parecidos a ${response.reference_game}` : 'Juegos que encajan con tu idea'}</h2>
              </div>
              <span>{response.games.length} sugerencias · {response.method === 'ia_y_similitud' ? 'IA + catálogo verificado' : 'Similitud de contenido'}</span>
            </div>
            {(intentLabels.length > 0 || response.reference_game) && (
              <div className="ai-intent" aria-label="Características interpretadas">
                <span>La IA entendió:</span>
                {response.reference_game && <span className="ai-intent-tag">{response.reference_game}</span>}
                {intentLabels.map((label) => <span className="ai-intent-tag" key={label}>{label}</span>)}
              </div>
            )}
            {response.games.length > 0 ? (
              <div className="ai-results-grid">
                {response.games.map((item) => {
                  const game = adaptAPIGameToComponent(item);
                  return (
                    <div className="ai-result-item" key={item.id}>
                      <GameCard game={game} onOpenDetails={() => setSelectedGame({ id: item.id, title: game.title, image: game.image })} />
                      <p><Sparkles size={15} /> {item.reason}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="ai-empty-results">
                <p>No encontramos juegos con esa combinación. Prueba una idea más amplia o desactiva alguna preferencia.</p>
                <button className="btn btn-ghost" onClick={() => navigate('/recomendador')}>Buscar con filtros</button>
              </div>
            )}
          </section>
        )}

        {!response && !isLoading && !error && (
          <div className="ai-empty-hint"><Brain size={21} /> Tu búsqueda aparecerá aquí con juegos reales y una razón para cada sugerencia.</div>
        )}
      </div>
      <GameDetailsDialog game={selectedGame} onClose={() => setSelectedGame(null)} />
    </MainLayout>
  );
};
