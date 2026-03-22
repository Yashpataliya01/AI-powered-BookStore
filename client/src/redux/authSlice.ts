// src/redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types';

const initialState: AuthState & { token: string | null } = {
  user:            null,
  isAuthenticated: false,
  loading:         false,
  error:           null,
  token:           null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user            = action.payload.user;
      state.token           = action.payload.token;
      state.isAuthenticated = true;
      state.error           = null;
    },
    logout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error   = action.payload;
      state.loading = false;
    },
  },
});

export const { setCredentials, logout, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
