type Level = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

const write = (level: Level, message: string, ctx?: Record<string, unknown>) => {
  const prefix = `[${new Date().toISOString()}] [${level}]`;
  if (level === 'ERROR') console.error(prefix, message, ctx ?? '');
  else if (level === 'WARN') console.warn(prefix, message, ctx ?? '');
  else console.log(prefix, message, ctx ?? '');
};

export const logger = {
  info:  (msg: string, ctx?: Record<string, unknown>) => write('INFO',  msg, ctx),
  warn:  (msg: string, ctx?: Record<string, unknown>) => write('WARN',  msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => write('ERROR', msg, ctx),
  audit: (action: string, userId?: number, ctx?: Record<string, unknown>) =>
    write('AUDIT', `[USER:${userId ?? 'anon'}] ${action}`, ctx),
};
