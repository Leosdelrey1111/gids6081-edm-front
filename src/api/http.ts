import axios, { type AxiosError } from 'axios';
import { tokenStore } from '@utils/token';
import { logger } from '@utils/logger';

const BASE_URL = import.meta.env.VITE_API_URL;

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface ApiErrorBody {
  message?: string | string[];
  error?:   string | string[];
  errorCode?: string;
  statusCode?: number;
}

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    const data   = error.response?.data;
    if (status !== 401) logger.error('HTTP Error', { status, url: error.config?.url });
    return Promise.reject(new Error(resolveMessage(status, data)));
  },
);

const extractMessages = (field?: string | string[]): string | undefined => {
  if (!field) return undefined;
  if (Array.isArray(field)) return field.join(' • ');
  return field;
};

const resolveMessage = (status?: number, data?: ApiErrorBody): string => {
  const detail = extractMessages(data?.error) ?? extractMessages(data?.message);
  switch (status) {
    case 400: return detail ?? 'Datos inválidos. Verifica los campos.';
    case 401: return 'Sesión expirada o credenciales incorrectas.';
    case 403: return 'No tienes permiso para realizar esta acción.';
    case 404: return 'El recurso solicitado no existe.';
    case 409: return detail ?? 'Conflicto: el recurso ya existe.';
    case 500: return 'Error interno del servidor. Intenta más tarde.';
    default:  return detail ?? 'Error de conexión. Verifica tu red.';
  }
};
