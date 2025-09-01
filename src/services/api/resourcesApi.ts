import AxiosInstance from './axiosInstance';
import { ApiEnvelope } from './helpers';

export interface FileValue {
  fileName: string;
  fileType: string;
  fileValue: string;
}

export interface AttachmentValue {
  filename: string;
  filetype: string;
  filedata: string;
}

export type ResourceType = 'Cognine' | 'Contract' | 'Vendor' | 'Direct';

export interface CreateResourceCommon {
  name: string;
  email: string;
  phone: string;
  jobId: string;
  clientId: string;
  resourceType: ResourceType;
  skills: string[];
  experience: number;
  resume?: FileValue | null;
  attachments?: AttachmentValue[];
}

export interface CreateVendorResource extends CreateResourceCommon {
  vendorId: string;
}

export type CreateResource = CreateResourceCommon | CreateVendorResource;

export interface UpdateResource extends Partial<CreateResourceCommon> {}

export const resourcesApi = {
  async getAll() {
    const res = await AxiosInstance.get<ApiEnvelope<any[]>>('/api/resources');
    return res.data;
  },
  async getById(id: string) {
    const res = await AxiosInstance.get<ApiEnvelope<any>>(`/api/resources/${id}`);
    return res.data;
  },
  async create(payload: CreateResource) {
    const res = await AxiosInstance.post<ApiEnvelope<any>>('/api/resources', payload);
    return res.data;
  },
  async update(id: string, payload: UpdateResource) {
    const res = await AxiosInstance.patch<ApiEnvelope<any>>(`/api/resources/${id}`, payload);
    return res.data;
  },
  async remove(id: string) {
    const res = await AxiosInstance.delete<ApiEnvelope<null>>(`/api/resources/${id}`);
    return res.data;
  },
};

