import AxiosInstance from './axiosInstance';
import { ApiEnvelope } from './helpers';

export interface VendorContact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface FileValue {
  fileName: string;
  fileType: string;
  fileValue: string; // base64
}

export interface CreateVendor {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  logo?: FileValue | null;
  location?: string;
  contacts?: VendorContact[];
}

export interface UpdateVendor extends Partial<CreateVendor> {}

export const vendorsApi = {
  async getAll() {
    const res = await AxiosInstance.get<ApiEnvelope<any[]>>('/api/vendors');
    return res.data;
  },
  async getById(id: string) {
    const res = await AxiosInstance.get<ApiEnvelope<any>>(`/api/vendors/${id}`);
    return res.data;
  },
  async create(payload: CreateVendor) {
    const res = await AxiosInstance.post<ApiEnvelope<any>>('/api/vendors', payload);
    return res.data;
  },
  async update(id: string, payload: UpdateVendor) {
    const res = await AxiosInstance.patch<ApiEnvelope<any>>(`/api/vendors/${id}`, payload);
    return res.data;
  },
  async remove(id: string) {
    const res = await AxiosInstance.delete<ApiEnvelope<null>>(`/api/vendors/${id}`);
    return res.data;
  },
};

