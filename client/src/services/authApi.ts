// src/services/authApi.ts
import { api } from './api';

export interface LoginRequest  { email: string; password: string; }
export interface SignupRequest { name: string; email: string; password: string; }
export interface AuthResponse  { user: { id: string; username: string; email: string }}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/login', method: 'POST', body }),
    }),
  }),
});

export const {
  useLoginMutation
} = authApi;
