// src/pages/private/WishlistPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist, useAppDispatch } from '@/hooks';
import { addToCart } from '@/redux/cartSlice';
import BookCard from '@/components/ui/BookCard';
import Button from '@/components/common/Button';

const WishlistPage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const { items } = useWishlist();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-10">
          <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)]">My Wishlist</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{items.length} saved {items.length === 1 ? 'book' : 'books'}</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text-primary)] mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-[var(--text-muted)] mb-8">Save books you love to come back to them later.</p>
            <Button as={Link as any} to="/shop" variant="primary" size="lg">Browse Books</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Button variant="primary" onClick={() => items.forEach(i => dispatch(addToCart(i.book)))}>
                Add All to Cart
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
              {items.map(({ book }) => <BookCard key={book.id} book={book} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
