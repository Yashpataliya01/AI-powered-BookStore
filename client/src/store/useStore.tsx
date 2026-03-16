import { useState, useCallback, createContext, useContext } from "react";
import { Book, BOOKS } from "../data/books";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type CartItem = { book: Book; quantity: number };
export type StoreType = ReturnType<typeof useStoreState>;

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

export const StoreCtx = createContext<StoreType | null>(null);

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useStoreState() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((book: Book) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      return existing
        ? prev.map((i) =>
            i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { book, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback(
    (id: string) => setCart((prev) => prev.filter((i) => i.book.id !== id)),
    []
  );

  const updateCartQuantity = useCallback(
    (id: string, delta: number) =>
      setCart((prev) =>
        prev.map((i) =>
          i.book.id === id
            ? { ...i, quantity: Math.max(1, i.quantity + delta) }
            : i
        )
      ),
    []
  );

  const toggleWishlist = useCallback(
    (id: string) =>
      setWishlist((prev) => {
        const n = new Set(prev);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
      }),
    []
  );

  const cartTotal = cart.reduce(
    (s, i) => s + i.book.price * i.quantity,
    0
  );
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const filteredBooks = BOOKS.filter(
    (b) =>
      (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedGenre || b.genre === selectedGenre)
  );

  return {
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    cartTotal,
    cartCount,
    filteredBooks,
  };
}

// ─── CONSUMER HOOK ───────────────────────────────────────────────────────────

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("Must be inside StoreProvider");
  return ctx;
}