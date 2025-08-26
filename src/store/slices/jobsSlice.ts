import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Job {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  roleId: string;
  roleName: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  resourcesCount: number;
  createdAt: string;
  deadline?: string;
}

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [
    {
      id: '1',
      title: 'Senior React Developer',
      clientId: '1',
      clientName: 'TechCorp Inc',
      roleId: '1',
      roleName: 'Senior Developer',
      description: 'Looking for an experienced React developer to join our team.',
      status: 'Open',
      resourcesCount: 3,
      createdAt: '2024-01-15',
      deadline: '2024-02-15',
    },
    {
      id: '2',
      title: 'Project Manager',
      clientId: '2',
      clientName: 'Innovate Solutions',
      roleId: '2',
      roleName: 'Manager',
      description: 'Seeking a skilled project manager for our consulting team.',
      status: 'In Progress',
      resourcesCount: 2,
      createdAt: '2024-01-20',
      deadline: '2024-03-01',
    },
  ],
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload);
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex(j => j.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter(j => j.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setJobs, addJob, updateJob, deleteJob, setLoading, setError } = jobsSlice.actions;
export default jobsSlice.reducer;