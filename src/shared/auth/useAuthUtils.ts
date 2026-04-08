import { tokenStore, decodeToken, isTokenExpired } from '@utils/token';
import { logger } from '@utils/logger';
import type { AuthUser, SessionData } from './AuthInterfaces';

const SESSION_KEY = 'edm-session';

export const sessionStore = {
  save(data: SessionData): void {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); }
    catch { logger.warn('sessionStorage no disponible'); }
  },
  load(): SessionData {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw) as SessionData;
    } catch { logger.warn('Error al leer sesión'); }
    return { accessToken: '', loggedIn: false };
  },
  clear(): void {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  },
};

export function restoreSession(): AuthUser | null {
  const session = sessionStore.load();
  if (!session.loggedIn || !session.accessToken) return null;
  if (isTokenExpired(session.accessToken)) { sessionStore.clear(); return null; }
  const payload = decodeToken(session.accessToken);
  if (!payload) return null;
  tokenStore.set(session.accessToken);
  return payload as AuthUser;
}
