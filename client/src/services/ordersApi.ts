// src/services/ordersApi.ts
import { api } from './api';

export interface Order {
  id: string;
  items: { bookId: string; title: string; price: number; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    placeOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const { useGetOrdersQuery, usePlaceOrderMutation } = ordersApi;
