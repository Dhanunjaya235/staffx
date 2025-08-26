import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Job Manager' | 'Recruiter';
  avatar?: string;
  department?: string;
  createdAt: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      role: 'Admin',
      department: 'IT',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@company.com',
      role: 'Job Manager',
      department: 'HR',
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'Recruiter',
      department: 'HR',
      createdAt: '2024-01-03',
    },
  ],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    assignRole: (state, action: PayloadAction<{ userId: string; role: 'Admin' | 'Job Manager' | 'Recruiter' }>) => {
      const user = state.users.find(u => u.id === action.payload.userId);
      if (user) {
        user.role = action.payload.role;
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

export const { setUsers, addUser, updateUser, deleteUser, assignRole, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;