import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { logger } from "@utils/logger";
import { LoadingPage } from "@/components/LoadingPage";

export function OpenRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, loading, navigate]);
  return <Outlet />;
}

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingPage />;

  if (!isAuthenticated) {
    logger.warn("Acceso denegado: no autenticado");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
