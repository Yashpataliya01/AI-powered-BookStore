// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import authReducer   from './authSlice';
import cartReducer   from './cartSlice';
import wishlistReducer from './wishlistSlice';
import filterReducer from './filterSlice';
import uiReducer     from './uiSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth:     authReducer,
    cart:     cartReducer,
    wishlist: wishlistReducer,
    filter:   filterReducer,
    ui:       uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
