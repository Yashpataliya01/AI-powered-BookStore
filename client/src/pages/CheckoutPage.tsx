// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { clearCart, closeCart } from '../store/slices/cartSlice';

type Step = 'shipping' | 'payment' | 'review';

interface CartItem {
  id: number;
  title: string;
  description: string;
  author: string;
  price: number;
  quantity: number;
  image_url: string;
  category: string;
  publisher: string;
  pages: number;
  year: number;
  tags: string;
}

interface CartData {
  cart_id: number;
  items: CartItem[];
  total_price: number;
}

const CheckoutPage: React.FC = () => {
  console.log('Rendering CheckoutPage');
  const dispatch = useAppDispatch();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>('shipping');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data: CartData = await response.json();
        setCartData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handlePlaceOrder = () => {
    dispatch(clearCart());
    dispatch(closeCart());
    setOrderPlaced(true);
  };

  // ─── Loading State ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20 pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--accent)]" />
          <p className="text-sm text-[var(--text-muted)]">Loading your cart…</p>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20 pt-24">
        <div className="px-4 text-center">
          <p className="mb-4 text-red-400">{error}</p>
          <Link to="/shop" className="text-sm text-[var(--accent)] hover:underline">Back to shop</Link>
        </div>
      </div>
    );
  }

  // ─── Order Confirmed ──────────────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20 pt-24">
        <div className="max-w-md px-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="mb-3 font-['Playfair_Display'] text-4xl font-semibold text-[var(--text-primary)]">Order Confirmed!</h1>
          <p className="mb-8 text-sm leading-relaxed text-[var(--text-muted)]">
            Thank you for your purchase. A confirmation email has been sent to {form.email || 'your inbox'}.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ─── Empty Cart ───────────────────────────────────────────────────────────────
  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20 pt-24">
        <div className="px-4 text-center">
          <p className="mb-4 text-[var(--text-muted)]">Your cart is empty.</p>
          <Link to="/shop" className="text-sm text-[var(--accent)] hover:underline">Back to shop</Link>
        </div>
      </div>
    );
  }

  const { items, total_price } = cartData;
  const tax = total_price * 0.18;
  const grandTotal = total_price + tax;

  const steps: { key: Step; label: string }[] = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ];
  const stepIndex = steps.findIndex(entry => entry.key === step);

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] sm:mb-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Shop
        </Link>

        <h1 className="mb-8 font-['Playfair_Display'] text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">Checkout</h1>

        {/* ── Step Indicators ── */}
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {steps.map((entry, index) => {
            const isCompleted = index < stepIndex;
            const isCurrent = entry.key === step;

            return (
              <button
                key={entry.key}
                onClick={() => isCompleted && setStep(entry.key)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isCurrent
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : isCompleted
                      ? 'border-[var(--accent)]/30 text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent || isCompleted
                      ? 'bg-[var(--accent)] text-white'
                      : 'border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span className="text-sm font-medium">{entry.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          {/* ── Main Form ── */}
          <div className="lg:col-span-2">

            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="space-y-4 sm:space-y-5">
                <h2 className="mb-6 font-['Playfair_Display'] text-2xl font-semibold text-[var(--text-primary)]">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { name: 'firstName', label: 'First Name', placeholder: 'John' },
                    { name: 'lastName', label: 'Last Name', placeholder: 'Doe' },
                  ].map(field => (
                    <div key={field.name}>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">{field.label}</label>
                      <input
                        name={field.name}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
                      />
                    </div>
                  ))}
                </div>

                {[
                  { name: 'email', label: 'Email Address', placeholder: 'john@example.com' },
                  { name: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210' },
                  { name: 'address', label: 'Street Address', placeholder: '123 MG Road' },
                  { name: 'city', label: 'City', placeholder: 'Pune' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">{field.label}</label>
                    <input
                      name={field.name}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">PIN Code</label>
                    <input
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="411001"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep('payment')}
                  className="mt-4 w-full rounded-full bg-[var(--accent)] py-4 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="space-y-4 sm:space-y-5">
                <h2 className="mb-6 font-['Playfair_Display'] text-2xl font-semibold text-[var(--text-primary)]">Payment Details</h2>
                <div className="mb-2 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span className="text-sm text-[var(--text-secondary)]">Secure SSL encrypted payment</span>
                </div>

                {[
                  { name: 'cardName', label: 'Name on Card', placeholder: 'John Doe' },
                  { name: 'cardNumber', label: 'Card Number', placeholder: '4242 4242 4242 4242' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">{field.label}</label>
                    <input
                      name={field.name}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Expiry</label>
                    <input
                      name="expiry"
                      value={form.expiry}
                      onChange={handleChange}
                      placeholder="MM / YY"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">CVV</label>
                    <input
                      name="cvv"
                      value={form.cvv}
                      onChange={handleChange}
                      placeholder="***"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep('review')}
                  className="mt-4 w-full rounded-full bg-[var(--accent)] py-4 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
                >
                  Review Order
                </button>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div>
                <h2 className="mb-6 font-['Playfair_Display'] text-2xl font-semibold text-[var(--text-primary)]">Review Your Order</h2>
                <div className="mb-8 space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-20 w-14 rounded-lg object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/56x80?text=Book'; }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{item.author}</p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">Qty: {item.quantity}</p>
                      </div>
                      <span className="ml-3 text-sm font-semibold text-[var(--text-primary)]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full rounded-full bg-[var(--accent)] py-4 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
                >
                  Place Order — ₹{grandTotal.toFixed(2)}
                </button>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 sm:p-6 lg:sticky lg:top-24">
              <h3 className="mb-5 font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]">Order Summary</h3>
              <div className="mb-5 space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm">
                    <span className="max-w-[180px] truncate text-[var(--text-secondary)]">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="ml-2 font-medium text-[var(--text-primary)]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-[var(--border)] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Subtotal</span>
                  <span className="text-[var(--text-primary)]">₹{total_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Shipping</span>
                  <span className="text-emerald-300">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Tax (18%)</span>
                  <span className="text-[var(--text-primary)]">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
                  <span className="text-[var(--text-primary)]">Total</span>
                  <span className="font-['Playfair_Display'] text-xl text-[var(--text-primary)]">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;