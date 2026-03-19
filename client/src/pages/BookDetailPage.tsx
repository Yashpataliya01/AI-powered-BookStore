// src/pages/BookDetailPage.tsx
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BookCard from '../components/ui/BookCard';
import { books, getBookById } from '../data/books';
import { useAppDispatch, useIsInCart, useIsWishlisted } from '../hooks';
import { addToCart, openCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const book = getBookById(id || '');
  const inCart = useIsInCart(id || '');
  const wishlisted = useIsWishlisted(id || '');
  const [quantity, setQuantity] = useState(1);

  if (!book) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-['Playfair_Display'] text-4xl text-[var(--text-primary)]">Book not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-[var(--accent)]">Back to shop</Link>
      </div>
    );
  }

  const related = books.filter(candidate => candidate.category === book.category && candidate.id !== book.id).slice(0, 4);
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let count = 0; count < quantity; count += 1) {
      dispatch(addToCart(book));
    }
    dispatch(openCart());
  };

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] sm:mb-10">
          <Link to="/" className="transition-colors hover:text-[var(--accent)]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="transition-colors hover:text-[var(--accent)]">Shop</Link>
          <span>/</span>
          <span className="line-clamp-1 text-[var(--text-primary)]">{book.title}</span>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-10 md:gap-12 lg:mb-20 lg:grid-cols-2 lg:gap-16">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[20rem] sm:max-w-sm lg:max-w-xs xl:max-w-sm">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
                <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
              </div>
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {book.bestseller && (
                  <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-white">Bestseller</span>
                )}
                {book.newArrival && (
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">New Arrival</span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-medium text-white">-{discount}% Off</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--accent)]">{book.category}</p>
            <h1 className="mb-3 font-['Playfair_Display'] text-3xl font-semibold leading-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
              {book.title}
            </h1>
            <p className="mb-5 text-base text-[var(--text-secondary)]">by <span className="font-medium">{book.author}</span></p>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={star <= Math.round(book.rating) ? 'var(--accent)' : 'none'}
                    stroke={star <= Math.round(book.rating) ? 'var(--accent)' : 'var(--text-muted)'}
                    strokeWidth="1.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">{book.rating}</span>
              <span className="text-sm text-[var(--text-muted)]">({book.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <p className="mb-6 border-l-2 border-[var(--accent)]/30 pl-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:mb-8">
              {book.description}
            </p>

            <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
              {book.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1 text-xs capitalize text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 sm:mb-8">
              <span className="font-['Playfair_Display'] text-4xl font-semibold text-[var(--text-primary)]">${book.price}</span>
              {book.originalPrice && (
                <>
                  <span className="text-lg text-[var(--text-muted)] line-through">${book.originalPrice}</span>
                  <span className="text-sm font-medium text-emerald-300">
                    Save ${(book.originalPrice - book.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
              <div className="flex items-center justify-between gap-3 rounded-full border border-[var(--border)] px-3 py-2 sm:justify-start">
                <button
                  onClick={() => setQuantity(current => Math.max(1, current - 1))}
                  className="flex h-6 w-6 items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-medium text-[var(--text-primary)]">{quantity}</span>
                <button
                  onClick={() => setQuantity(current => current + 1)}
                  className="flex h-6 w-6 items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`w-full rounded-full py-3 text-sm font-medium transition-all sm:flex-1 ${
                  inCart
                    ? 'border border-emerald-500/30 bg-emerald-500/12 text-emerald-300'
                    : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                }`}
              >
                {inCart ? 'In Cart - Add Another' : 'Add to Cart'}
              </button>
              <button
                onClick={() => dispatch(toggleWishlist(book))}
                className={`flex h-12 w-full items-center justify-center rounded-full border transition-all sm:w-12 ${
                  wishlisted
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-2xl bg-[var(--bg-secondary)] p-5 text-sm sm:grid-cols-2 sm:p-6">
              {[
                { label: 'Pages', value: book.pages },
                { label: 'Publisher', value: book.publisher },
                { label: 'Year', value: book.year },
                { label: 'ISBN', value: `${book.isbn.slice(0, 13)}...` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="mb-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
                  <p className="font-medium text-[var(--text-primary)]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="mb-8 font-['Playfair_Display'] text-3xl font-semibold text-[var(--text-primary)]">
              You might also like
            </h2>
            <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {related.map(relatedBook => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
