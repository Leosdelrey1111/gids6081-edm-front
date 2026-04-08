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
import { LogsPage } from '@pages/logs/LogsPage';

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Provider>
        <Routes>
          <Route element={<OpenRoutes />}>
            <Route element={<LandingLayout />}>
              <Route path="/"         element={<HomePage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasks"     element={<TasksPage />} />
              <Route path="/users"     element={<UsersPage />} />
              <Route path="/logs"      element={<LogsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Provider>
    </AuthProvider>
  </BrowserRouter>
);
