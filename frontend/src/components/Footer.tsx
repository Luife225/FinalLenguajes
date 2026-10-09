import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

interface FooterProps {
  linkText?: string;
  linkTo?: string;
}

export const Footer = ({ linkText, linkTo }: FooterProps) => {
  return (
    <footer className="site-footer">
      <div className="page-container" style={{ padding: 'var(--sp-6) var(--sp-4)' }}>
        {linkText && linkTo && (
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
            <Link to={linkTo} className="btn btn-primary btn-lg">
              {linkText}
            </Link>
          </div>
        )}

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--sp-4)',
          color: 'var(--text-muted)',
          fontSize: '0.8125rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <Gamepad2 style={{ width: 16, height: 16, color: 'var(--accent)' }} />
            <span>© 2025 GameRecommend</span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--sp-5)' }}>
            <a href="#" className="link-accent" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Términos</a>
            <a href="#" className="link-accent" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Privacidad</a>
            <a href="#" className="link-accent" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
