import axios, { type AxiosError } from 'axios';
import { tokenStore } from '@utils/token';
import { logger } from '@utils/logger';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // para httpOnly cookies (refresh token)
});

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const serverMsg = error.response?.data?.message;
    logger.error('HTTP Error', { status, url: error.config?.url });
    // Control de salidas: mensajes genéricos al usuario
    return Promise.reject(new Error(resolveMessage(status, serverMsg)));
  },
);

const resolveMessage = (status?: number, msg?: string): string => {
  switch (status) {
    case 400: return msg ?? 'Datos inválidos. Verifica los campos.';
    case 401: return 'Sesión expirada o credenciales incorrectas.';
    case 403: return 'No tienes permiso para realizar esta acción.';
    case 404: return 'El recurso solicitado no existe.';
    case 409: return msg ?? 'Conflicto: el recurso ya existe.';
    case 500: return 'Error interno del servidor. Intenta más tarde.';
    default:  return 'Error de conexión. Verifica tu red.';
  }
};
