import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

// Pages
import { Home } from './pages/Home';
import { Recomendador } from './pages/Recomendador';
import { Resultado } from './pages/Resultado';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Favoritos } from './pages/Favoritos';
import { IAHub } from './pages/IAHub';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recomendador" element={<Recomendador />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/ia" element={<IAHub />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}