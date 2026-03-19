// src/hooks/index.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Cart selectors
export const useCart = () => useAppSelector(s => s.cart);
export const useCartTotal = () =>
  useAppSelector(s =>
    s.cart.items.reduce((sum, i) => sum + i.book.price * i.quantity, 0)
  );
export const useCartCount = () =>
  useAppSelector(s => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));
export const useIsInCart = (id: string) =>
  useAppSelector(s => s.cart.items.some(i => i.book.id === id));

// Wishlist selectors
export const useWishlist = () => useAppSelector(s => s.wishlist);
export const useIsWishlisted = (id: string) =>
  useAppSelector(s => s.wishlist.items.some(i => i.book.id === id));

// Filter selectors
export const useFilter = () => useAppSelector(s => s.filter);

// UI selectors
export const useUI = () => useAppSelector(s => s.ui);
