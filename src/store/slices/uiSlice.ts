import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  globalLoading: boolean;
  sidebarCollapsed: boolean;
}

const initialState: UiState = {
  globalLoading: false,
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setGlobalLoading, setSidebarCollapsed, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;