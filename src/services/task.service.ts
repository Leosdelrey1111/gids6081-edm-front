import { http } from '@services/http';
import { logger } from '@utils/logger';

export interface Task { id: number; name: string; description: string; priority: boolean; user_id: number; }
export interface CreateTaskPayload { name: string; description: string; priority: boolean; user_id: number; }
export type UpdateTaskPayload = Partial<Omit<CreateTaskPayload, 'user_id'>>;

export const taskService = {
  async getMyTasks(userId: number): Promise<Task[]> {
    const { data } = await http.get<Task[]>('/api/task');
    logger.info('Tasks fetched', { userId, count: data.length });
    // Cliente asumido: filtra solo las tareas del usuario autenticado
    return data.filter(t => t.user_id === userId);
  },

  async create(payload: CreateTaskPayload, userId: number): Promise<Task> {
    const { data } = await http.post<Task>('/api/task', { ...payload, user_id: userId });
    logger.audit('TASK_CREATE', userId, { name: payload.name });
    return data;
  },

  async update(id: number, payload: UpdateTaskPayload, userId: number): Promise<Task> {
    const { data } = await http.put<Task>(`/api/task/${id}`, payload);
    logger.audit('TASK_UPDATE', userId, { taskId: id });
    return data;
  },

  async remove(id: number, userId: number): Promise<void> {
    await http.delete(`/api/task/${id}`);
    logger.audit('TASK_DELETE', userId, { taskId: id });
  },
};
