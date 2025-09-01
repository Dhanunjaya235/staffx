import AxiosInstance from './axiosInstance';
import { ApiEnvelope } from './helpers';

export const usersApi = {
  async getAll() {
    const res = await AxiosInstance.get<ApiEnvelope<any[]>>('/api/users');
    return res.data;
  },
  async assignRole(userId: string, roleId: string) {
    const res = await AxiosInstance.post<ApiEnvelope<any>>(`/api/users/${userId}/assign-role`, { roleId });
    return res.data;
  },
};

