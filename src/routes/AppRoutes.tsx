import { Routes, Route, Navigate } from 'react-router-dom';
import { OpenRoutes, ProtectedRoute } from '@guards/AuthGuards';
import { LandingLayout } from '@layout/LandingLayout';
import { DashboardLayout } from '@layout/DashboardLayout';
import { HomePage } from '@pages/landing/HomePage';
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { TasksPage } from '@pages/tasks/TasksPage';
import { UsersPage } from '@pages/users/UsersPage';
import { NotFoundPage } from '@pages/errors/NotFoundPage';
import { ForbiddenPage } from '@pages/errors/ForbiddenPage';

export function AppRoutes() {
  return (
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
        </Route>
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
