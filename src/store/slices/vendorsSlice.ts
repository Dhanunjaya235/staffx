import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface VendorsState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
}

const initialState: VendorsState = {
  vendors: [
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
  ],
  loading: false,
  error: null,
};

const vendorsSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.vendors = action.payload;
    },
    addVendor: (state, action: PayloadAction<Vendor>) => {
      state.vendors.push(action.payload);
    },
    updateVendor: (state, action: PayloadAction<Vendor>) => {
      const index = state.vendors.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vendors[index] = action.payload;
      }
    },
    deleteVendor: (state, action: PayloadAction<string>) => {
      state.vendors = state.vendors.filter(v => v.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setVendors, addVendor, updateVendor, deleteVendor, setLoading, setError } = vendorsSlice.actions;
export default vendorsSlice.reducer;