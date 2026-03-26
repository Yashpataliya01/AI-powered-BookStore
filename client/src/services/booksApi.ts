// src/services/booksApi.ts

import { api } from './api';
import type { Book } from '@/types';

export interface GetBooksParams {
  search?: string;
  category?: string;
  min_rating?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BooksResponse {
  total: number;
  page: number;
  limit: number;
  data: Book[];
}

export const booksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<BooksResponse, GetBooksParams>({
      query: (params) => ({
        url: '/books',
        params,
      }),
      providesTags: ['Books'],
    }),
  }),
});

export const { useGetBooksQuery } = booksApi;