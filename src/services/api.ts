import { Client } from '../store/slices/clientsSlice';
import { Job } from '../store/slices/jobsSlice';
import { Resource, InterviewRound } from '../store/slices/resourcesSlice';
import { Role } from '../store/slices/rolesSlice';
import { User } from '../store/slices/usersSlice';

// Mock API delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    phone: '(555) 123-4567',
    company: 'TechCorp Inc',
    industry: 'Technology',
    jobsCount: 5,
    resourcesCount: 12,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Michael Brown',
    email: 'michael@innovate.io',
    phone: '(555) 987-6543',
    company: 'Innovate Solutions',
    industry: 'Consulting',
    jobsCount: 3,
    resourcesCount: 8,
    createdAt: '2024-01-20',
  },
];

const mockVendors = [
  {
    id: '1',
    name: 'ABC Staffing Solutions',
    email: 'contact@abcstaffing.com',
    phone: '(555) 111-0000',
    company: 'ABC Staffing Solutions',
    industry: 'Staffing',
    resourcesCount: 25,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'XYZ Consulting Group',
    email: 'info@xyzconsulting.com',
    phone: '(555) 222-0000',
    company: 'XYZ Consulting Group',
    industry: 'Consulting',
    resourcesCount: 18,
    createdAt: '2024-01-12',
  },
];

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  resourcesCount: number;
  createdAt: string;
}

// API Response wrapper
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  await delay(Math.random() * 1000 + 500); // Simulate network delay

  // Mock successful responses
  return {
    data: {} as T,
    success: true,
    message: 'Operation completed successfully'
  };
}

// Clients API
export const clientsApi = {
  getAll: async (): Promise<ApiResponse<Client[]>> => {
    await delay(800);
    return { data: mockClients, success: true };
  },

  getById: async (id: string): Promise<ApiResponse<Client>> => {
    await delay(500);
    const client = mockClients.find(c => c.id === id);
    if (!client) throw new ApiError('Client not found', 404);
    return { data: client, success: true };
  },

  create: async (client: Omit<Client, 'id'>): Promise<ApiResponse<Client>> => {
    await delay(600);
    const newClient = { ...client, id: Date.now().toString() };
    mockClients.push(newClient);
    return { data: newClient, success: true };
  },

  update: async (id: string, client: Partial<Client>): Promise<ApiResponse<Client>> => {
    await delay(600);
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) throw new ApiError('Client not found', 404);
    mockClients[index] = { ...mockClients[index], ...client };
    return { data: mockClients[index], success: true };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) throw new ApiError('Client not found', 404);
    mockClients.splice(index, 1);
    return { data: undefined, success: true };
  }
};

// Vendors API
export const vendorsApi = {
  getAll: async (): Promise<ApiResponse<Vendor[]>> => {
    await delay(800);
    return { data: mockVendors, success: true };
  },

  getById: async (id: string): Promise<ApiResponse<Vendor>> => {
    await delay(500);
    const vendor = mockVendors.find(v => v.id === id);
    if (!vendor) throw new ApiError('Vendor not found', 404);
    return { data: vendor, success: true };
  },

  create: async (vendor: Omit<Vendor, 'id'>): Promise<ApiResponse<Vendor>> => {
    await delay(600);
    const newVendor = { ...vendor, id: Date.now().toString() };
    mockVendors.push(newVendor);
    return { data: newVendor, success: true };
  },

  update: async (id: string, vendor: Partial<Vendor>): Promise<ApiResponse<Vendor>> => {
    await delay(600);
    const index = mockVendors.findIndex(v => v.id === id);
    if (index === -1) throw new ApiError('Vendor not found', 404);
    mockVendors[index] = { ...mockVendors[index], ...vendor };
    return { data: mockVendors[index], success: true };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    const index = mockVendors.findIndex(v => v.id === id);
    if (index === -1) throw new ApiError('Vendor not found', 404);
    mockVendors.splice(index, 1);
    return { data: undefined, success: true };
  }
};

// Jobs API
export const jobsApi = {
  getAll: async (): Promise<ApiResponse<Job[]>> => {
    await delay(700);
    return { data: [], success: true };
  },

  create: async (job: Omit<Job, 'id'>): Promise<ApiResponse<Job>> => {
    await delay(600);
    const newJob = { ...job, id: Date.now().toString() };
    return { data: newJob, success: true };
  },

  update: async (id: string, job: Partial<Job>): Promise<ApiResponse<Job>> => {
    await delay(600);
    return { data: { id, ...job } as Job, success: true };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    return { data: undefined, success: true };
  }
};

// Resources API
export const resourcesApi = {
  getAll: async (): Promise<ApiResponse<Resource[]>> => {
    await delay(900);
    return { data: [], success: true };
  },

  create: async (resource: Omit<Resource, 'id'>): Promise<ApiResponse<Resource>> => {
    await delay(700);
    const newResource = { ...resource, id: Date.now().toString() };
    return { data: newResource, success: true };
  },

  update: async (id: string, resource: Partial<Resource>): Promise<ApiResponse<Resource>> => {
    await delay(600);
    return { data: { id, ...resource } as Resource, success: true };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    return { data: undefined, success: true };
  }
};

// Roles API
export const rolesApi = {
  getAll: async (): Promise<ApiResponse<Role[]>> => {
    await delay(600);
    return { data: [], success: true };
  },

  create: async (role: Omit<Role, 'id'>): Promise<ApiResponse<Role>> => {
    await delay(600);
    const newRole = { ...role, id: Date.now().toString() };
    return { data: newRole, success: true };
  },

  update: async (id: string, role: Partial<Role>): Promise<ApiResponse<Role>> => {
    await delay(600);
    return { data: { id, ...role } as Role, success: true };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    return { data: undefined, success: true };
  }
};

// Users API
export const usersApi = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    await delay(600);
    return { data: [], success: true };
  },

  assignRole: async (userId: string, role: string): Promise<ApiResponse<User>> => {
    await delay(600);
    return { data: { id: userId, role } as User, success: true };
  }
};

// Interview Rounds API
export const roundsApi = {
  getByResourceId: async (resourceId: string): Promise<ApiResponse<InterviewRound[]>> => {
    await delay(500);
    return { data: [], success: true };
  },

  create: async (round: Omit<InterviewRound, 'id'>): Promise<ApiResponse<InterviewRound>> => {
    await delay(600);
    const newRound = { ...round, id: Date.now().toString() };
    return { data: newRound, success: true };
  },

  update: async (id: string, round: Partial<InterviewRound>): Promise<ApiResponse<InterviewRound>> => {
    await delay(600);
    return { data: { id, ...round } as InterviewRound, success: true };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    return { data: undefined, success: true };
  }
};