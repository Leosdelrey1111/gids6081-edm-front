import { http } from '@api/http';

export interface Log {
  id: number;
  statusCode: number;
  timestamp: string;
  path: string;
  errorCode?: string | null;
  session_id?: number | null;
}

export const logsService = {
  async getMyLogs(): Promise<Log[]> {
    const { data } = await http.get<Log[]>('/api/logs');
    return data;
  },
};
