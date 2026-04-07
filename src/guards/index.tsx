import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import type { Role } from '@shared/auth/AuthInterfaces';
import { logger } from '@utils/logger';

/** Rutas públicas: redirige al dashboard si ya hay sesión */
export function OpenRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, loading, navigate]);
  return <Outlet />;
}

/** Rutas protegidas: requieren autenticación y opcionalmente un rol */
export function ProtectedRoute({ requiredRole }: { requiredRole?: Role }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return (
    <div className="loading-screen bg-[#0b0d0c]">
      <svg className="animate-spin w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    </div>
  );

  if (!isAuthenticated) {
    logger.warn('Acceso denegado: no autenticado');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    logger.warn('Acceso denegado: rol insuficiente', { required: requiredRole, actual: user?.role });
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
