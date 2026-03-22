// src/hooks/index.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ── Auth ──
export const useAuth         = () => useAppSelector(s => s.auth);
export const useIsAuthed     = () => useAppSelector(s => s.auth.isAuthenticated);
export const useCurrentUser  = () => useAppSelector(s => s.auth.user);

// ── Cart ──
export const useCart      = () => useAppSelector(s => s.cart);
export const useCartCount = () => useAppSelector(s => s.cart.items.reduce((n, i) => n + i.quantity, 0));
export const useCartTotal = () => useAppSelector(s => s.cart.items.reduce((n, i) => n + i.book.price * i.quantity, 0));
export const useIsInCart  = (id: string) => useAppSelector(s => s.cart.items.some(i => i.book.id === id));

// ── Wishlist ──
export const useWishlist      = () => useAppSelector(s => s.wishlist);
export const useIsWishlisted  = (id: string) => useAppSelector(s => s.wishlist.items.some(i => i.book.id === id));

// ── Filter ──
export const useFilter = () => useAppSelector(s => s.filter);

// ── UI ──
export const useUI = () => useAppSelector(s => s.ui);
