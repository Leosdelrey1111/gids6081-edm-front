import { tokenStore, decodeToken, isTokenExpired } from "@utils/token";
import type { AuthUser, SessionData } from "./AuthInterfaces";

const SESSION_KEY = "edm-session";

export const sessionStore = {
  save(data: SessionData): void {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch {}
  },
  load(): SessionData {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw) as SessionData;
    } catch {}
    return { accessToken: "", loggedIn: false };
  },
  clear(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
  },
};

export function restoreSession(): AuthUser | null {
  const session = sessionStore.load();
  if (!session.loggedIn || !session.accessToken) return null;
  if (isTokenExpired(session.accessToken)) {
    sessionStore.clear();
    return null;
  }
  const payload = decodeToken(session.accessToken);
  if (!payload) return null;
  tokenStore.set(session.accessToken);
  return payload as AuthUser;
}
