// src/components/layout/CartDrawer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useCart, useCartTotal } from '../../hooks';
import { closeCart, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useCart();
  const total = useCartTotal();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => dispatch(closeCart())}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[min(24rem,100vw)] flex-col bg-[var(--bg-primary)] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-5 sm:px-6">
          <div>
            <h2 className="font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]">Your Cart</h2>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)]"
            aria-label="Close cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-secondary)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Your cart is empty</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Add some books you'll love</p>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="rounded-full border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
              >
                Browse Books
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.book.id} className="flex items-start gap-3 border-b border-[var(--border)] py-3 last:border-0">
                <img
                  src={item.book.cover}
                  alt={item.book.title}
                  className="h-[88px] w-16 flex-shrink-0 rounded-sm object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-medium leading-tight text-[var(--text-primary)]">
                    {item.book.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{item.book.author}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-2 py-0.5">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.book.id, quantity: item.quantity - 1 }))}
                        className="flex h-4 w-4 items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        aria-label={`Decrease quantity for ${item.book.title}`}
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-xs text-[var(--text-primary)]">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.book.id, quantity: item.quantity + 1 }))}
                        className="flex h-4 w-4 items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        aria-label={`Increase quantity for ${item.book.title}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.book.id))}
                  className="flex-shrink-0 text-[var(--text-muted)] transition-colors hover:text-red-400"
                  aria-label={`Remove ${item.book.title} from cart`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-[var(--border)] px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Subtotal</span>
              <span className="font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Shipping and taxes calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={() => dispatch(closeCart())}
              className="block w-full rounded-full bg-[var(--accent)] py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => dispatch(closeCart())}
              className="block w-full py-1 text-center text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
