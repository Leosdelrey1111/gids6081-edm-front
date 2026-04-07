import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { Provider } from './provider';
import { OpenRoutes, ProtectedRoute } from '@guards/index';
import { DashboardLayout } from '@layout/DashboardLayout';
import { LandingLayout, HomePage } from '@modules/landing/pages/index';
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { TasksPage } from '@pages/tasks/TasksPage';
import { UsersPage } from '@pages/users/UsersPage';

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Provider>
        <Routes>
          {/* Rutas públicas — redirige al dashboard si ya hay sesión */}
          <Route element={<OpenRoutes />}>
            <Route element={<LandingLayout />}>
              <Route path="/"         element={<HomePage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasks"     element={<TasksPage />} />
              {/* Solo admin — separación de funciones */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Provider>
    </AuthProvider>
  </BrowserRouter>
);
