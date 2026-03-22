// src/layout/CartDrawer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import SidePopupWrapper from '@/hoc/SidePopupWrapper';
import { useCart, useCartTotal, useAppDispatch } from '@/hooks';
import { removeFromCart, updateQuantity, closeCart } from '@/redux/cartSlice';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useCart();
  const total = useCartTotal();

  return (
    <SidePopupWrapper isOpen={isOpen} onClose={() => dispatch(closeCart())} title="Your Cart" width="380px">
      <div className="flex flex-col h-full">

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Your cart is empty</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Add some books you'll love</p>
              </div>
              <button onClick={() => dispatch(closeCart())}
                className="text-sm text-[var(--accent)] border border-[var(--accent)] px-5 py-2 rounded-full hover:bg-[var(--accent)] hover:text-white transition-colors">
                Browse Books
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.book.id} className="flex gap-3 py-3 border-b border-[var(--border)] last:border-0">
                <img src={item.book.cover} alt={item.book.title}
                  className="w-14 rounded-lg object-cover flex-shrink-0" style={{ height: 80 }} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] leading-tight line-clamp-2">{item.book.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.book.author}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 border border-[var(--border)] rounded-full px-2 py-0.5">
                      <button onClick={() => dispatch(updateQuantity({ id: item.book.id, quantity: item.quantity - 1 }))}
                        className="w-4 h-4 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">−</button>
                      <span className="text-xs w-4 text-center text-[var(--text-primary)]">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ id: item.book.id, quantity: item.quantity + 1 }))}
                        className="w-4 h-4 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">+</button>
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)]">${(item.book.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => dispatch(removeFromCart(item.book.id))}
                  className="flex-shrink-0 text-[var(--text-muted)] hover:text-red-400 transition-colors mt-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[var(--border)] space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Subtotal</span>
              <span className="font-['Playfair_Display'] text-xl font-bold text-[var(--text-primary)]">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Shipping & taxes at checkout</p>
            <Link to="/checkout" onClick={() => dispatch(closeCart())}
              className="block w-full bg-[var(--accent)] text-white text-sm font-semibold text-center py-3.5 rounded-full hover:bg-[var(--accent-hover)] transition-colors">
              Proceed to Checkout
            </Link>
            <button onClick={() => dispatch(closeCart())}
              className="block w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </SidePopupWrapper>
  );
};

export default CartDrawer;
