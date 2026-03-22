// src/pages/authentication/LoginPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import { useAppDispatch } from '@/hooks';
import { setCredentials } from '@/redux/authSlice';

type Mode = 'login' | 'signup' | 'forgot';

const QUOTES = [
  { text: 'Not all those who wander are lost.',              author: 'J.R.R. Tolkien'      },
  { text: 'A reader lives a thousand lives before he dies.', author: 'George R.R. Martin'   },
  { text: 'There is no friend as loyal as a book.',          author: 'Ernest Hemingway'     },
  { text: 'Books are a uniquely portable magic.',            author: 'Stephen King'         },
  { text: 'A book is a dream you hold in your hands.',       author: 'Neil Gaiman'          },
];

const PANEL_BOOKS = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1531072901881-d644216d4bf9?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1476275466078-4cdc8462c831?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=300&h=420&fit=crop',
];

const LoginPage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = (location.state as any)?.from?.pathname || '/';

  const [mode,         setMode]         = useState<Mode>('login');
  const [quoteIdx,     setQuoteIdx]     = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Rotate quotes every 5 s
  useEffect(() => {
    const t = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => { setQuoteIdx(i => (i + 1) % QUOTES.length); setQuoteVisible(true); }, 450);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Animate form on mode change
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim())                    e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (mode !== 'forgot') {
      if (!form.password)             e.password = 'Password is required';
      else if (form.password.length < 6) e.password = 'Min. 6 characters';
    }
    if (mode === 'signup' && form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call — replace with real authApi mutations
    setTimeout(() => {
      setLoading(false);
      if (mode !== 'forgot') {
        dispatch(setCredentials({
          user:  { id: '1', name: form.name || 'Reader', email: form.email },
          token: 'mock-jwt-token',
        }));
      }
      setSuccess(true);
      setTimeout(() => navigate(mode === 'forgot' ? '/login' : from, { replace: true }), 1500);
    }, 1800);
  };

  const switchMode = (m: Mode) => { setMode(m); setErrors({}); setForm({ name:'', email:'', password:'', confirmPassword:'' }); };

  const labels: Record<Mode, { heading: string; sub: string; btn: string }> = {
    login:  { heading: 'Welcome back.',  sub: 'Sign in to your Folio account.',  btn: 'Sign In'          },
    signup: { heading: 'Join Folio.',    sub: 'Create your account in seconds.', btn: 'Create Account'   },
    forgot: { heading: 'Reset password.',sub: "We'll email you a reset link.",   btn: 'Send Reset Link'  },
  };
  const { heading, sub, btn } = labels[mode];
  const q = QUOTES[quoteIdx];

  return (
    <>
      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(1deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px) rotate(-0.8deg)} }
        @keyframes floatC { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px) rotate(0.5deg)} }
        @keyframes floatD { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px) rotate(-1.1deg)} }
        @keyframes floatE { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px) rotate(0.7deg)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .fa{animation:floatA 7s ease-in-out infinite}
        .fb{animation:floatB 5.5s ease-in-out 1.3s infinite}
        .fc{animation:floatC 6.5s ease-in-out 0.7s infinite}
        .fd{animation:floatD 8s ease-in-out 2s infinite}
        .fe{animation:floatE 6s ease-in-out 0.3s infinite}
        .faa{animation:floatA 7s ease-in-out 3s infinite}

        .g-text {
          background:linear-gradient(135deg,var(--text-primary) 0%,var(--accent) 50%,var(--text-primary) 100%);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        .q-fade { transition: opacity 0.45s ease, transform 0.45s ease; }
        .tab-ul::after {
          content:''; position:absolute; bottom:-1px; left:0; right:0;
          height:2px; background:var(--accent); border-radius:1px;
          transform:scaleX(0); transition:transform 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .tab-ul.active::after { transform:scaleX(1); }
        .check-pop { animation:scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="min-h-screen flex">

        {/* ═══ LEFT — Visual panel ═══ */}
        <div className="hidden lg:flex relative w-[48%] xl:w-[52%] flex-col justify-between overflow-hidden"
          style={{ background: 'var(--text-primary)' }}>

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }} />

          {/* Warm glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 58% 40%, rgba(200,98,42,0.2) 0%, transparent 65%)' }} />

          {/* Orbit rings */}
          <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-white/[0.05] pointer-events-none" />
          <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full border border-[var(--accent)]/10 pointer-events-none" />

          {/* Floating books */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { cls:'fa', top:'8%',  left:'12%', w:130, h:185 },
              { cls:'fb', top:'18%', right:'10%', w:100, h:142 },
              { cls:'fc', top:'40%', left:'6%',  w:115, h:162 },
              { cls:'fd', top:'55%', right:'8%', w:125, h:175 },
              { cls:'fe', bottom:'10%', left:'20%', w:95, h:135 },
              { cls:'faa',bottom:'14%', right:'22%', w:82, h:116 },
            ].map(({ cls, w, h, ...pos }, i) => (
              <div key={i} className={`${cls} absolute`} style={pos as React.CSSProperties}>
                <div className="overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
                  style={{ width: w, height: h }}>
                  <img src={PANEL_BOOKS[i]} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>

          {/* Logo */}
          <div className="relative z-10 p-10">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-8 h-8 bg-[var(--accent)] rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">F</span>
              </div>
              <span className="font-['Playfair_Display'] text-xl font-semibold text-white">Folio</span>
            </Link>
          </div>

          {/* Quote */}
          <div className="relative z-10 px-10 pb-16">
            <div className="q-fade" style={{ opacity: quoteVisible ? 1 : 0, transform: quoteVisible ? 'translateY(0)' : 'translateY(10px)' }}>
              <div className="font-['Playfair_Display'] text-white/15 text-8xl leading-none mb-1 select-none">"</div>
              <blockquote className="font-['Playfair_Display'] text-white/85 text-xl font-medium italic leading-relaxed mb-5 max-w-xs">
                {q.text}
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-[var(--accent)]" />
                <cite className="text-white/40 text-xs not-italic">{q.author}</cite>
              </div>
            </div>
            {/* Dots */}
            <div className="flex gap-1.5 mt-7">
              {QUOTES.map((_, i) => (
                <button key={i} onClick={() => { setQuoteIdx(i); setQuoteVisible(true); }}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === quoteIdx ? 20 : 6, height: 6, background: i === quoteIdx ? 'var(--accent)' : 'rgba(255,255,255,0.18)' }} />
              ))}
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
        </div>

        {/* ═══ RIGHT — Form panel ═══ */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-14 xl:px-20 py-12 overflow-y-auto bg-[var(--bg-primary)]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="w-7 h-7 bg-[var(--accent)] rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <span className="font-['Playfair_Display'] text-lg font-semibold text-[var(--text-primary)]">Folio</span>
            </Link>
          </div>

          <div className="max-w-[400px] w-full mx-auto lg:mx-0">

            {/* ── Success ── */}
            {success ? (
              <div className="flex flex-col items-center py-12 text-center" style={{ animation: 'fadeUp 0.6s ease both' }}>
                <div className="check-pop w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {mode === 'forgot' ? 'Email sent!' : mode === 'signup' ? 'Account created!' : 'Welcome back!'}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {mode === 'forgot' ? 'Check your inbox for the reset link.' : 'Redirecting you to Folio…'}
                </p>
              </div>
            ) : (
              <>
                {/* Heading */}
                <div className="mb-8" style={{ animation: 'fadeUp 0.6s ease both' }}>
                  <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)] leading-tight mb-2">
                    {heading.split(' ').map((w, i, arr) =>
                      i === arr.length - 1
                        ? <span key={i} className="g-text">{w}</span>
                        : <span key={i}>{w} </span>
                    )}
                  </h1>
                  <p className="text-sm text-[var(--text-muted)]">{sub}</p>
                </div>

                {/* Mode tabs */}
                {mode !== 'forgot' && (
                  <div className="flex gap-6 mb-8 border-b border-[var(--border)]" style={{ animation: 'fadeUp 0.6s 0.05s ease both' }}>
                    {(['login','signup'] as const).map(m => (
                      <button key={m} onClick={() => switchMode(m)}
                        className={`tab-ul relative pb-3 text-sm font-medium capitalize ${mode === m ? 'active text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
                        {m === 'login' ? 'Sign In' : 'Create Account'}
                      </button>
                    ))}
                  </div>
                )}

                {/* Back for forgot */}
                {mode === 'forgot' && (
                  <button onClick={() => switchMode('login')}
                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                    Back to sign in
                  </button>
                )}

                {/* Social buttons */}
                {mode !== 'forgot' && (
                  <div className="flex gap-3 mb-6" style={{ animation: 'fadeUp 0.6s 0.1s ease both' }}>
                    {[
                      {
                        label: 'Google',
                        icon: (
                          <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        ),
                      },
                      {
                        label: 'Apple',
                        icon: (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                        ),
                      },
                    ].map(({ label, icon }) => (
                      <button key={label} type="button"
                        className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-medium hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)] transition-all">
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Divider */}
                {mode !== 'forgot' && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">or with email</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>
                )}

                {/* Form fields */}
                <div ref={formRef}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                      <InputField label="Full Name" type="text" name="name"
                        value={form.name} onChange={handleChange}
                        placeholder="Jane Doe" error={errors.name} autoComplete="name" />
                    )}
                    <InputField label="Email Address" type="email" name="email"
                      value={form.email} onChange={handleChange}
                      placeholder="you@example.com" error={errors.email} autoComplete="email" />
                    {mode !== 'forgot' && (
                      <InputField label="Password" type="password" name="password"
                        value={form.password} onChange={handleChange}
                        placeholder="Min. 6 characters" error={errors.password}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                    )}
                    {mode === 'signup' && (
                      <InputField label="Confirm Password" type="password" name="confirmPassword"
                        value={form.confirmPassword} onChange={handleChange}
                        placeholder="Repeat password" error={errors.confirmPassword} autoComplete="new-password" />
                    )}

                    {/* Forgot link */}
                    {mode === 'login' && (
                      <div className="flex justify-end -mt-1">
                        <button type="button" onClick={() => switchMode('forgot')}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Terms */}
                    {mode === 'signup' && (
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-[var(--accent)] hover:underline">Terms</Link> and{' '}
                        <Link to="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>.
                      </p>
                    )}

                    <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent) 0%, #d97740 100%)',
                        boxShadow: '0 4px 20px rgba(200,98,42,0.3)',
                      } as React.CSSProperties}>
                      {loading ? (mode === 'forgot' ? 'Sending…' : mode === 'signup' ? 'Creating…' : 'Signing in…') : btn}
                    </Button>
                  </form>
                </div>

                {/* Footer switch */}
                {mode !== 'forgot' && (
                  <p className="text-center text-xs text-[var(--text-muted)] mt-6">
                    {mode === 'login' ? (
                      <>Don't have an account?{' '}
                        <button onClick={() => switchMode('signup')} className="text-[var(--accent)] font-semibold hover:underline">Sign up free</button>
                      </>
                    ) : (
                      <>Already have an account?{' '}
                        <button onClick={() => switchMode('login')} className="text-[var(--accent)] font-semibold hover:underline">Sign in</button>
                      </>
                    )}
                  </p>
                )}

                {/* Back to site */}
                <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                  <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                    Back to Folio
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
