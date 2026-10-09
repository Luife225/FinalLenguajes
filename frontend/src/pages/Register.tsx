import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import {
  availableGenres,
  availablePlatforms,
  genreToCode,
  platformToCode,
} from '../utils/genrePlatformMapping';
import { UserPlus, Mail, Lock, User, Gamepad2, AlertCircle } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    preferredGenre: '',
    preferredPlatform: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convertir nombres legibles a códigos del backend
      const generoCode =
        formData.preferredGenre && formData.preferredGenre !== ''
          ? genreToCode(formData.preferredGenre) || formData.preferredGenre.toLowerCase()
          : undefined;
      const plataformaCode =
        formData.preferredPlatform && formData.preferredPlatform !== ''
          ? platformToCode(formData.preferredPlatform) || formData.preferredPlatform
          : undefined;

      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password,
        genero_preferido: generoCode || null,
        plataforma_preferida: plataformaCode || null,
      });
      navigate('/');
    } catch (err: any) {
      console.error('Error en registro:', err);
      setError(err?.message || 'Error al registrar usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 480, margin: 'var(--sp-6) auto' }}>
        <div style={{
          backgroundColor: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--sp-8)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--sp-6)', textAlign: 'center' }}>
            <div style={{
              width: 44,
              height: 44,
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--sp-3)',
              color: 'var(--accent)',
            }}>
              <UserPlus style={{ width: 22, height: 22 }} />
            </div>
            <h1 style={{ fontSize: '1.75rem', margin: '0 0 var(--sp-1) 0' }}>
              Crear Cuenta
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Personaliza tus recomendaciones y guarda tus juegos
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              padding: 'var(--sp-3) var(--sp-4)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger-color)',
              fontSize: '0.875rem',
              marginBottom: 'var(--sp-5)',
            }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {/* Username */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--sp-2)',
              }}>
                Usuario *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Tu nombre de usuario"
                  className="input"
                  style={{ paddingLeft: 'var(--sp-10)' }}
                  required
                />
                <User style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--sp-2)',
              }}>
                Correo Electrónico *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="input"
                  style={{ paddingLeft: 'var(--sp-10)' }}
                  required
                />
                <Mail style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--sp-2)',
              }}>
                Contraseña (mínimo 8 caracteres) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingLeft: 'var(--sp-10)' }}
                  required
                />
                <Lock style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Género Preferido */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--sp-2)',
              }}>
                Género Preferido
              </label>
              <select
                value={formData.preferredGenre}
                onChange={(e) => setFormData({ ...formData, preferredGenre: e.target.value })}
                className="input"
                style={{ cursor: 'pointer' }}
              >
                <option value="">Selecciona un género (opcional)</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Plataforma Preferida */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--sp-2)',
              }}>
                Plataforma Preferida
              </label>
              <select
                value={formData.preferredPlatform}
                onChange={(e) => setFormData({ ...formData, preferredPlatform: e.target.value })}
                className="input"
                style={{ cursor: 'pointer' }}
              >
                <option value="">Selecciona una plataforma (opcional)</option>
                {availablePlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block"
              style={{ marginTop: 'var(--sp-3)', height: 44 }}
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Enlace al login */}
          <div style={{
            marginTop: 'var(--sp-6)',
            paddingTop: 'var(--sp-5)',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}>
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
