// src/pages/private/CheckoutPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useCartTotal, useAppDispatch } from '@/hooks';
import { clearCart, closeCart } from '@/redux/cartSlice';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

type Step = 'shipping' | 'payment' | 'review';

const steps: { key: Step; label: string }[] = [
  { key: 'shipping', label: 'Shipping'  },
  { key: 'payment',  label: 'Payment'   },
  { key: 'review',   label: 'Review'    },
];

const CheckoutPage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { items } = useCart();
  const total     = useCartTotal();

  const [step,        setStep]        = useState<Step>('shipping');
  const [loading,     setLoading]     = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'India',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(clearCart());
      dispatch(closeCart());
      setLoading(false);
      setOrderPlaced(true);
    }, 1600);
  };

  const stepIndex = steps.findIndex(s => s.key === step);

  if (orderPlaced) return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)] mb-3">Order Confirmed!</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
          Thank you for your purchase. A confirmation has been sent to {form.email || 'your inbox'}.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="text-center">
        <p className="text-[var(--text-muted)] mb-4">Your cart is empty.</p>
        <Link to="/shop" className="text-[var(--accent)] hover:underline text-sm">Back to shop</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <Link to="/shop"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Shop
        </Link>

        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)] mb-8">Checkout</h1>

        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <button
                onClick={() => i < stepIndex && setStep(s.key)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${s.key === step ? 'text-[var(--accent)]' : i < stepIndex ? 'text-[var(--text-secondary)] hover:text-[var(--accent)] cursor-pointer' : 'text-[var(--text-muted)] cursor-default'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < stepIndex ? 'bg-[var(--accent)] text-white' : s.key === step ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]'}`}>
                  {i < stepIndex ? '✓' : i + 1}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${i < stepIndex ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            {step === 'shipping' && (
              <>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text-primary)] mb-6">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
                  <InputField label="Last Name"  type="text" name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Doe" />
                </div>
                <InputField label="Email Address" type="email" name="email"   value={form.email}   onChange={handleChange} placeholder="jane@example.com" />
                <InputField label="Phone"         type="tel"   name="phone"   value={form.phone}   onChange={handleChange} placeholder="+91 98765 43210" />
                <InputField label="Street Address" type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 MG Road" />
                <InputField label="City"           type="text" name="city"    value={form.city}    onChange={handleChange} placeholder="Pune" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="State"    type="text" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
                  <InputField label="PIN Code" type="text" name="zip"   value={form.zip}   onChange={handleChange} placeholder="411001" />
                </div>
                <Button variant="primary" fullWidth size="lg" onClick={() => setStep('payment')}>
                  Continue to Payment
                </Button>
              </>
            )}

            {step === 'payment' && (
              <>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text-primary)] mb-6">Payment Details</h2>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8">
                    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <span className="text-sm text-emerald-700 font-medium">Secure SSL encrypted payment</span>
                </div>
                <InputField label="Name on Card"  type="text" name="cardName"   value={form.cardName}   onChange={handleChange} placeholder="Jane Doe" />
                <InputField label="Card Number"   type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Expiry" type="text" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM / YY" />
                  <InputField label="CVV"    type="text" name="cvv"    value={form.cvv}    onChange={handleChange} placeholder="•••" />
                </div>
                <Button variant="primary" fullWidth size="lg" onClick={() => setStep('review')}>
                  Review Order
                </Button>
              </>
            )}

            {step === 'review' && (
              <>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text-primary)] mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-8">
                  {items.map(({ book, quantity }) => (
                    <div key={book.id} className="flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                      <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[var(--text-primary)] truncate">{book.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{book.author}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Qty: {quantity}</p>
                      </div>
                      <span className="font-bold text-sm text-[var(--text-primary)] flex-shrink-0">${(book.price * quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Button variant="primary" fullWidth size="lg" loading={loading} onClick={handlePlaceOrder}>
                  Place Order · ${(total * 1.18).toFixed(2)}
                </Button>
              </>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--text-primary)] mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {items.map(({ book, quantity }) => (
                  <div key={book.id} className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)] truncate max-w-[180px]">{book.title} × {quantity}</span>
                    <span className="text-[var(--text-primary)] font-medium ml-2 flex-shrink-0">${(book.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Subtotal</span>
                  <span className="text-[var(--text-primary)]">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Tax (18%)</span>
                  <span className="text-[var(--text-primary)]">${(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-[var(--border)]">
                  <span className="text-[var(--text-primary)]">Total</span>
                  <span className="font-['Playfair_Display'] text-xl text-[var(--text-primary)]">${(total * 1.18).toFixed(2)}</span>
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
