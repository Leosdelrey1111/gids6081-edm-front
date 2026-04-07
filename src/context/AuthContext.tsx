import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@services/auth.service';
import { tokenStore } from '@utils/token';
import { logger } from '@utils/logger';
import { sessionStore, resolveRole, restoreSession } from '@shared/auth/useAuthUtils';
import type { AuthUser, Role } from '@shared/auth/AuthInterfaces';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, lastName: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export type { Role, AuthUser };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restored = restoreSession();
    if (restored) {
      setUser(restored);
      logger.info('Sesión restaurada', { userId: restored.sub });
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { payload, accessToken } = await authService.login(username, password);
    const authUser: AuthUser = { ...payload, role: resolveRole(payload.sub) };
    tokenStore.set(accessToken);
    sessionStore.save({ accessToken, loggedIn: true });
    setUser(authUser);
    logger.audit('LOGIN', authUser.sub, { username });
  };

  const register = async (name: string, lastName: string, username: string, password: string) => {
    const { payload, accessToken } = await authService.register({ name, lastName, username, password });
    const authUser: AuthUser = { ...payload, role: resolveRole(payload.sub) };
    tokenStore.set(accessToken);
    sessionStore.save({ accessToken, loggedIn: true });
    setUser(authUser);
    logger.audit('REGISTER', authUser.sub, { username });
  };

  const logout = () => {
    logger.audit('LOGOUT', user?.sub);
    tokenStore.clear();
    sessionStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin: user?.role === 'admin', loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
