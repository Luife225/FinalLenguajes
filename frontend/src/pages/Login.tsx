import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.message || 'Usuario o contraseña incorrectos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 440, margin: 'var(--sp-6) auto' }}>
        {/* Card contenedor */}
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
              <LogIn style={{ width: 22, height: 22 }} />
            </div>
            <h1 style={{ fontSize: '1.75rem', margin: '0 0 var(--sp-1) 0' }}>
              Iniciar Sesión
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Accede a tu cuenta y catálogo personal
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
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--sp-2)',
              }}>
                Usuario
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

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--sp-2)',
              }}>
                Contraseña
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block"
              style={{ marginTop: 'var(--sp-2)', height: 44 }}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Enlace al registro */}
          <div style={{
            marginTop: 'var(--sp-6)',
            paddingTop: 'var(--sp-5)',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}>
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
