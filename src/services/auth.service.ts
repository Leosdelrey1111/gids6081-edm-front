import { http } from '@services/http';
import { decodeToken, type JwtPayload } from '@utils/token';
import { logger } from '@utils/logger';

interface AuthTokens { access_token: string; refresh_token: string; }
export interface RegisterPayload { name: string; lastName: string; username: string; password: string; }
export interface AuthResult { payload: JwtPayload; accessToken: string; }

export const authService = {
  async login(username: string, password: string): Promise<AuthResult> {
    const { data } = await http.post<AuthTokens>('/api/auth/login', { username, password });
    const payload = decodeToken(data.access_token);
    if (!payload) throw new Error('Token inválido recibido del servidor.');
    logger.audit('LOGIN_SERVICE', payload.sub);
    return { payload, accessToken: data.access_token };
  },

  async register(body: RegisterPayload): Promise<AuthResult> {
    const { data } = await http.post<AuthTokens>('/api/auth/register', body);
    const payload = decodeToken(data.access_token);
    if (!payload) throw new Error('Token inválido recibido del servidor.');
    logger.audit('REGISTER_SERVICE', payload.sub);
    return { payload, accessToken: data.access_token };
  },

  async resetPassword(username: string, newPassword: string): Promise<void> {
    await http.post('/api/auth/reset-password', { username, newPassword });
  },
};
