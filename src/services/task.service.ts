import { http } from '@services/http';

export interface Task { id: number; name: string; description: string; priority: boolean; user_id: number; }
export interface CreateTaskPayload { name: string; description: string; priority: boolean; user_id: number; }
export type UpdateTaskPayload = Partial<Omit<CreateTaskPayload, 'user_id'>>;

export const taskService = {
  async getMyTasks(userId: number): Promise<Task[]> {
    const { data } = await http.get<Task[]>('/api/task');
    return data.filter(t => t.user_id === userId);
  },

  async create(payload: CreateTaskPayload, userId: number): Promise<Task> {
    const { data } = await http.post<Task>('/api/task', { ...payload, user_id: userId });
    return data;
  },

  async update(id: number, payload: UpdateTaskPayload, userId: number): Promise<Task> {
    const { data } = await http.put<Task>(`/api/task/${id}`, payload);
    return data;
  },

  async remove(id: number, userId: number): Promise<void> {
    await http.delete(`/api/task/${id}`);
  },
};
