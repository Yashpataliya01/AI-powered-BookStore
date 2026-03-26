// Replace {/* ── DARK MANIFESTO ── */} with this.

import React, { useRef, useState, useEffect } from 'react';

// These are FIXED values — they never flip with the theme.
// The manifesto section is always dark, in both light and dark mode.
const DARK_BG      = '#13110b';          // near-black warm
const DARK_BG_DEEP = '#0d0b07';          // deeper for grain
const TEXT_HI      = 'rgba(255,255,255,0.92)';
const TEXT_MID     = 'rgba(255,255,255,0.55)';
const TEXT_LO      = 'rgba(255,255,255,0.28)';
const BORDER_FAINT = 'rgba(255,255,255,0.07)';
const ACCENT       = '#c8622a';           // hardcoded so dark-mode accent shift doesn't affect it

const ManifestoSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: DARK_BG,
        padding: 'clamp(5rem, 12vw, 9rem) 0',
      }}
    >
      <style>{`
        @keyframes m-up   { from { opacity:0; transform:translateY(36px) } to { opacity:1; transform:translateY(0) } }
        @keyframes m-line { from { transform:scaleX(0) } to { transform:scaleX(1) } }
        @keyframes m-fade { from { opacity:0 } to { opacity:1 } }
        .m-r1 { animation: m-up   0.9s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .m-r2 { animation: m-up   0.9s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
        .m-r3 { animation: m-up   0.9s cubic-bezier(0.16,1,0.3,1) 0.30s both; }
        .m-r4 { animation: m-up   0.9s cubic-bezier(0.16,1,0.3,1) 0.42s both; }
        .m-r5 { animation: m-fade 0.9s ease                        0.55s both; }
        .m-ln { animation: m-line 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s  both; transform-origin: left; }
        .m-paused * { animation-play-state: paused !important; }
      `}</style>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      {/* Fixed left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: 3, background: ACCENT }}
      />

      <div className={`max-w-7xl mx-auto px-6 lg:px-16 relative z-10 ${visible ? '' : 'm-paused'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-20 lg:gap-32 items-center">

          {/* ── LEFT: Quote ── */}
          <div>
            {/* Eyebrow */}
            <div className="m-r1 flex items-center gap-3 mb-10">
              <div style={{ width: 20, height: 1, background: ACCENT }} />
              <p style={{
                fontSize: 10, letterSpacing: '0.38em',
                textTransform: 'uppercase', fontWeight: 600,
                color: ACCENT,
              }}>
                Our Philosophy
              </p>
            </div>

            {/* Rule line */}
            <div
              className="m-ln"
              style={{ height: 1, background: BORDER_FAINT, marginBottom: '2.5rem' }}
            />

            {/* Giant quote mark */}
            <div
              className="m-r2 font-['Playfair_Display'] select-none leading-none"
              style={{
                fontSize: 'clamp(5rem,12vw,9rem)',
                color: ACCENT,
                opacity: 0.22,
                lineHeight: 0.8,
                marginBottom: '0.4rem',
              }}
            >
              "
            </div>

            {/* Quote */}
            <blockquote
              className="m-r3 font-['Playfair_Display'] italic"
              style={{
                fontSize:     'clamp(1.5rem, 2.8vw, 2.6rem)',
                lineHeight:   1.22,
                color:        TEXT_HI,
                fontWeight:   500,
                marginBottom: '2rem',
              }}
            >
              A reader lives a thousand lives before he dies.
              The man who never reads lives only one.
            </blockquote>

            {/* Attribution */}
            <div className="m-r4 flex items-center gap-4">
              <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              <p style={{ fontSize: 13, color: TEXT_LO, fontStyle: 'italic' }}>
                George R.R. Martin
              </p>
            </div>
          </div>

          {/* ── RIGHT: Stacked books ── */}
          <div className="m-r5 relative hidden lg:block" style={{ height: 420 }}>

            {/* Accent glow */}
            <div
              className="absolute"
              style={{
                width: 380, height: 380,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(200,98,42,0.16) 0%, transparent 68%)`,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -52%)',
                pointerEvents: 'none',
              }}
            />

            {/* Book — back left */}
            <div style={{
              position: 'absolute', top: 50, left: 80,
              width: 155, height: 225,
              borderRadius: 8, overflow: 'hidden',
              boxShadow: '0 32px 60px rgba(0,0,0,0.6)',
              transform: 'rotate(-8deg) translateY(10px)',
              transformOrigin: 'bottom center',
            }}>
              <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=440&fit=crop" alt="" className="w-full h-full object-cover" />
              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.2)' }} />
            </div>

            {/* Book — back right */}
            <div style={{
              position: 'absolute', top: 65, right: 55,
              width: 138, height: 200,
              borderRadius: 8, overflow: 'hidden',
              boxShadow: '0 24px 50px rgba(0,0,0,0.5)',
              transform: 'rotate(7deg) translateY(6px)',
              transformOrigin: 'bottom center',
            }}>
              <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=440&fit=crop" alt="" className="w-full h-full object-cover" />
              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.15)' }} />
            </div>

            {/* Book — front hero */}
            <div style={{
              position: 'absolute', top: 18,
              left: '50%', transform: 'translateX(-50%) rotate(-1.5deg)',
              width: 182, height: 264,
              borderRadius: 10, overflow: 'hidden',
              boxShadow: '0 48px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
              zIndex: 10,
            }}>
              <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=440&fit=crop" alt="" className="w-full h-full object-cover" />
              {/* Spine glint */}
              <div style={{
                position:'absolute', top:0, left:0, bottom:0, width:5,
                background:'linear-gradient(to right, rgba(255,255,255,0.14), transparent)',
              }} />
            </div>

            {/* Table surface line */}
            <div style={{
              position:'absolute', bottom:0, left:24, right:24,
              height:1, background:'rgba(255,255,255,0.05)', borderRadius:2,
            }} />

            {/* Drop shadow on surface */}
            <div style={{
              position:'absolute', bottom:2, left:'50%',
              transform:'translateX(-50%)',
              width:200, height:28, borderRadius:'50%',
              background:'rgba(0,0,0,0.4)',
              filter:'blur(10px)',
            }} />

            {/* Badge */}
            <div style={{
              position:'absolute', top:8, right:18, zIndex:20,
              background: ACCENT,
              color:'#fff',
              fontSize:9, fontWeight:700,
              letterSpacing:'0.15em', textTransform:'uppercase',
              padding:'5px 13px', borderRadius:100,
              boxShadow:`0 6px 20px rgba(200,98,42,0.5)`,
            }}>
              12k+ Titles
            </div>
          </div>
        </div>

        {/* ── Trust row ── */}
        <div
          className="m-r4"
          style={{
            marginTop: 'clamp(3.5rem, 7vw, 6rem)',
            paddingTop: 'clamp(2rem, 4vw, 3rem)',
            borderTop: `1px solid ${BORDER_FAINT}`,
            display:'flex', flexWrap:'wrap', gap:24, alignItems:'center',
          }}
        >
          {[
            { label:'Free Shipping',   sub:'Orders above ₹499' },
            { label:'Easy Returns',    sub:'30-day window'      },
            { label:'Secure Payments', sub:'SSL encrypted'      },
          ].map(({ label, sub }, i) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:16 }}>
              {i > 0 && (
                <div style={{ width:4, height:4, borderRadius:'50%', background:'rgba(255,255,255,0.1)', flexShrink:0 }} />
              )}
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:TEXT_MID, marginBottom:1 }}>{label}</p>
                <p style={{ fontSize:11, color:TEXT_LO }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;