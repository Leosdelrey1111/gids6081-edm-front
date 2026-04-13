export interface AuthUser {
  sub: number;
  name: string;
  lastName: string;
  exp: number;
  iat: number;
}

export interface SessionData {
  accessToken: string;
  loggedIn: boolean;
}

export const newSessionData = (): SessionData => ({ accessToken: '', loggedIn: false });
