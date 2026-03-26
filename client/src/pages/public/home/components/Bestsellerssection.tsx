// Replace the entire {/* ── BESTSELLERS ── */} section with this component.
// Drop it directly into HomePage.tsx — it self-contains all styles + animations.

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useIsInCart } from '@/hooks';
import { addToCart } from '@/redux/cartSlice';
import { getBestSellers } from '@/data/books';
import type { Book } from '@/types';

/* ── single book row ── */
const BestsellerRow: React.FC<{
  book:  Book;
  rank:  number;
  delay: number;
  inView: boolean;
}> = ({ book, rank, delay, inView }) => {
  const dispatch  = useAppDispatch();
  const inCart    = useIsInCart(book.id);
  const [hovered, setHovered] = useState(false);
  const discount  = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s,
                     transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {/* Hover background */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: 'var(--bg-secondary)',
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative flex items-center gap-5 px-5 py-4">

        {/* Rank */}
        <div className="flex-shrink-0 w-10 text-right">
          <span
            className="font-['Playfair_Display'] font-bold transition-all duration-300"
            style={{
              fontSize:   hovered ? '2rem' : '1.4rem',
              lineHeight: 1,
              color:      hovered ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {String(rank).padStart(2, '0')}
          </span>
        </div>

        {/* Cover */}
        <div
          className="flex-shrink-0 overflow-hidden rounded-xl"
          style={{
            width:      52,
            height:     72,
            boxShadow:  hovered
              ? '0 12px 32px rgba(0,0,0,0.2)'
              : '0 4px 12px rgba(0,0,0,0.1)',
            transform:  hovered ? 'scale(1.06) rotate(-1deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease',
          }}
        >
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[9px] uppercase tracking-[0.28em] font-semibold text-[var(--accent)]">
              {book.category}
            </p>
            {book.newArrival && (
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                New
              </span>
            )}
          </div>

          <Link to={`/book/${book.id}`}>
            <h3
              className="font-['Playfair_Display'] font-bold text-[var(--text-primary)] leading-tight truncate transition-colors duration-200 group-hover:text-[var(--accent)]"
              style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)' }}
            >
              {book.title}
            </h3>
          </Link>

          <p className="text-xs text-[var(--text-muted)] mt-0.5">{book.author}</p>

          {/* Rating bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="9" height="9" viewBox="0 0 24 24"
                  fill={s <= Math.round(book.rating) ? 'var(--accent)' : 'none'}
                  stroke={s <= Math.round(book.rating) ? 'var(--accent)' : 'var(--border)'}
                  strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">{book.rating} · {book.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex-shrink-0 flex items-center gap-4 ml-2">
          <div className="text-right hidden sm:block">
            <p className="font-['Playfair_Display'] text-lg font-bold text-[var(--text-primary)] leading-none">
              ${book.price}
            </p>
            {discount > 0 && (
              <p className="text-[10px] text-[var(--text-muted)] line-through mt-0.5">
                ${book.originalPrice}
              </p>
            )}
            {discount > 0 && (
              <p className="text-[9px] font-bold text-emerald-600 mt-0.5">-{discount}%</p>
            )}
          </div>

          <button
            onClick={() => dispatch(addToCart(book))}
            className="flex-shrink-0 transition-all duration-300"
            style={{
              width:      inCart ? 100 : 36,
              height:     36,
              borderRadius: 18,
              background: inCart ? 'rgba(16,185,129,0.1)' : 'var(--bg-secondary)',
              border:     `1.5px solid ${inCart ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
              color:      inCart ? '#10b981' : 'var(--text-secondary)',
              fontSize:   11,
              fontWeight: 600,
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap:        6,
              overflow:   'hidden',
              whiteSpace: 'nowrap',
              cursor:     'pointer',
            }}
            onMouseEnter={e => {
              if (!inCart) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)';
                (e.currentTarget as HTMLButtonElement).style.color       = 'var(--accent)';
                (e.currentTarget as HTMLButtonElement).style.width       = '100px';
              }
            }}
            onMouseLeave={e => {
              if (!inCart) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLButtonElement).style.color       = 'var(--text-secondary)';
                (e.currentTarget as HTMLButtonElement).style.width       = '36px';
              }
            }}
          >
            {inCart ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span style={{ opacity: 0, position: 'absolute' }}>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom divider — fades on hover */}
      <div
        className="mx-5 transition-opacity duration-300"
        style={{
          height:  1,
          background: 'var(--border)',
          opacity: hovered ? 0 : 1,
        }}
      />
    </div>
  );
};

/* ── main section ── */
const BestsellersSection: React.FC = () => {
  const bestsellers = getBestSellers().slice(0, 6);
  const sectionRef  = useRef<HTMLElement>(null);
  const [inView,    setInView]    = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pb-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div
          className="flex items-end justify-between mb-14 transition-all duration-700"
          style={{
            opacity:   inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[var(--accent)]" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--accent)]">
                Top Picks
              </span>
            </div>
            <h2
              className="font-['Playfair_Display'] font-bold text-[var(--text-primary)] leading-[1.05]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
            >
              Bestselling<br />
              <span
                style={{
                  WebkitTextStroke: '1.5px var(--text-primary)',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                Titles
              </span>
            </h2>
          </div>

          <Link
            to="/bestsellers"
            className="group hidden sm:flex items-center gap-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            View all
            <div
              className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* ── Two-column list ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
          {bestsellers.map((book, i) => (
            <BestsellerRow
              key={book.id}
              book={book}
              rank={i + 1}
              delay={0.06 * i}
              inView={inView}
            />
          ))}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div
          className="flex items-center justify-between mt-12 pt-8 border-t border-[var(--border)] transition-all duration-700"
          style={{
            opacity:        inView ? 1 : 0,
            transform:      inView ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '0.5s',
          }}
        >
          <p className="text-sm text-[var(--text-muted)]">
            Showing {bestsellers.length} of {getBestSellers().length} bestsellers
          </p>
          <Link
            to="/bestsellers"
            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-300"
          >
            Browse full list
            <svg
              width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BestsellersSection;