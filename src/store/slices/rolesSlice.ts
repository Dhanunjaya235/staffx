import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Role {
  id: string;
  name: string;
  department: string;
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Manager' | 'Director';
  skillsRequired: string[];
  experienceMin: number;
  experienceMax: number;
  description?: string;
  createdAt: string;
}

interface RolesState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RolesState = {
  roles: [
    {
      id: '1',
      name: 'Senior Developer',
      department: 'Engineering',
      level: 'Senior',
      skillsRequired: ['React', 'TypeScript', 'Node.js'],
      experienceMin: 5,
      experienceMax: 10,
      description: 'Senior level developer with React expertise',
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      name: 'Manager',
      department: 'Operations',
      level: 'Manager',
      skillsRequired: ['Leadership', 'Project Management'],
      experienceMin: 7,
      experienceMax: 15,
      description: 'Management role with team leadership responsibilities',
      createdAt: '2024-01-11',
    },
    {
      id: '3',
      name: 'Junior Developer',
      department: 'Engineering',
      level: 'Entry',
      skillsRequired: ['JavaScript', 'HTML', 'CSS'],
      experienceMin: 0,
      experienceMax: 3,
      description: 'Entry level developer position',
      createdAt: '2024-01-12',
    },
  ],
  loading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    addRole: (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);
    },
    updateRole: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },
    deleteRole: (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter(r => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setRoles, addRole, updateRole, deleteRole, setLoading, setError } = rolesSlice.actions;
export default rolesSlice.reducer;