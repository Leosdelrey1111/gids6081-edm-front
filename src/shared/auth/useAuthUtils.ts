import { tokenStore, decodeToken, isTokenExpired } from '@utils/token';
import { logger } from '@utils/logger';
import type { AuthUser, Role, SessionData } from './AuthInterfaces';

const SESSION_KEY = 'edm-session';

/** Sub=1 es admin. En producción el rol vendría en el JWT desde el servidor. */
export const resolveRole = (sub: number): Role => (sub === 1 ? 'admin' : 'user');

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

/** Restaura sesión desde sessionStorage al recargar la página */
export function restoreSession(): AuthUser | null {
  const session = sessionStore.load();
  if (!session.loggedIn || !session.accessToken) return null;
  if (isTokenExpired(session.accessToken)) { sessionStore.clear(); return null; }
  const payload = decodeToken(session.accessToken);
  if (!payload) return null;
  tokenStore.set(session.accessToken);
  return { ...payload, role: resolveRole(payload.sub) };
}
