import { http } from "@services/http";

const sanitizeLog = (val: string) => val.replace(/[\r\n\t]/g, " ").trim();

export const logger = {
  error: (msg: string, ctx?: Record<string, unknown>) => {
    const safe = sanitizeLog(msg);
    console.error(`[${new Date().toISOString()}] [ERROR]`, safe, ctx ?? "");
    http
      .post("/api/logs", { statusCode: 500, path: safe, errorCode: ctx ? JSON.stringify(ctx) : undefined })
      .catch(() => {});
  },
};
