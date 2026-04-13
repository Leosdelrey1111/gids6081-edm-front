// token en memoria, no en localStorage
let _token: string | null = null;

export const tokenStore = {
  set: (t: string) => { _token = t; },
  get: () => _token,
  clear: () => { _token = null; },
};

export interface JwtPayload {
  sub: number;
  username: string;
  name: string;
  lastName: string;
  exp: number;
  iat: number;
}

// decodifica el payload sin verificar firma (eso lo hace el servidor)
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/'))) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const p = decodeToken(token);
  return !p || Date.now() >= p.exp * 1000;
};
