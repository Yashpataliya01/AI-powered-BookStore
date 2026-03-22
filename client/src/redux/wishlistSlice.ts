// src/redux/wishlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WishlistState, Book } from '@/types';

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Book>) => {
      const idx = state.items.findIndex(i => i.book.id === action.payload.id);
      if (idx >= 0) state.items.splice(idx, 1);
      else state.items.push({ book: action.payload, addedAt: new Date().toISOString() });
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.book.id !== action.payload);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
