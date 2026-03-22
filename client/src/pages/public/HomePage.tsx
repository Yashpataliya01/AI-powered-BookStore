// src/pages/public/HomePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '@/components/ui/BookCard';
import { getFeaturedBooks, getBestSellers, getNewArrivals, books, categories } from '@/data/books';
import { useAppDispatch } from '@/hooks';
import { setCategory } from '@/redux/filterSlice';

const Counter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800, t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const MarqueeStrip: React.FC = () => {
  const items = ['Fiction', 'Philosophy', 'Science', 'Biography', 'Technology', 'History', 'Art & Design', 'Non-Fiction'];
  const rep   = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[var(--border)] py-3 bg-[var(--bg-primary)]">
      <div className="flex gap-10 w-max" style={{ animation: 'marquee 28s linear infinite' }}>
        {rep.map((item, i) => (
          <div key={i} className="flex items-center gap-10 flex-shrink-0">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--text-muted)]">{item}</span>
            <span className="text-[var(--accent)] select-none">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SectionHeading: React.FC<{ eyebrow: string; title: string; subtitle?: string }> = ({ eyebrow, title, subtitle }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-5 h-px bg-[var(--accent)]" />
      <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--accent)]">{eyebrow}</span>
    </div>
    <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-[1.1] mb-3 whitespace-pre-line">{title}</h2>
    {subtitle && <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">{subtitle}</p>}
  </div>
);

const catEmoji: Record<string, string> = {
  Fiction:'📖','Non-Fiction':'💡',Science:'🔬',Philosophy:'🧠',
  Biography:'👤','Art & Design':'🎨',Technology:'💻',History:'🏛️',
};

const HomePage: React.FC = () => {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const featured   = getFeaturedBooks();
  const bestsellers= getBestSellers().slice(0, 4);
  const heroRef    = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: (e.clientX/window.innerWidth - 0.5)*2, y: (e.clientY/window.innerHeight - 0.5)*2 });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>('[data-reveal]').forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(28px)';
      setTimeout(() => {
        c.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, 150 + i * 130);
    });
  }, []);

  const handleCategory = (cat: string) => { dispatch(setCategory(cat)); navigate('/shop'); };

  return (
    <>
      <style>{`
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes floatA  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(0.8deg)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px) rotate(-0.5deg)} }
        @keyframes floatC  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px) rotate(0.3deg)} }
        @keyframes floatD  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px) rotate(-0.8deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }

        .g-text {
          background:linear-gradient(135deg,var(--text-primary) 0%,var(--accent) 45%,#e8956a 55%,var(--text-primary) 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        .hero-book-hover { transition:transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .hero-book-hover:hover { transform:scale(1.04) translateY(-6px) !important; }
      `}</style>

      <div className="min-h-screen overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col justify-end pb-20 overflow-hidden" ref={heroRef}>
          <div className="absolute inset-0 bg-[var(--bg-secondary)]" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 55% at ${52+mousePos.x*6}% ${38+mousePos.y*6}%, rgba(200,98,42,0.18) 0%, transparent 65%)`, transition:'background 0.4s ease' }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage:'linear-gradient(var(--text-primary) 1px,transparent 1px),linear-gradient(90deg,var(--text-primary) 1px,transparent 1px)', backgroundSize:'80px 80px' }} />

          {/* Orbit rings */}
          {[['55vw','55vw','rgba(255,255,255,0.06)','10','-10'],['42vw','42vw','rgba(200,98,42,0.12)','16','-12'],['28vw','28vw','rgba(200,98,42,0.08)','22','-16']].map(([w,h,c,mx,my],i) => (
            <div key={i} className="absolute right-[-8vw] top-1/2 rounded-full border pointer-events-none"
              style={{
                width:w, height:h, borderColor:c,
                transform:`translateY(-50%) translate(${mousePos.x*Number(mx)}px,${mousePos.y*Number(my)}px)`,
                transition:`transform ${0.7-i*0.15}s ease`,
              }} />
          ))}

          {/* Floating books */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {[
              { book:featured[0], cls:'floatA', top:'10%', right:'5%', w:155, h:215, mx:-8,  my:-6, dur:'7s', del:'0s'   },
              { book:featured[1], cls:'floatB', top:'33%', right:'19%',w:115, h:162, mx:-14, my:-10,dur:'5.5s',del:'1.2s' },
              { book:featured[2], cls:'floatC', top:'52%', right:'7%', w:138, h:193, mx:-6,  my:-4, dur:'6.5s',del:'0.6s' },
              { book:bestsellers[0],cls:'floatD',top:'7%',right:'26%', w:88,  h:125, mx:-20, my:-14,dur:'8s', del:'2s'   },
            ].filter(p => p.book).map(({ book, cls, w, h, mx, my, dur, del, ...pos }, i) => (
              <div key={i} className="absolute pointer-events-auto hero-book-hover"
                style={{ ...pos as object, animation:`${cls} ${dur} ease-in-out ${del} infinite`, transform:`translate(${mousePos.x*mx}px,${mousePos.y*my}px)`, transition:'transform 0.6s ease' }}>
                <Link to={`/book/${book!.id}`}>
                  <div className="overflow-hidden rounded-2xl shadow-[0_28px_60px_rgba(0,0,0,0.22)]" style={{ width:w, height:h }}>
                    <img src={book!.cover} alt={book!.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full px-3 py-1 shadow-md">
                    <span className="text-[11px] font-bold text-[var(--accent)]">${book!.price}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Hero text */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <div data-reveal className="flex items-center gap-4 mb-9">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className="rounded-full bg-[var(--accent)]" style={{ width:6-i*2, height:6-i*2, opacity:1-i*0.35, animation:`pulse 2s ${i*0.3}s ease-in-out infinite` }} />)}
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)] font-semibold">Curated Literary Collection · 2024</span>
            </div>

            <div data-reveal className="mb-8">
              <h1 className="font-['Playfair_Display'] text-[var(--text-primary)] leading-[0.92] tracking-tight"
                style={{ fontSize:'clamp(3.8rem,10.5vw,10rem)' }}>
                <span className="block">Every</span>
                <span className="block italic g-text">story</span>
                <span className="block">begins</span>
                <span className="block">with a page.</span>
              </h1>
            </div>

            <div data-reveal className="flex flex-col sm:flex-row items-start sm:items-end gap-8 max-w-2xl">
              <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-xs">
                Handpicked titles for the endlessly curious — from philosophy to science fiction.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/shop"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--accent)] text-white text-sm font-semibold overflow-hidden shadow-[0_4px_20px_rgba(200,98,42,0.3)] hover:shadow-[0_8px_30px_rgba(200,98,42,0.45)] transition-all duration-300">
                  <span className="relative z-10">Explore Collection</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10 transition-transform group-hover:translate-x-1">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  <span className="absolute inset-0 bg-[var(--accent-hover)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-full" />
                </Link>
                <Link to="/categories" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Browse Genres</Link>
              </div>
            </div>

            <div data-reveal className="flex flex-wrap gap-4 mt-14">
              {[{end:12000,suf:'+',label:'Titles'},{end:850,suf:'+',label:'Authors'},{end:98,suf:'k+',label:'Readers'}].map(({ end, suf, label }) => (
                <div key={label} className="flex items-center gap-3 bg-[var(--bg-primary)]/70 backdrop-blur-sm border border-[var(--border)] rounded-full px-5 py-2.5 shadow-sm">
                  <span className="font-['Playfair_Display'] text-xl font-bold text-[var(--text-primary)]">
                    <Counter end={end} suffix={suf} />
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
          </div>
        </section>

        <MarqueeStrip />

        {/* ── EDITORIAL SPREAD ── */}
        <section className="py-28 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-12 gap-4">
              {featured[0] && (
                <Link to={`/book/${featured[0].id}`} className="col-span-12 md:col-span-7 group relative overflow-hidden rounded-3xl block" style={{ aspectRatio:'4/3' }}>
                  <img src={featured[0].cover} alt={featured[0].title} className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {featured[0].bestseller && <div className="absolute top-6 left-6 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">★ Bestseller</div>}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{featured[0].category}</p>
                    <h3 className="font-['Playfair_Display'] text-3xl font-bold text-white leading-tight mb-2">{featured[0].title}</h3>
                    <p className="text-white/60 text-sm mb-4">by {featured[0].author}</p>
                    <div className="flex items-center gap-4">
                      <span className="font-['Playfair_Display'] text-2xl text-white">${featured[0].price}</span>
                      <span className="text-xs text-white/50 group-hover:text-white/80 group-hover:gap-3 transition-all flex items-center gap-1.5">
                        View Book <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}
              <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
                {featured.slice(1, 3).map(book => (
                  <Link key={book.id} to={`/book/${book.id}`} className="group relative overflow-hidden rounded-2xl flex-1 block min-h-[180px]">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--accent)] mb-1.5">{book.category}</p>
                      <h3 className="font-['Playfair_Display'] text-xl font-bold text-white leading-tight mb-1">{book.title}</h3>
                      <p className="text-white/50 text-xs">{book.author} · <span className="text-white/70 font-bold">${book.price}</span></p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BESTSELLERS ── */}
        <section className="py-24 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between">
              <SectionHeading eyebrow="Top Picks" title={`Bestselling\nTitles`} />
              <Link to="/bestsellers" className="group hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors border-b border-[var(--border)] pb-0.5 hover:border-[var(--accent)]">
                View All <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {bestsellers.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </div>
        </section>

        {/* ── DARK MANIFESTO ── */}
        <section className="relative py-36 overflow-hidden" style={{ background:'var(--text-primary)' }}>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 50%)', backgroundSize:'40px 40px' }} />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)]" />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 font-['Playfair_Display'] text-[25vw] font-bold text-white/[0.025] leading-none pointer-events-none select-none hidden lg:block">"</div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-4xl">
              <p className="text-[var(--accent)] text-[10px] uppercase tracking-[0.4em] font-semibold mb-8">Our Philosophy</p>
              <blockquote className="font-['Playfair_Display'] text-white/90 leading-[1.2] mb-10 italic" style={{ fontSize:'clamp(1.6rem,3.5vw,3rem)' }}>
                "A reader lives a thousand lives before he dies. The man who never reads lives only one."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-white/20" />
                <p className="text-white/40 text-sm">George R.R. Martin</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 pt-16 border-t border-white/[0.08]">
              {[['🚚','Free Shipping','On all orders above ₹499'],['↩️','Easy Returns','30-day hassle-free returns'],['🔒','Secure Checkout','SSL encrypted payments']].map(([icon,title,desc]) => (
                <div key={title as string} className="flex items-start gap-4">
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

        {/* ── CATEGORIES ── */}
        <section className="py-24 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <SectionHeading eyebrow="Explore" title="Browse by Genre" subtitle="Find your next obsession across every category we carry." />
            <div className="flex flex-wrap gap-3">
              {categories.filter(c => c !== 'All').map(cat => (
                <button key={cat} onClick={() => handleCategory(cat)}
                  className="group flex items-center gap-3 pl-3 pr-6 py-2.5 rounded-full border border-[var(--border)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(200,98,42,0.25)]">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] group-hover:bg-white/20 flex items-center justify-center text-base transition-colors">{catEmoji[cat]||'📚'}</span>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-white transition-colors leading-none">{cat}</p>
                    <p className="text-[10px] text-[var(--text-muted)] group-hover:text-white/70 transition-colors mt-0.5">{books.filter(b=>b.category===cat).length} books</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEW ARRIVALS ── */}
        <section className="py-24 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between">
              <SectionHeading eyebrow="Fresh In" title="New Arrivals" />
              <Link to="/new-arrivals" className="group hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors border-b border-[var(--border)] pb-0.5 hover:border-[var(--accent)]">
                See All <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {getNewArrivals().concat(getBestSellers().slice(2,4)).slice(0,4).map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <SectionHeading eyebrow="Voices" title="What Readers Say" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {q:'The curation here is unlike anything Ive found online. Every book feels handpicked with intention.',name:'Ananya S.',role:'Book Club Founder, Mumbai'},
                {q:'Beautiful packaging, fast delivery, and a selection that surprises me every visit.',name:'Rahul M.',role:'Literature Teacher, Delhi'},
                {q:'The interface is so clean and thoughtful. Finding new reads feels like a joy.',name:'Priya K.',role:'Avid Reader, Pune'},
              ].map(({ q, name, role }, i) => (
                <div key={i} className="relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/30 transition-colors overflow-hidden">
                  <div className="absolute top-4 right-6 font-['Playfair_Display'] text-8xl text-[var(--accent)]/6 font-bold leading-none select-none">"</div>
                  <div className="flex gap-0.5 mb-5">
                    {[1,2,3,4,5].map(s=><svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="var(--accent)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-7 italic">"{q}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)] text-xs font-bold">{name[0]}</div>
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

        {/* ── NEWSLETTER ── */}
        <section className="py-28 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-xl mx-auto px-6 text-center">
            <div className="w-10 h-10 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 flex items-center justify-center mx-auto mb-6 text-[var(--accent)]">✉</div>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)] mb-3">Stay in the story.</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">New arrivals, exclusive deals, and curated reading lists — once a week, no spam.</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input type="email" placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors" />
              <button className="px-6 py-3.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-full hover:bg-[var(--accent-hover)] transition-colors shadow-[0_4px_16px_rgba(200,98,42,0.25)] whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
