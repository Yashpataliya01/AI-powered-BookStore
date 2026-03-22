// src/pages/public/BookDetailPage.tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById, books } from '@/data/books';
import { useAppDispatch, useIsInCart, useIsWishlisted } from '@/hooks';
import { addToCart, openCart } from '@/redux/cartSlice';
import { toggleWishlist } from '@/redux/wishlistSlice';
import BookCard from '@/components/ui/BookCard';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

const BookDetailPage: React.FC = () => {
  const { id }     = useParams<{ id: string }>();
  const dispatch   = useAppDispatch();
  const book       = getBookById(id || '');
  const inCart     = useIsInCart(id || '');
  const wishlisted = useIsWishlisted(id || '');
  const [qty,      setQty]      = useState(1);

  if (!book) return (
    <div className="min-h-screen pt-32 text-center">
      <p className="text-[var(--text-muted)]">Book not found.</p>
      <Link to="/shop" className="text-[var(--accent)] mt-4 inline-block hover:underline">Back to shop</Link>
    </div>
  );

  const related  = books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);
  const discount = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-10">
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[var(--accent)] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Cover */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {book.bestseller && <Badge label="Bestseller" variant="accent" size="md" />}
                {book.newArrival  && <Badge label="New Arrival" variant="success" size="md" />}
                {discount > 0     && <Badge label={`-${discount}% Off`} variant="danger" size="md" />}
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold mb-3">{book.category}</p>
            <h1 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-3">
              {book.title}
            </h1>
            <p className="text-base text-[var(--text-secondary)] mb-5">by <span className="font-semibold">{book.author}</span></p>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={book.rating} size={16} showCount count={book.reviewCount} />
              <span className="text-sm font-bold text-[var(--text-primary)]">{book.rating}</span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 border-l-2 border-[var(--accent)]/30 pl-4">
              {book.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {book.tags.map(tag => <Badge key={tag} label={tag} variant="muted" size="md" />)}
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)]">${book.price}</span>
              {book.originalPrice && (
                <>
                  <span className="text-lg text-[var(--text-muted)] line-through">${book.originalPrice}</span>
                  <span className="text-sm text-emerald-600 font-semibold">Save ${(book.originalPrice - book.price).toFixed(2)}</span>
                </>
              )}
            </div>

            <div className="flex gap-3 mb-8">
              <div className="flex items-center border border-[var(--border)] rounded-full px-3 py-2 gap-3">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">−</button>
                <span className="w-6 text-center text-sm font-medium text-[var(--text-primary)]">{qty}</span>
                <button onClick={() => setQty(q => q+1)} className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">+</button>
              </div>
              <Button variant="primary" className="flex-1" onClick={() => { dispatch(addToCart(book)); dispatch(openCart()); }}>
                {inCart ? '✓ In Cart — Add Another' : 'Add to Cart'}
              </Button>
              <button onClick={() => dispatch(toggleWishlist(book))}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${wishlisted ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted?'currentColor':'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-6 rounded-2xl bg-[var(--bg-secondary)] text-sm">
              {[['Pages',book.pages],['Publisher',book.publisher],['Year',book.year],['ISBN',book.isbn]].map(([label,value]) => (
                <div key={label as string}>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
                  <p className="font-medium text-[var(--text-primary)] text-sm truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[var(--text-primary)] mb-8">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {related.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
