// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartState, Book } from '@/types';

const initialState: CartState = { items: [], isOpen: false };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Book>) => {
      const existing = state.items.find(i => i.book.id === action.payload.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ book: action.payload, quantity: 1 });
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.book.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.book.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) state.items = state.items.filter(i => i.book.id !== action.payload.id);
        else item.quantity = action.payload.quantity;
      }
    },
    clearCart:   (state) => { state.items = []; },
    toggleCart:  (state) => { state.isOpen = !state.isOpen; },
    openCart:    (state) => { state.isOpen = true; },
    closeCart:   (state) => { state.isOpen = false; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
