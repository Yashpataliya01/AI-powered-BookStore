// src/types/index.ts

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  cover: string;
  image_url: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  pages: number;
  publisher: string;
  year: number;
  isbn: string;
  tags: string[];
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
}

export interface CartItem   { book: Book; quantity: number; }
export interface WishlistItem { book: Book; addedAt: string; }

export interface FilterState {
  category:   string;
  priceRange: [number, number];
  rating:     number;
  sortBy:     'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
}

export interface CartState     { items: CartItem[];     isOpen: boolean; }
export interface WishlistState { items: WishlistItem[]; }
export interface UIState       { theme: 'light' | 'dark'; mobileMenuOpen: boolean; searchOpen: boolean; }

export interface User {
  id:    string;
  username:  string;
  email: string;
}

export interface AuthState {
  user:          User | null;
  isAuthenticated: boolean;
  loading:       boolean;
  error:         string | null;
}
