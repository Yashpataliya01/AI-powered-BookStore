// Replace the entire {/* ── EDITORIAL SPREAD ── */} section with this

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { addToCart } from '@/redux/cartSlice';
import { getFeaturedBooks } from '@/data/books';

const EditorialSpread: React.FC = () => {
  const featured    = getFeaturedBooks();
  const dispatch    = useAppDispatch();
  const [active,    setActive]    = useState(0);
  const [prev,      setPrev]      = useState<number | null>(null);
  const [animDir,   setAnimDir]   = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef  = useRef<HTMLElement>(null);
  const [inView,    setInView]    = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  /* ── Scroll reveal ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Auto-advance ── */
  useEffect(() => {
    intervalRef.current = setInterval(() => advance('right'), 5000);
    return () => clearInterval(intervalRef.current);
  }, [active, featured.length]);

  const advance = (dir: 'left' | 'right') => {
    if (isAnimating) return;
    clearInterval(intervalRef.current);
    const next = dir === 'right'
      ? (active + 1) % featured.length
      : (active - 1 + featured.length) % featured.length;
    setAnimDir(dir);
    setPrev(active);
    setIsAnimating(true);
    setTimeout(() => { setActive(next); setPrev(null); setIsAnimating(false); }, 600);
  };

  const goTo = (idx: number) => {
    if (idx === active || isAnimating) return;
    advance(idx > active ? 'right' : 'left');
  };

  const book = featured[active];
  if (!book) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-[var(--bg-primary)]"
    >
      <style>{`
        @keyframes slideInFromRight  { from { opacity:0; transform:translateX(60px)  } to { opacity:1; transform:translateX(0) } }
        @keyframes slideInFromLeft   { from { opacity:0; transform:translateX(-60px) } to { opacity:1; transform:translateX(0) } }
        @keyframes slideOutToLeft    { from { opacity:1; transform:translateX(0) }    to { opacity:0; transform:translateX(-60px) } }
        @keyframes slideOutToRight   { from { opacity:1; transform:translateX(0) }    to { opacity:0; transform:translateX(60px) } }
        @keyframes coverIn           { from { opacity:0; transform:scale(0.88) translateY(24px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes infoIn            { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes progressBar       { from { width:0% } to { width:100% } }
        @keyframes floatCover        { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(0.4deg)} }

        .cover-enter   { animation: coverIn 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        .info-enter-1  { animation: infoIn  0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .info-enter-2  { animation: infoIn  0.55s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .info-enter-3  { animation: infoIn  0.55s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
        .info-enter-4  { animation: infoIn  0.55s cubic-bezier(0.16,1,0.3,1) 0.26s both; }
        .info-enter-5  { animation: infoIn  0.55s cubic-bezier(0.16,1,0.3,1) 0.33s both; }

        .float-cover   { animation: floatCover 7s ease-in-out infinite; }

        .progress-bar  { animation: progressBar 5s linear; }

        .tab-line::after {
          content:''; position:absolute; bottom:0; left:0; right:0;
          height:1.5px; background:var(--accent);
          transform:scaleX(0); transform-origin:left;
          transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .tab-line.active::after { transform:scaleX(1); }
      `}</style>

      {/* ── Background number watermark ── */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-['Playfair_Display'] font-bold leading-none select-none pointer-events-none transition-all duration-700"
        style={{
          fontSize: 'clamp(12rem, 28vw, 22rem)',
          color: 'var(--border)',
          opacity: 0.5,
          right: '-2vw',
        }}
      >
        {String(active + 1).padStart(2, '0')}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* ── Eyebrow ── */}
        <div
          className="flex items-center gap-3 mb-20 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <div className="w-5 h-px bg-[var(--accent)]" />
          <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[var(--accent)]">
            Featured Collection
          </span>
          <div className="ml-auto flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="font-['Playfair_Display'] text-lg font-bold text-[var(--text-primary)]">
              {String(active + 1).padStart(2, '0')}
            </span>
            <span>/</span>
            <span>{String(featured.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 lg:gap-16 items-center">

          {/* LEFT — Info panel */}
          <div
            className="order-2 lg:order-1 pt-10 lg:pt-0 transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-32px)', transitionDelay: '0.15s' }}
          >
            {/* Category */}
            <p key={`cat-${active}`} className="info-enter-1 text-[10px] uppercase tracking-[0.35em] font-bold text-[var(--accent)] mb-5">
              {book.category}
            </p>

            {/* Title */}
            <h2
              key={`title-${active}`}
              className="info-enter-2 font-['Playfair_Display'] font-bold text-[var(--text-primary)] leading-[1.0] mb-6"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
            >
              {book.title}
            </h2>

            {/* Author row */}
            <div key={`author-${active}`} className="info-enter-3 flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)] text-xs font-bold flex-shrink-0">
                {book.author[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{book.author}</p>
                <p className="text-xs text-[var(--text-muted)]">{book.year} · {book.pages} pages</p>
              </div>
            </div>

            {/* Description */}
            <p key={`desc-${active}`} className="info-enter-4 text-sm text-[var(--text-secondary)] leading-relaxed mb-10 max-w-sm line-clamp-3">
              {book.description}
            </p>

            {/* Price + CTA */}
            <div key={`cta-${active}`} className="info-enter-5 flex items-center gap-5">
              <div>
                <p className="font-['Playfair_Display'] text-3xl font-bold text-[var(--text-primary)]">
                  ${book.price}
                </p>
                {book.originalPrice && (
                  <p className="text-xs text-[var(--text-muted)] line-through">${book.originalPrice}</p>
                )}
              </div>

              <button
                onClick={() => dispatch(addToCart(book))}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-[0_4px_20px_rgba(200,98,42,0.3)] hover:shadow-[0_8px_32px_rgba(200,98,42,0.45)] hover:gap-4"
              >
                Add to Cart
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="transition-transform group-hover:translate-x-0.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </button>

              <Link
                to={`/book/${book.id}`}
                className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors underline underline-offset-4 decoration-[var(--border)] hover:decoration-[var(--accent)]"
              >
                View Details
              </Link>
            </div>
          </div>

          {/* CENTER — Book cover */}
          <div
            className="order-1 lg:order-2 flex justify-center transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transitionDelay: '0s' }}
          >
            <div className="relative">
              {/* Shadow layers */}
              <div className="absolute inset-0 rounded-3xl bg-[var(--accent)]/10 rotate-3 scale-95 translate-y-6 translate-x-5 blur-sm" />
              <div className="absolute inset-0 rounded-3xl bg-[var(--accent)]/6 -rotate-2 scale-97 translate-y-3 translate-x-2" />

              {/* Cover */}
              <div
                key={`cover-${active}`}
                className="cover-enter float-cover relative w-[220px] sm:w-[260px] lg:w-[300px] aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_48px_96px_rgba(0,0,0,0.22)]"
              >
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                {/* Price chip */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-2xl px-3.5 py-2 shadow-lg">
                  <p className="font-['Playfair_Display'] text-lg font-bold text-[var(--text-primary)] leading-none">
                    ${book.price}
                  </p>
                  {book.originalPrice && (
                    <p className="text-[9px] text-[var(--text-muted)] line-through text-center mt-0.5">
                      ${book.originalPrice}
                    </p>
                  )}
                </div>

                {/* Badge */}
                {book.bestseller && (
                  <div className="absolute top-4 left-4 bg-[var(--accent)] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    ★ Bestseller
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Thumbnail stack */}
          <div
            className="order-3 hidden lg:flex flex-col gap-4 transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(32px)', transitionDelay: '0.25s' }}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold mb-2">
              More Picks
            </p>
            {featured.map((b, i) => (
              <button
                key={b.id}
                onClick={() => goTo(i)}
                className="group flex items-center gap-4 text-left transition-all duration-300 hover:translate-x-1"
              >
                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden rounded-xl flex-shrink-0 transition-all duration-300"
                  style={{
                    width: 52, height: 72,
                    outline: i === active ? '2px solid var(--accent)' : '2px solid transparent',
                    outlineOffset: 3,
                    opacity: i === active ? 1 : 0.45,
                    transform: i === active ? 'scale(1.06)' : 'scale(1)',
                  }}
                >
                  <img src={b.cover} alt={b.title} className="w-full h-full object-cover" />
                </div>

                {/* Mini info */}
                <div className={`transition-all duration-300 ${i === active ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
                  <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight line-clamp-2 max-w-[120px]">
                    {b.title}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{b.author}</p>
                </div>

                {/* Active indicator */}
                {i === active && (
                  <div className="ml-auto w-1 h-8 rounded-full bg-[var(--accent)] flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bottom controls ── */}
        <div
          className="flex items-center gap-6 mt-20 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)', transitionDelay: '0.35s' }}
        >
          {/* Prev / Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => advance('left')}
              className="w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-110 transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={() => advance('right')}
              className="w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-110 transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Progress tabs */}
          <div className="flex items-center gap-3 flex-1">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative flex-1 h-px bg-[var(--border)] overflow-hidden transition-colors hover:bg-[var(--accent)]/40"
              >
                {i === active && (
                  <span
                    key={`prog-${active}`}
                    className="absolute inset-y-0 left-0 bg-[var(--accent)] progress-bar"
                  />
                )}
                {i < active && (
                  <span className="absolute inset-y-0 left-0 w-full bg-[var(--accent)]/40" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile thumbnail dots */}
          <div className="flex gap-2 lg:hidden">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 20 : 6,
                  height: 6,
                  background: i === active ? 'var(--accent)' : 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default EditorialSpread;