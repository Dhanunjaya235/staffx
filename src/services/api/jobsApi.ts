import AxiosInstance from './axiosInstance';
import { ApiEnvelope } from './helpers';

export interface AttachmentValue {
  filename: string;
  filetype: string;
  filedata: string;
}

export interface CreateJob {
  title: string;
  clientId: string;
  roleId: string;
  description: string;
  status?: string;
  deadline?: string | null;
  attachments?: AttachmentValue[];
}

export interface UpdateJob extends Partial<CreateJob> {}

export const jobsApi = {
  async getAll() {
    const res = await AxiosInstance.get<ApiEnvelope<any[]>>('/api/jobs');
    return res.data;
  },
  async getById(id: string) {
    const res = await AxiosInstance.get<ApiEnvelope<any>>(`/api/jobs/${id}`);
    return res.data;
  },
  async create(payload: CreateJob) {
    const res = await AxiosInstance.post<ApiEnvelope<any>>('/api/jobs', payload);
    return res.data;
  },
  async update(id: string, payload: UpdateJob) {
    const res = await AxiosInstance.patch<ApiEnvelope<any>>(`/api/jobs/${id}`, payload);
    return res.data;
  },
  async remove(id: string) {
    const res = await AxiosInstance.delete<ApiEnvelope<null>>(`/api/jobs/${id}`);
    return res.data;
  },
};

