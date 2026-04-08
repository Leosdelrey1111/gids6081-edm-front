import { http } from '@services/http';

type Level = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

const sanitizeLog = (val: string) => val.replace(/[\r\n\t]/g, ' ').trim();

const write = (level: Level, message: string, ctx?: Record<string, unknown>) => {
  const safe = sanitizeLog(message);
  const prefix = `[${new Date().toISOString()}] [${level}]`;
  if (level === 'ERROR') console.error(prefix, safe, ctx ?? '');
  else if (level === 'WARN') console.warn(prefix, safe, ctx ?? '');
  else console.log(prefix, safe, ctx ?? '');
};

const sendToServer = (statusCode: number, path: string, errorCode?: string) => {
  http.post('/api/logs', { statusCode, path: sanitizeLog(path), errorCode }).catch(() => {/* silencioso */});
};

export const logger = {
  info:  (msg: string, ctx?: Record<string, unknown>) => write('INFO',  msg, ctx),
  warn:  (msg: string, ctx?: Record<string, unknown>) => write('WARN',  msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => {
    write('ERROR', msg, ctx);
    sendToServer(500, msg, ctx ? JSON.stringify(ctx) : undefined);
  },
  audit: (action: string, userId?: number, ctx?: Record<string, unknown>) => {
    write('AUDIT', `[USER:${userId ?? 'anon'}] ${action}`, ctx);
    sendToServer(200, action, undefined);
  },
};
