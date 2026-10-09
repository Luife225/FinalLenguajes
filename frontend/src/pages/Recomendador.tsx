import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { availableGenres, availablePlatforms, genreToCode, platformToCode } from '../utils/genrePlatformMapping';
import { Search } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DURATION, EASE, OFFSET, prefersReducedMotion } from '../utils/animationConstants';

export const Recomendador = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    genre: 'all',
    platform: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navegar a resultados con los filtros como query params
    const params = new URLSearchParams();
    if (formData.name) params.append('name', formData.name);
    if (formData.genre !== 'all') {
      // Convertir nombre legible a código para la búsqueda
      const genreCode = genreToCode(formData.genre) || formData.genre;
      params.append('genre', genreCode);
    }
    if (formData.platform !== 'all') {
      // Convertir nombre legible a código para la búsqueda
      const platformCode = platformToCode(formData.platform) || formData.platform;
      params.append('platform', platformCode);
    }
    
    navigate(`/resultado?${params.toString()}`);
  };

  // GSAP entrance
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.from('.rec-header', {
      opacity: 0,
      y: OFFSET.sectionReveal,
      duration: DURATION.medium,
      ease: EASE.out,
    });
    gsap.from('.rec-form', {
      opacity: 0,
      y: OFFSET.cardEnter,
      duration: DURATION.medium,
      ease: EASE.out,
      delay: 0.15,
    });
    gsap.from('.rec-stats', {
      opacity: 0,
      y: OFFSET.cardEnter,
      duration: DURATION.normal,
      ease: EASE.out,
      delay: 0.3,
    });
  }, { scope: containerRef });

  return (
    <MainLayout footerLinkText="Volver a la Página Principal" footerLinkTo="/">
      <div ref={containerRef} className="page-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Header */}
        <div className="rec-header" style={{ textAlign: 'center', marginBottom: 'var(--sp-10)' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', marginBottom: 'var(--sp-3)' }}>
            Buscar Juegos
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Encuentra tu próximo juego favorito usando los filtros
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rec-form">
          <div className="card" style={{ padding: 'var(--sp-6)' }}>
            {/* Game name */}
            <div style={{ marginBottom: 'var(--sp-5)' }}>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <Search style={{ width: 14, height: 14 }} />
                Nombre del juego (opcional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Cyber, Racing, Horror..."
                className="input"
              />
            </div>

            {/* Genre */}
            <div style={{ marginBottom: 'var(--sp-5)' }}>
              <label className="field-label">Género</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="select-input"
              >
                <option value="all">Todos los géneros</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div style={{ marginBottom: 'var(--sp-6)' }}>
              <label className="field-label">Plataforma</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="select-input"
              >
                <option value="all">Todas las plataformas</option>
                {availablePlatforms.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-lg btn-block">
              Recomendar Juegos
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="rec-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--sp-4)',
          marginTop: 'var(--sp-8)',
        }}>
          <div className="stat-card">
            <div className="stat-value">500+</div>
            <div className="stat-label">Juegos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">12</div>
            <div className="stat-label">Géneros</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">5</div>
            <div className="stat-label">Plataformas</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
