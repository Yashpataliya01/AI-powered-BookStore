// src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/ui/BookCard';
import { getFeaturedBooks, getBestSellers, getNewArrivals, books, categories } from '../data/books';
import { useAppDispatch } from '../hooks';
import { setCategory } from '../store/slices/filterSlice';
import { useNavigate } from 'react-router-dom';

/* ─── Marquee Strip ─── */
const MarqueeStrip: React.FC = () => {
  const items = ['Fiction', 'Philosophy', 'Science', 'Biography', 'Technology', 'History', 'Art & Design', 'Non-Fiction'];
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[var(--border)] py-3 bg-[var(--bg-primary)]">
      <div className="flex gap-10 w-max" style={{ animation: 'marquee 28s linear infinite' }}>
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center gap-10 flex-shrink-0">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--text-muted)]">{item}</span>
            <span className="text-[var(--accent)] text-base select-none">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Animated Counter ─── */
const Counter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(e * end));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Section Heading ─── */
const SectionHeading: React.FC<{ eyebrow: string; title: string; subtitle?: string }> = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10 sm:mb-12">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-5 h-px bg-[var(--accent)]" />
      <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--accent)]">{eyebrow}</span>
    </div>
    <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-[1.1] mb-3 whitespace-pre-line">{title}</h2>
    {subtitle && <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">{subtitle}</p>}
  </div>
);

/* ─── Main Component ─── */
const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const featured = getFeaturedBooks();
  const bestsellers = getBestSellers().slice(0, 4);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const children = el.querySelectorAll<HTMLElement>('[data-reveal]');
    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(32px)';
      setTimeout(() => {
        child.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 150 + i * 130);
    });
  }, []);

  const handleCategory = (cat: string) => {
    dispatch(setCategory(cat));
    navigate('/shop');
  };

  const catEmoji: Record<string, string> = {
    Fiction: '📖', 'Non-Fiction': '💡', Science: '🔬', Philosophy: '🧠',
    Biography: '👤', 'Art & Design': '🎨', Technology: '💻', History: '🏛️',
  };

  return (
    <>
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(0.8deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(-0.5deg)} }
        @keyframes floatC { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-15px) rotate(0.3deg)} }
        @keyframes floatD { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(-0.8deg)} }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes rotateSlowly { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }

        .gradient-text {
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 45%, #e8956a 55%, var(--text-primary) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* Noise texture overlay */
        .hero-noise::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        .float-book-a { animation: floatA 7s ease-in-out infinite; }
        .float-book-b { animation: floatB 5.5s ease-in-out 1.2s infinite; }
        .float-book-c { animation: floatC 6.5s ease-in-out 0.6s infinite; }
        .float-book-d { animation: floatD 8s ease-in-out 2s infinite; }

        .orbit-ring { animation: rotateSlowly 25s linear infinite; transform-origin: center; }
        .dot-pulse { animation: pulseDot 2s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen overflow-x-hidden">

        {/* ══════════════════════════
            HERO
        ══════════════════════════ */}
        <section className="hero-noise relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-0 pb-14 pt-24 sm:pb-20 sm:pt-28" ref={heroRef}>

          {/* Base warm gradient background */}
          <div className="absolute inset-0 bg-[var(--bg-secondary)]" />

          {/* Soft radial bloom — follows mouse */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 55% at ${52 + mousePos.x * 6}% ${38 + mousePos.y * 6}%, rgba(200,98,42,0.18) 0%, transparent 65%)`,
              transition: 'background 0.4s ease',
            }}
          />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 50% 40% at 15% 80%, rgba(200,98,42,0.06) 0%, transparent 60%)' }}
          />

          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          {/* Diagonal accent stripe */}
          <div className="absolute top-[-10%] left-[55%] w-px h-[130%] bg-gradient-to-b from-transparent via-[var(--accent)]/20 to-transparent rotate-[15deg] pointer-events-none hidden lg:block" />

          {/* Orbit circle decorations */}
          <div
            className="absolute right-[-8vw] top-1/2 hidden h-[55vw] w-[55vw] -translate-y-1/2 rounded-full border border-[var(--border)]/60 pointer-events-none md:block"
            style={{ transform: `translateY(-50%) translate(${mousePos.x * -10}px, ${mousePos.y * -8}px)`, transition: 'transform 0.7s ease' }}
          />
          <div
            className="absolute right-[-4vw] top-1/2 hidden h-[42vw] w-[42vw] -translate-y-1/2 rounded-full border border-[var(--accent)]/15 pointer-events-none md:block"
            style={{ transform: `translateY(-50%) translate(${mousePos.x * -16}px, ${mousePos.y * -12}px)`, transition: 'transform 0.5s ease' }}
          />
          <div
            className="absolute right-[4vw] top-1/2 hidden h-[28vw] w-[28vw] -translate-y-1/2 rounded-full border border-[var(--accent)]/10 pointer-events-none md:block"
            style={{ transform: `translateY(-50%) translate(${mousePos.x * -22}px, ${mousePos.y * -16}px)`, transition: 'transform 0.35s ease' }}
          />

          {/* ── Floating Books (Desktop) ── */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {/* Book 1 — large, top right */}
            {featured[0] && (
              <div className="float-book-a absolute pointer-events-auto"
                style={{ top: '10%', right: '5%', transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -6}px)`, transition: 'transform 0.6s ease' }}>
                <Link to={`/book/${featured[0].id}`} className="block group relative">
                  <div className="w-[155px] h-[215px] rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.22)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                    <img src={featured[0].cover} alt={featured[0].title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  </div>
                  {/* Price tag */}
                  <div className="absolute -bottom-3 -right-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full px-3 py-1 shadow-md">
                    <span className="text-[11px] font-bold text-[var(--accent)]">${featured[0].price}</span>
                  </div>
                </Link>
              </div>
            )}
            {/* Book 2 — medium, mid right */}
            {featured[1] && (
              <div className="float-book-b absolute pointer-events-auto"
                style={{ top: '33%', right: '19%', transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -10}px)`, transition: 'transform 0.5s ease' }}>
                <Link to={`/book/${featured[1].id}`} className="block group">
                  <div className="w-[115px] h-[162px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
                    <img src={featured[1].cover} alt={featured[1].title} className="w-full h-full object-cover" />
                  </div>
                </Link>
              </div>
            )}
            {/* Book 3 — large, lower right */}
            {featured[2] && (
              <div className="float-book-c absolute pointer-events-auto"
                style={{ top: '52%', right: '7%', transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -4}px)`, transition: 'transform 0.8s ease' }}>
                <Link to={`/book/${featured[2].id}`} className="block group">
                  <div className="w-[138px] h-[193px] rounded-2xl overflow-hidden shadow-[0_28px_56px_rgba(0,0,0,0.2)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                    <img src={featured[2].cover} alt={featured[2].title} className="w-full h-full object-cover" />
                  </div>
                </Link>
              </div>
            )}
            {/* Book 4 — small, upper mid */}
            {bestsellers[0] && (
              <div className="float-book-d absolute pointer-events-auto"
                style={{ top: '7%', right: '26%', transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -14}px)`, transition: 'transform 0.4s ease' }}>
                <Link to={`/book/${bestsellers[0].id}`} className="block group">
                  <div className="w-[88px] h-[125px] rounded-lg overflow-hidden shadow-[0_14px_34px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:scale-110">
                    <img src={bestsellers[0].cover} alt={bestsellers[0].title} className="w-full h-full object-cover" />
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* ── Text Content ── */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">

            {/* Eyebrow */}
            <div data-reveal className="mb-7 flex items-center gap-3 sm:mb-9 sm:gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] dot-pulse" />
                <div className="w-1 h-1 rounded-full bg-[var(--accent)]/50 dot-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-0.5 h-0.5 rounded-full bg-[var(--accent)]/25 dot-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)] font-semibold sm:tracking-[0.4em]">
                Curated Literary Collection · 2024
              </span>
            </div>

            {/* Headline */}
            <div data-reveal className="mb-8">
              <h1
                className="font-['Playfair_Display'] text-[var(--text-primary)] leading-[0.92] tracking-tight"
                style={{ fontSize: 'clamp(3rem, 13vw, 10rem)' }}
              >
                <span className="block">Every</span>
                <span className="block italic gradient-text">story</span>
                <span className="block text-[var(--text-primary)]">begins</span>
                <span className="block text-[var(--text-primary)]">
                  with a{' '}
                  <span className="relative inline-block">
                    page.
                    <span
                      className="absolute left-0 bottom-[0.08em] h-[0.06em] w-full bg-[var(--accent)]/40 rounded-full"
                      style={{ transform: 'scaleX(1)', transformOrigin: 'left' }}
                    />
                  </span>
                </span>
              </h1>
            </div>

            {/* Description + CTA */}
            <div data-reveal className="flex max-w-2xl flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8">
              <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-xs flex-shrink-0">
                Handpicked titles for the endlessly curious — from philosophy to science fiction.
              </p>
              <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
                <Link
                  to="/shop"
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--accent)] px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(200,98,42,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,98,42,0.45)] sm:w-auto"
                >
                  <span className="relative z-10">Explore Collection</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  <span className="absolute inset-0 bg-[var(--accent-hover)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-full" />
                </Link>
                <Link to="/categories"
                  className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors underline-offset-4 hover:underline decoration-[var(--accent)]/40">
                  Browse Genres
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div data-reveal className="mt-10 flex flex-wrap gap-3 sm:mt-14 sm:gap-4">
              {[
                { end: 12000, suf: '+', label: 'Titles' },
                { end: 850, suf: '+', label: 'Authors' },
                { end: 98, suf: 'k+', label: 'Happy Readers' },
              ].map(({ end, suf, label }) => (
                <div key={label}
                  className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-primary)]/70 px-4 py-2.5 shadow-sm backdrop-blur-sm sm:px-5">
                  <span className="font-['Playfair_Display'] text-xl font-bold text-[var(--text-primary)]">
                    <Counter end={end} suffix={suf} />
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-40 sm:flex">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <MarqueeStrip />

        {/* ══════════════════════════
            EDITORIAL SPREAD
        ══════════════════════════ */}
        <section className="bg-[var(--bg-primary)] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-12 gap-4">
              {/* Hero book — 7 cols */}
              {featured[0] && (
                <Link to={`/book/${featured[0].id}`}
                  className="group relative col-span-12 block overflow-hidden rounded-3xl md:col-span-7"
                  style={{ aspectRatio: '4/3' }}>
                  <img src={featured[0].cover} alt={featured[0].title}
                    className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {featured[0].bestseller && (
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white sm:left-6 sm:top-6">
                      ★ Bestseller
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{featured[0].category}</p>
                    <h3 className="mb-2 font-['Playfair_Display'] text-2xl font-bold leading-tight text-white sm:text-3xl">{featured[0].title}</h3>
                    <p className="text-white/60 text-sm mb-5">by {featured[0].author}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-['Playfair_Display'] text-2xl text-white">${featured[0].price}</span>
                      <span className="text-xs text-white/50 flex items-center gap-1.5 group-hover:text-white/80 group-hover:gap-3 transition-all duration-300">
                        View Book <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Right column — stacked two */}
              <div className="col-span-12 flex flex-col gap-4 md:col-span-5">
                {featured.slice(1, 3).map((book) => (
                  <Link key={book.id} to={`/book/${book.id}`}
                    className="group relative block min-h-[180px] flex-1 overflow-hidden rounded-2xl">
                    <img src={book.cover} alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-107" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--accent)] mb-1.5">{book.category}</p>
                      <h3 className="font-['Playfair_Display'] text-xl font-bold text-white leading-tight mb-1">{book.title}</h3>
                      <p className="text-white/50 text-xs">{book.author} · <span className="text-white/70 font-semibold">${book.price}</span></p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            BESTSELLERS
        ══════════════════════════ */}
        <section className="bg-[var(--bg-secondary)] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Top Picks" title={`Bestselling\nTitles`} />
              <Link to="/bestsellers"
                className="group hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors border-b border-[var(--border)] pb-0.5 hover:border-[var(--accent)]">
                View All
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {bestsellers.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            DARK MANIFESTO BAND
        ══════════════════════════ */}
        <section className="relative overflow-hidden py-24 sm:py-32 lg:py-36" style={{ background: 'var(--text-primary)' }}>
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 50%)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)]" />
          {/* Large decorative quote mark */}
          <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 select-none font-['Playfair_Display'] text-[25vw] font-bold leading-none text-white/[0.025] pointer-events-none xl:block">
            "
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl">
              <p className="text-[var(--accent)] text-[10px] uppercase tracking-[0.4em] font-semibold mb-8">Our Philosophy</p>
              <blockquote
                className="font-['Playfair_Display'] text-white/90 leading-[1.2] mb-10 italic"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)' }}
              >
                "A reader lives a thousand lives before he dies. The man who never reads lives only one."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-white/20" />
                <p className="text-white/40 text-sm">George R.R. Martin</p>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 border-t border-white/[0.08] pt-12 sm:mt-20 sm:grid-cols-3 sm:gap-8 sm:pt-16">
              {[
                { icon: '🚚', title: 'Free Shipping', desc: 'On all orders above ₹499' },
                { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns' },
                { icon: '🔒', title: 'Secure Checkout', desc: 'SSL encrypted payments' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-white/90 text-sm font-semibold mb-1">{title}</p>
                    <p className="text-white/35 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            CATEGORIES
        ══════════════════════════ */}
        <section className="bg-[var(--bg-primary)] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <SectionHeading eyebrow="Explore" title="Browse by Genre" subtitle="Find your next obsession across every category we carry." />
            <div className="flex flex-wrap gap-3">
              {categories.filter(c => c !== 'All').map(cat => {
                const count = books.filter(b => b.category === cat).length;
                return (
                  <button key={cat} onClick={() => handleCategory(cat)}
                    className="group flex items-center gap-3 rounded-full border border-[var(--border)] py-2.5 pl-3 pr-4 transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:shadow-[0_4px_20px_rgba(200,98,42,0.25)] sm:pr-6">
                    <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] group-hover:bg-white/20 flex items-center justify-center text-base transition-colors flex-shrink-0">
                      {catEmoji[cat] || '📚'}
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-white transition-colors leading-none">{cat}</p>
                      <p className="text-[10px] text-[var(--text-muted)] group-hover:text-white/70 transition-colors mt-0.5">{count} books</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            NEW ARRIVALS
        ══════════════════════════ */}
        <section className="bg-[var(--bg-secondary)] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Fresh In" title="New Arrivals" />
              <Link to="/new-arrivals"
                className="group hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors border-b border-[var(--border)] pb-0.5 hover:border-[var(--accent)]">
                See All
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {getNewArrivals().concat(getBestSellers().slice(2, 4)).slice(0, 4).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            TESTIMONIALS
        ══════════════════════════ */}
        <section className="bg-[var(--bg-primary)] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <SectionHeading eyebrow="Voices" title="What Readers Say" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { q: "The curation here is unlike anything I've found online. Every book feels handpicked with intention.", name: 'Ananya S.', role: 'Book Club Founder, Mumbai' },
                { q: 'Beautiful packaging, lightning-fast delivery, and a selection that actually surprises me every visit.', name: 'Rahul M.', role: 'Literature Teacher, Delhi' },
                { q: 'The interface is so clean and thoughtful. Finding new reads feels like a joy, not a chore.', name: 'Priya K.', role: 'Avid Reader, Pune' },
              ].map(({ q, name, role }, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--accent)]/30 sm:p-8">
                  <div className="absolute top-4 right-6 font-['Playfair_Display'] text-8xl text-[var(--accent)]/6 font-bold leading-none select-none">"</div>
                  <div className="flex gap-0.5 mb-5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-7 italic relative z-10">"{q}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)] text-xs font-bold flex-shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            NEWSLETTER
        ══════════════════════════ */}
        <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] py-20 sm:py-28">
          <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
            <div className="w-10 h-10 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 flex items-center justify-center mx-auto mb-6 text-[var(--accent)]">
              ✉
            </div>
            <h2 className="mb-3 font-['Playfair_Display'] text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Stay in the story.
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
              New arrivals, exclusive deals, and curated reading lists — once a week, no spam.
            </p>
            <div className="mx-auto flex max-w-sm flex-col gap-2 sm:flex-row">
              <input type="email" placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors" />
              <button className="whitespace-nowrap rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white transition-colors shadow-[0_4px_16px_rgba(200,98,42,0.25)] hover:bg-[var(--accent-hover)] hover:shadow-[0_4px_24px_rgba(200,98,42,0.4)]">
                Subscribe
              </button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;
