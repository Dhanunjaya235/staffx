import AxiosInstance from './axiosInstance';
import { ApiEnvelope } from './helpers';

export interface CreateRole {
  name: string;
  department: string;
  level: string;
  skillsRequired: string[];
  experienceMin: number;
  experienceMax: number;
  description?: string;
}

export interface UpdateRole extends Partial<CreateRole> {}

export const rolesApi = {
  async getAll() {
    const res = await AxiosInstance.get<ApiEnvelope<any[]>>('/api/roles');
    return res.data;
  },
  async getById(id: string) {
    const res = await AxiosInstance.get<ApiEnvelope<any>>(`/api/roles/${id}`);
    return res.data;
  },
  async create(payload: CreateRole) {
    const res = await AxiosInstance.post<ApiEnvelope<any>>('/api/roles', payload);
    return res.data;
  },
  async update(id: string, payload: UpdateRole) {
    const res = await AxiosInstance.patch<ApiEnvelope<any>>(`/api/roles/${id}`, payload);
    return res.data;
  },
  async remove(id: string) {
    const res = await AxiosInstance.delete<ApiEnvelope<null>>(`/api/roles/${id}`);
    return res.data;
  },
};

