import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InterviewRound {
  id: string;
  resourceId: string;
  roundNumber: number;
  roundType: 'Phone Screen' | 'Technical' | 'Behavioral' | 'Final' | 'Client Interview';
  interviewer: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Passed' | 'Failed' | 'No Show';
  feedback?: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  resourceType: 'Self' | 'Freelancer' | 'Vendor' | 'Direct';
  vendorId?: string;
  vendorName?: string;
  interviewStatus: 'Not Started' | 'In Progress' | 'Passed' | 'Failed' | 'On Hold';
  roundsCount: number;
  currentRound?: number;
  experience: number;
  skills: string[];
  resume?: string;
  createdAt: string;
}

interface ResourcesState {
  resources: Resource[];
  rounds: InterviewRound[];
  loading: boolean;
  error: string | null;
}

const initialState: ResourcesState = {
  resources: [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '(555) 111-2222',
      jobId: '1',
      jobTitle: 'Senior React Developer',
      clientId: '1',
      clientName: 'TechCorp Inc',
      resourceType: 'Self',
      interviewStatus: 'In Progress',
      roundsCount: 2,
      currentRound: 2,
      experience: 5,
      skills: ['React', 'TypeScript', 'Node.js'],
      createdAt: '2024-01-16',
    },
    {
      id: '2',
      name: 'Bob Chen',
      email: 'bob@example.com',
      phone: '(555) 333-4444',
      jobId: '1',
      jobTitle: 'Senior React Developer',
      clientId: '1',
      clientName: 'TechCorp Inc',
      resourceType: 'Freelancer',
      interviewStatus: 'Passed',
      roundsCount: 3,
      experience: 7,
      skills: ['React', 'Redux', 'GraphQL'],
      createdAt: '2024-01-17',
    },
  ],
  rounds: [
    {
      id: '1',
      resourceId: '1',
      roundNumber: 1,
      roundType: 'Phone Screen',
      interviewer: 'John Smith',
      date: '2024-01-18',
      status: 'Passed',
      feedback: 'Good communication skills, technical knowledge seems strong.',
      createdAt: '2024-01-18',
    },
    {
      id: '2',
      resourceId: '1',
      roundNumber: 2,
      roundType: 'Technical',
      interviewer: 'Sarah Johnson',
      date: '2024-01-20',
      status: 'Scheduled',
      createdAt: '2024-01-19',
    },
  ],
  loading: false,
  error: null,
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResources: (state, action: PayloadAction<Resource[]>) => {
      state.resources = action.payload;
    },
    addResource: (state, action: PayloadAction<Resource>) => {
      state.resources.push(action.payload);
    },
    updateResource: (state, action: PayloadAction<Resource>) => {
      const index = state.resources.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.resources[index] = action.payload;
      }
    },
    deleteResource: (state, action: PayloadAction<string>) => {
      state.resources = state.resources.filter(r => r.id !== action.payload);
    },
    setRounds: (state, action: PayloadAction<InterviewRound[]>) => {
      state.rounds = action.payload;
    },
    addRound: (state, action: PayloadAction<InterviewRound>) => {
      state.rounds.push(action.payload);
      // Update resource rounds count
      const resource = state.resources.find(r => r.id === action.payload.resourceId);
      if (resource) {
        resource.roundsCount += 1;
        resource.currentRound = action.payload.roundNumber;
      }
    },
    updateRound: (state, action: PayloadAction<InterviewRound>) => {
      const index = state.rounds.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rounds[index] = action.payload;
      }
    },
    deleteRound: (state, action: PayloadAction<string>) => {
      const round = state.rounds.find(r => r.id === action.payload);
      if (round) {
        state.rounds = state.rounds.filter(r => r.id !== action.payload);
        // Update resource rounds count
        const resource = state.resources.find(r => r.id === round.resourceId);
        if (resource && resource.roundsCount > 0) {
          resource.roundsCount -= 1;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setResources, addResource, updateResource, deleteResource,
  setRounds, addRound, updateRound, deleteRound,
  setLoading, setError 
} = resourcesSlice.actions;
export default resourcesSlice.reducer;