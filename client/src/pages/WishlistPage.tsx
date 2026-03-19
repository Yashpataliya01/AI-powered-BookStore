// src/pages/WishlistPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/ui/BookCard';
import { useAppDispatch, useWishlist } from '../hooks';
import { addToCart } from '../store/slices/cartSlice';

const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useWishlist();

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 sm:mb-10">
          <h1 className="font-['Playfair_Display'] text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {items.length} saved {items.length === 1 ? 'book' : 'books'}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center sm:py-24">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-secondary)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="mb-2 font-['Playfair_Display'] text-2xl font-semibold text-[var(--text-primary)]">Your wishlist is empty</h2>
            <p className="mb-8 text-sm text-[var(--text-muted)]">Save books you love to come back to them later.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-stretch sm:justify-end">
              <button
                onClick={() => items.forEach(item => dispatch(addToCart(item.book)))}
                className="w-full rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm text-white transition-colors hover:bg-[var(--accent-hover)] sm:w-auto"
              >
                Add All to Cart
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-8">
              {items.map(({ book }) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
