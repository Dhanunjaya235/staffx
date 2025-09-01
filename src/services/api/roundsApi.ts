import AxiosInstance from './axiosInstance';
import { ApiEnvelope } from './helpers';

export interface AttachmentValue {
  filename: string;
  filetype: string;
  filedata: string;
}

export interface CreateInterviewRound {
  roundNumber: number;
  roundType: string;
  interviewer: string;
  date: string;
  status: string;
  feedback?: string;
  resourceId: string;
  attachments?: AttachmentValue[];
}

export interface UpdateInterviewRound extends Partial<CreateInterviewRound> {}

export const roundsApi = {
  async getByResourceId(resourceId: string) {
    const res = await AxiosInstance.get<ApiEnvelope<any[]>>(`/api/resources/${resourceId}/rounds`);
    return res.data;
  },
  async create(payload: CreateInterviewRound) {
    const res = await AxiosInstance.post<ApiEnvelope<any>>('/api/rounds', payload);
    return res.data;
  },
  async update(id: string, payload: UpdateInterviewRound) {
    const res = await AxiosInstance.patch<ApiEnvelope<any>>(`/api/rounds/${id}`, payload);
    return res.data;
  },
  async remove(id: string) {
    const res = await AxiosInstance.delete<ApiEnvelope<null>>(`/api/rounds/${id}`);
    return res.data;
  },
};

