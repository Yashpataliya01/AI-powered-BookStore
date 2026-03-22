// src/services/booksApi.ts
import { api } from './api';
import type { Book } from '@/types';

export const booksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], { category?: string; q?: string }>({
      query: (params) => ({ url: '/books', params }),
      providesTags: ['Books'],
    }),
    getBookById: builder.query<Book, string>({
      query: (id) => `/books/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Books', id }],
    }),
  }),
});

export const { useGetBooksQuery, useGetBookByIdQuery } = booksApi;
