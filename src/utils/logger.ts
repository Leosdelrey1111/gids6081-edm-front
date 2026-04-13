import { http } from '@api/http';

const sanitizeLog = (val: string) => val.replace(/[\r\n\t]/g, ' ').trim();

const sendLog = (statusCode: number, path: string, errorCode?: string) => {
  if (path.includes('/api/logs')) return;
  http.post('/api/logs', { statusCode, path, errorCode }).catch(() => {});
};

export const logger = {
  error: (msg: string, ctx?: Record<string, unknown>) => {
    const safe = sanitizeLog(msg);
    console.error(`[${new Date().toISOString()}] [ERROR]`, safe, ctx ?? '');
    sendLog(500, safe, ctx ? JSON.stringify(ctx) : undefined);
  },
  warn: (msg: string, ctx?: Record<string, unknown>) => {
    const safe = sanitizeLog(msg);
    console.warn(`[${new Date().toISOString()}] [WARN]`, safe, ctx ?? '');
  },
};
