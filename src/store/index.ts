import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import clientsSlice from './slices/clientsSlice';
import jobsSlice from './slices/jobsSlice';
import resourcesSlice from './slices/resourcesSlice';
import rolesSlice from './slices/rolesSlice';
import usersSlice from './slices/usersSlice';
import vendorsSlice from './slices/vendorsSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    clients: clientsSlice,
    jobs: jobsSlice,
    resources: resourcesSlice,
    roles: rolesSlice,
    users: usersSlice,
    vendors: vendorsSlice,
    ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;