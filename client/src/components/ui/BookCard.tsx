// src/components/ui/BookCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useIsInCart, useIsWishlisted } from '../../hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact' | 'featured';
}

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <svg
        key={star}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={star <= Math.round(rating) ? 'var(--accent)' : 'none'}
        stroke={star <= Math.round(rating) ? 'var(--accent)' : 'var(--text-muted)'}
        strokeWidth="1.5"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const BookCard: React.FC<BookCardProps> = ({ book, variant = 'default' }) => {
  const dispatch = useAppDispatch();
  const inCart = useIsInCart(book.id);
  const wishlisted = useIsWishlisted(book.id);
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  if (variant === 'featured') {
    return (
      <div className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-[var(--bg-secondary)] md:flex-row">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/4] md:w-2/5 md:aspect-auto">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {book.bestseller && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-white">
              Bestseller
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 lg:p-8">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">{book.category}</p>
            <Link to={`/book/${book.id}`}>
              <h3 className="mb-2 font-['Playfair_Display'] text-2xl font-semibold leading-tight text-[var(--text-primary)] transition-colors hover:text-[var(--accent)] sm:text-3xl">
                {book.title}
              </h3>
            </Link>
            <p className="mb-4 text-sm text-[var(--text-muted)]">by {book.author}</p>
            <div className="mb-6 flex items-center gap-2">
              <StarRating rating={book.rating} size={14} />
              <span className="text-sm text-[var(--text-muted)]">({book.reviewCount.toLocaleString()})</span>
            </div>
            <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">{book.description}</p>
          </div>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-['Playfair_Display'] text-2xl font-semibold text-[var(--text-primary)]">${book.price}</span>
              {book.originalPrice && (
                <span className="ml-2 text-sm text-[var(--text-muted)] line-through">${book.originalPrice}</span>
              )}
            </div>
            <button
              onClick={() => dispatch(addToCart(book))}
              className={`w-full rounded-full px-6 py-2.5 text-sm font-medium transition-all sm:w-auto ${
                inCart
                  ? 'border border-emerald-500/30 bg-emerald-500/12 text-emerald-300'
                  : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
              }`}
            >
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--bg-secondary)]">
        <Link to={`/book/${book.id}`}>
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {book.bestseller && (
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-medium text-white">
              Bestseller
            </span>
          )}
          {book.newArrival && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-medium text-white">
              -{discount}%
            </span>
          )}
        </div>

        <button
          onClick={() => dispatch(toggleWishlist(book))}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/90 text-[var(--text-primary)] opacity-100 backdrop-blur transition duration-200 hover:scale-110 md:h-7 md:w-7 md:opacity-0 md:group-hover:opacity-100"
          aria-label={wishlisted ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={wishlisted ? 'var(--accent)' : 'none'}
            stroke={wishlisted ? 'var(--accent)' : 'currentColor'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-0 transition-transform duration-300 md:translate-y-full md:group-hover:translate-y-0">
          <button
            onClick={() => dispatch(addToCart(book))}
            className={`w-full rounded-full py-2 text-xs font-medium transition-colors ${
              inCart
                ? 'bg-emerald-500/90 text-white backdrop-blur'
                : 'bg-[var(--bg-primary)]/90 text-[var(--text-primary)] backdrop-blur hover:bg-[var(--accent)] hover:text-white'
            }`}
          >
            {inCart ? 'Added to Cart' : 'Quick Add'}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)]">{book.category}</p>
        <Link to={`/book/${book.id}`}>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]">
            {book.title}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{book.author}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-[var(--text-primary)]">${book.price}</span>
            {book.originalPrice && (
              <span className="text-xs text-[var(--text-muted)] line-through">${book.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <StarRating rating={book.rating} size={10} />
            <span className="text-[10px] text-[var(--text-muted)]">{book.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
