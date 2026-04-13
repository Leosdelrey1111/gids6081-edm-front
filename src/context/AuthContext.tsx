import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@api/endpoints/auth.service';
import { tokenStore } from '@utils/token';
import { sessionStore, restoreSession } from './authUtils';
import type { AuthUser } from './AuthInterfaces';

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
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { payload, accessToken } = await authService.login(username, password);
    tokenStore.set(accessToken);
    sessionStore.save({ accessToken, loggedIn: true });
    setUser(payload as AuthUser);
  };

  const register = async (name: string, lastName: string, username: string, password: string) => {
    const { payload, accessToken } = await authService.register({ name, lastName, username, password });
    tokenStore.set(accessToken);
    sessionStore.save({ accessToken, loggedIn: true });
    setUser(payload as AuthUser);
  };

  const logout = () => {
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
