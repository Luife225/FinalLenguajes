import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import type { ReactNode } from 'react';

// Pages
import { Home } from './pages/Home';
import { Recomendador } from './pages/Recomendador';
import { Resultado } from './pages/Resultado';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Favoritos } from './pages/Favoritos';
import { IAHub } from './pages/IAHub';

const AuthRoute = ({ children, requireAuth = false }: { children: ReactNode; requireAuth?: boolean }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="page-container">Comprobando sesión...</div>;
  if (requireAuth && !isAuthenticated) return <Navigate to="/login" replace />;
  if (!requireAuth && isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recomendador" element={<Recomendador />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/favoritos" element={<AuthRoute requireAuth><Favoritos /></AuthRoute>} />
          <Route path="/ia" element={<IAHub />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
