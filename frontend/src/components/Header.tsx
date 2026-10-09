import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Gamepad2, Heart, LogOut, LogIn, UserPlus, Brain } from 'lucide-react';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="page-container" style={{ padding: 'var(--sp-4) var(--sp-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', textDecoration: 'none' }}>
            <Gamepad2 style={{ width: 24, height: 24, color: 'var(--accent)' }} />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
            }}>
              GameRecommend
            </span>
          </Link>

          {/* Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            {isAuthenticated ? (
              <>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }} className="hidden sm:inline">
                  {user?.username}
                </span>
                <Link to="/ia" className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
                  <Brain style={{ width: 16, height: 16 }} />
                  <span className="hidden sm:inline">IA</span>
                </Link>
                <Link to="/favoritos" className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
                  <Heart style={{ width: 16, height: 16 }} />
                  <span className="hidden sm:inline">Favoritos</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
                  <LogOut style={{ width: 16, height: 16 }} />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
                  <LogIn style={{ width: 16, height: 16 }} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.8125rem' }}>
                  <UserPlus style={{ width: 16, height: 16 }} />
                  <span className="hidden sm:inline">Registro</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};