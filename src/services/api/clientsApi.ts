import AxiosInstance from './axiosInstance';
import { ApiEnvelope } from './helpers';

export interface CreateClient {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  contacts: Contact[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface UpdateClient extends Partial<CreateClient> {}

export const clientsApi = {
  async getAll() {
    const res = await AxiosInstance.get<ApiEnvelope<any[]>>('/api/clients');
    return res.data;
  },
  async getById(id: string) {
    const res = await AxiosInstance.get<ApiEnvelope<any>>(`/api/clients/${id}`);
    return res.data;
  },
  async create(payload: CreateClient) {
    const res = await AxiosInstance.post<ApiEnvelope<any>>('/api/clients', payload);
    return res.data;
  },
  async update(id: string, payload: UpdateClient) {
    const res = await AxiosInstance.patch<ApiEnvelope<any>>(`/api/clients/${id}` , payload);
    return res.data;
  },
  async remove(id: string) {
    const res = await AxiosInstance.delete<ApiEnvelope<null>>(`/api/clients/${id}`);
    return res.data;
  },
};

