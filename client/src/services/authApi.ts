// src/services/authApi.ts
import { api } from './api';

export interface LoginRequest  { email: string; password: string; }
export interface SignupRequest { name: string; email: string; password: string; }
export interface AuthResponse  { user: { id: string; name: string; email: string }; token: string; message: string; }

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    getMe: builder.query<{ user: AuthResponse['user'] }, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useGetMeQuery,
} = authApi;
