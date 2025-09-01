import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosInstance from '../../services/api/axiosInstance';
import { RootState } from '../index';

export const Roles = {
  ADMIN: 'ADMIN',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
  RECRUITER: 'RECRUITER',
  DELIVERY_MANAGER: 'DELIVERY_MANAGER',
  PRACTICE_LEAD: 'PRACTICE_LEAD',
  SALES_MANAGER: 'SALES_MANAGER',
} as const;

export type RoleKey = keyof typeof Roles;
export type RoleValue = typeof Roles[RoleKey];

export interface EmployeeState {
  employee: Record<string, any> | null;
  roles: RoleValue[];
  isAdmin: boolean;
  isAccountManager: boolean;
  isRecruiter: boolean;
  isDeliveryManager: boolean;
  isPracticeLead: boolean;
  isSalesManager: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employee: null,
  roles: [],
  isAdmin: false,
  isAccountManager: false,
  isRecruiter: false,
  isDeliveryManager: false,
  isPracticeLead: false,
  isSalesManager: false,
  loading: false,
  error: null,
};

export const fetchEmployee = createAsyncThunk(
  'employee/fetchEmployee',
  async (_, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.get('/employee');
      return res.data as { employee: Record<string, any>; roles: { name?: string }[] | string[] };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to fetch employee');
    }
  }
);

function deriveBooleans(roles: RoleValue[]): Pick<
  EmployeeState,
  | 'isAdmin'
  | 'isAccountManager'
  | 'isRecruiter'
  | 'isDeliveryManager'
  | 'isPracticeLead'
  | 'isSalesManager'
> {
  const has = (r: RoleValue) => roles.includes(r);
  return {
    isAdmin: has(Roles.ADMIN),
    isAccountManager: has(Roles.ACCOUNT_MANAGER),
    isRecruiter: has(Roles.RECRUITER),
    isDeliveryManager: has(Roles.DELIVERY_MANAGER),
    isPracticeLead: has(Roles.PRACTICE_LEAD),
    isSalesManager: has(Roles.SALES_MANAGER),
  };
}

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.employee = payload.employee || null;
        const roleValues: RoleValue[] = (Array.isArray(payload.roles) ? payload.roles : [])
          .map((r: any) => (typeof r === 'string' ? r : r?.name))
          .filter(Boolean);
        state.roles = roleValues as RoleValue[];
        const derived = deriveBooleans(state.roles);
        state.isAdmin = derived.isAdmin;
        state.isAccountManager = derived.isAccountManager;
        state.isRecruiter = derived.isRecruiter;
        state.isDeliveryManager = derived.isDeliveryManager;
        state.isPracticeLead = derived.isPracticeLead;
        state.isSalesManager = derived.isSalesManager;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch employee';
      });
  },
});

export default employeeSlice.reducer;

export const selectEmployee = (state: RootState) => state.employee.employee;
export const selectEmployeeRoles = (state: RootState) => state.employee.roles;
export const selectEmployeeLoading = (state: RootState) => state.employee.loading;
export const selectEmployeeError = (state: RootState) => state.employee.error;
export const selectIsAdmin = (state: RootState) => state.employee.isAdmin;
export const selectIsAccountManager = (state: RootState) => state.employee.isAccountManager;
export const selectIsRecruiter = (state: RootState) => state.employee.isRecruiter;
export const selectIsDeliveryManager = (state: RootState) => state.employee.isDeliveryManager;
export const selectIsPracticeLead = (state: RootState) => state.employee.isPracticeLead;
export const selectIsSalesManager = (state: RootState) => state.employee.isSalesManager;

export const ROLE_DISPLAY_NAMES: Record<RoleValue, string> = {
  [Roles.ADMIN]: 'Admin',
  [Roles.ACCOUNT_MANAGER]: 'Account Manager',
  [Roles.RECRUITER]: 'Recruiter',
  [Roles.DELIVERY_MANAGER]: 'Delivery Manager',
  [Roles.PRACTICE_LEAD]: 'Practice Lead',
  [Roles.SALES_MANAGER]: 'Sales Manager',
};


