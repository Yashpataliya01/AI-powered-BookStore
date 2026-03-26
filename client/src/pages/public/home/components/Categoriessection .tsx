// Replace the entire categories section with this.
// Self-contained — drop directly into HomePage.tsx.

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { setCategory } from '@/redux/filterSlice';
import { books, categories } from '@/data/books';

const CAT_CONFIG: Record<string, { emoji: string; color: string; textColor: string; bg: string }> = {
  'Fiction':      { emoji: '📖', color: '#7C5CBF', textColor: '#5a3fa0', bg: 'rgba(124,92,191,0.08)'  },
  'Non-Fiction':  { emoji: '💡', color: '#D97A40', textColor: '#b85e22', bg: 'rgba(217,122,64,0.08)'  },
  'Science':      { emoji: '🔬', color: '#2A9D8F', textColor: '#1f7a6e', bg: 'rgba(42,157,143,0.08)' },
  'Philosophy':   { emoji: '🧠', color: '#E76F51', textColor: '#c0522e', bg: 'rgba(231,111,81,0.08)'  },
  'Biography':    { emoji: '👤', color: '#457B9D', textColor: '#2f5e7a', bg: 'rgba(69,123,157,0.08)'  },
  'Art & Design': { emoji: '🎨', color: '#E63946', textColor: '#b81c2a', bg: 'rgba(230,57,70,0.08)'   },
  'Technology':   { emoji: '💻', color: '#2196F3', textColor: '#1565c0', bg: 'rgba(33,150,243,0.08)'  },
  'History':      { emoji: '🏛️', color: '#8B6914', textColor: '#6b5010', bg: 'rgba(139,105,20,0.08)'  },
};

const CategoriesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleClick = (cat: string) => {
    dispatch(setCategory(cat));
    navigate('/shop');
  };

  const cats = categories.filter(c => c !== 'All');

  return (
    <section
      ref={sectionRef}
      className="py-28 bg-[var(--bg-primary)] overflow-hidden"
    >
      <style>{`
        @keyframes cat-up {
          from { opacity:0; transform:translateY(32px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        .cat-card {
          position: relative;
          cursor: pointer;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          padding: 28px 24px 24px;
          overflow: hidden;
          transition:
            border-color  0.3s ease,
            box-shadow    0.3s ease,
            transform     0.35s cubic-bezier(0.16,1,0.3,1);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .cat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.1);
        }
        .cat-card-fill {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          border-radius: 20px;
        }
        .cat-card:hover .cat-card-fill { opacity: 1; }

        .cat-emoji-ring {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          margin-bottom: 16px;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
          flex-shrink: 0;
        }
        .cat-card:hover .cat-emoji-ring { transform: scale(1.12) rotate(-4deg); }

        .cat-bar-track {
          height: 3px;
          border-radius: 2px;
          background: var(--border);
          margin-top: 16px;
          overflow: hidden;
        }
        .cat-bar-fill {
          height: 100%;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .cat-card:hover .cat-bar-fill { transform: scaleX(1); }

        .cat-arrow {
          position: absolute;
          top: 20px; right: 20px;
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease;
        }
        .cat-card:hover .cat-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

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
                Explore
              </span>
            </div>
            <h2
              className="font-['Playfair_Display'] font-bold text-[var(--text-primary)] leading-[1.05]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
            >
              Browse by Genre
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm leading-relaxed">
              Find your next obsession across every category we carry.
            </p>
          </div>

          {/* Total count badge */}
          <div
            className="hidden sm:flex flex-col items-end gap-1 transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transitionDelay: '0.15s',
            }}
          >
            <span
              className="font-['Playfair_Display'] font-bold text-[var(--text-primary)]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1 }}
            >
              {books.length}
            </span>
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">books total</span>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map((cat, i) => {
            const cfg   = CAT_CONFIG[cat] || { emoji:'📚', color:'var(--accent)', textColor:'var(--accent)', bg:'rgba(200,98,42,0.08)' };
            const count = books.filter(b => b.category === cat).length;
            const pct   = count / books.length;

            return (
              <div
                key={cat}
                className="cat-card"
                onClick={() => handleClick(cat)}
                onMouseEnter={() => setHovered(cat)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  animation: inView
                    ? `cat-up 0.65s cubic-bezier(0.16,1,0.3,1) ${0.05 + i * 0.06}s both`
                    : 'none',
                  opacity: inView ? undefined : 0,
                  borderColor: hovered === cat ? cfg.color + '55' : undefined,
                }}
              >
                {/* Colored fill on hover */}
                <div
                  className="cat-card-fill"
                  style={{ background: cfg.bg }}
                />

                {/* Arrow */}
                <div
                  className="cat-arrow"
                  style={{ borderColor: cfg.color + '40', color: cfg.color }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>

                {/* Emoji ring */}
                <div
                  className="cat-emoji-ring"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.color}22` }}
                >
                  {cfg.emoji}
                </div>

                {/* Name */}
                <p
                  className="font-['Playfair_Display'] font-bold leading-tight relative z-10"
                  style={{
                    fontSize:  'clamp(1rem, 1.6vw, 1.2rem)',
                    color:     'var(--text-primary)',
                    marginBottom: 4,
                  }}
                >
                  {cat}
                </p>

                {/* Count */}
                <p
                  className="relative z-10"
                  style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}
                >
                  {count} books
                </p>

                {/* Progress bar */}
                <div className="cat-bar-track relative z-10">
                  <div
                    className="cat-bar-fill"
                    style={{ background: cfg.color, width: `${pct * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;