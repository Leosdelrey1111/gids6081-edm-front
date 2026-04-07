export type Role = 'admin' | 'user';

export interface AuthUser {
  sub: number;
  username: string;
  name: string;
  lastName: string;
  role: Role;
  exp: number;
  iat: number;
}

export interface SessionData {
  accessToken: string;
  loggedIn: boolean;
}

export const newSessionData = (): SessionData => ({ accessToken: '', loggedIn: false });
