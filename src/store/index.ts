import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';

// We'll add slices here as we create them
export const store = configureStore({
  reducer: {
    projects: projectReducer,
  },
});

// This is for TypeScript - it helps us get the correct types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
