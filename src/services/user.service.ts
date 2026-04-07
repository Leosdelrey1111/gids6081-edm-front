import { http } from '@services/http';
import { logger } from '@utils/logger';

export interface User { id: number; name: string; lastName: string; username: string; createdAt: string; }
export type UpdateUserPayload = Partial<Pick<User, 'name' | 'lastName' | 'username'> & { password: string }>;

export const userService = {
  async getAll(requesterId: number): Promise<User[]> {
    const { data } = await http.get<User[]>('/api/user');
    logger.audit('USER_LIST', requesterId);
    return data;
  },

  async update(id: number, payload: UpdateUserPayload, requesterId: number): Promise<User> {
    const { data } = await http.put<User>(`/api/user/${id}`, payload);
    logger.audit('USER_UPDATE', requesterId, { targetId: id });
    return data;
  },

  async remove(id: number, requesterId: number): Promise<void> {
    await http.delete(`/api/user/${id}`);
    logger.audit('USER_DELETE', requesterId, { targetId: id });
  },
};
