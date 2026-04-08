import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@services/auth.service';
import { tokenStore } from '@utils/token';
import { logger } from '@utils/logger';
import { sessionStore, restoreSession } from '@shared/auth/useAuthUtils';
import type { AuthUser } from '@shared/auth/AuthInterfaces';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, lastName: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export type { AuthUser };

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
    tokenStore.set(accessToken);
    sessionStore.save({ accessToken, loggedIn: true });
    setUser(payload as AuthUser);
    logger.audit('LOGIN', payload.sub, { username });
  };

  const register = async (name: string, lastName: string, username: string, password: string) => {
    const { payload, accessToken } = await authService.register({ name, lastName, username, password });
    tokenStore.set(accessToken);
    sessionStore.save({ accessToken, loggedIn: true });
    setUser(payload as AuthUser);
    logger.audit('REGISTER', payload.sub, { username });
  };

  const logout = () => {
    logger.audit('LOGOUT', user?.sub);
    tokenStore.clear();
    sessionStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
