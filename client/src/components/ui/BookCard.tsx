// src/components/ui/BookCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '@/types';
import { useAppDispatch, useIsInCart, useIsWishlisted } from '@/hooks';
import { addToCart } from '@/redux/cartSlice';
import { toggleWishlist } from '@/redux/wishlistSlice';
import StarRating from '@/components/common/StarRating';
import Badge from '@/components/common/Badge';

interface Props {
  book:     Book;
  variant?: 'default' | 'featured';
}

const BookCard: React.FC<Props> = ({ book, variant = 'default' }) => {
  const dispatch   = useAppDispatch();
  const inCart     = useIsInCart(book.id);
  const wishlisted = useIsWishlisted(book.id);
  const discount   = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  /* ── Featured / hero variant ─────────────────────────────────────── */
  if (variant === 'featured') {
    return (
      <div className="group relative bg-[var(--bg-secondary)] rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Cover */}
        <div className="relative md:w-2/5 overflow-hidden aspect-[3/4] md:aspect-auto">
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {book.bestseller && (
            <div className="absolute top-4 left-4">
              <Badge label="Bestseller" variant="accent" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium mb-3">
              {book.category}
            </p>
            <Link to={`/book/${book.id}`}>
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight hover:text-[var(--accent)] transition-colors mb-2">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-[var(--text-muted)] mb-4">by {book.author}</p>
            {book.rating != null && (
              <StarRating rating={book.rating} size={14} showCount count={book.reviewCount} />
            )}
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mt-4">
              {book.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6 gap-4 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text-primary)]">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice && (
                <span className="text-sm text-[var(--text-muted)] line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={() => dispatch(addToCart(book))}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                inCart
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
              }`}
            >
              {inCart ? '✓ In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Default grid card ───────────────────────────────────────────── */
  return (
    <div className="group relative flex flex-col">
      {/* Cover */}
      <div className="relative overflow-hidden rounded-xl bg-[var(--bg-secondary)] aspect-[3/4]">
        <Link to={`/book/${book.id}`} tabIndex={-1} aria-hidden="true">
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Low-stock ribbon */}
        {book.stock != null && book.stock > 0 && book.stock <= 5 && (
          <div className="absolute top-0 inset-x-0 text-center py-1 bg-amber-500/90 text-white text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm">
            Only {book.stock} left
          </div>
        )}

        {/* Out of stock overlay */}
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-[var(--bg-primary)]/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-[var(--border)]">
              Out of stock
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {book.bestseller && <Badge label="Bestseller" variant="accent" />}
          {book.newArrival  && <Badge label="New"        variant="success" />}
          {discount > 0     && <Badge label={`-${discount}%`} variant="danger" />}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => dispatch(toggleWishlist(book))}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus-visible:opacity-100"
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill={wishlisted ? 'var(--accent)' : 'none'}
            stroke={wishlisted ? 'var(--accent)' : 'currentColor'}
            strokeWidth="2"
            className="text-[var(--text-primary)]"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick-add overlay */}
        {book.stock !== 0 && (
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => dispatch(addToCart(book))}
              className={`w-full py-2 rounded-full text-xs font-semibold transition-colors ${
                inCart
                  ? 'bg-emerald-500/90 text-white backdrop-blur'
                  : 'bg-[var(--bg-primary)]/90 backdrop-blur text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white'
              }`}
            >
              {inCart ? '✓ Added' : 'Quick Add'}
            </button>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-3 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-medium truncate">
          {book.category}
        </p>
        <Link to={`/book/${book.id}`}>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mt-0.5 leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{book.author}</p>
        <div className="flex items-center justify-between mt-2 gap-1 flex-wrap">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-[var(--text-primary)]">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {book.rating != null && (
            <StarRating rating={book.rating} size={10} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;