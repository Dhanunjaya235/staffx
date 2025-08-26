import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  jobsCount: number;
  resourcesCount: number;
  createdAt: string;
}

interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  clients: [
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
  ],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(c => c.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setClients, addClient, updateClient, deleteClient, setLoading, setError } = clientsSlice.actions;
export default clientsSlice.reducer;