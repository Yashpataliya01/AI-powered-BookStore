// src/components/layout/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useCartCount, useUI } from '../../hooks';
import { toggleCart } from '../../store/slices/cartSlice';
import { closeMobileMenu, toggleMobileMenu, toggleSearch } from '../../store/slices/uiSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartCount = useCartCount();
  const { mobileMenuOpen } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [dispatch, location.pathname]);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'Bestsellers', href: '/bestsellers' },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-[var(--border)] bg-[var(--bg-primary)]/95 shadow-sm backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:px-10">
        <Link to="/" className="group flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[var(--accent)]">
            <span className="text-xs font-bold tracking-widest text-white">F</span>
          </div>
          <span className="font-['Playfair_Display'] text-lg font-semibold tracking-wide text-[var(--text-primary)] sm:text-xl">
            Folio
          </span>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`text-sm tracking-wide transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'font-medium text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => dispatch(toggleSearch())}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] sm:h-10 sm:w-10"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <Link
            to="/wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] sm:h-10 sm:w-10"
            aria-label="Wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          <button
            onClick={() => dispatch(toggleCart())}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] sm:h-10 sm:w-10"
            aria-label="Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-bold text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full transition-colors hover:bg-[var(--bg-secondary)] lg:hidden sm:h-10 sm:w-10"
            aria-label="Menu"
          >
            <span className={`block h-px w-5 bg-[var(--text-primary)] transition-all duration-300 ${mobileMenuOpen ? 'translate-y-1 rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-[var(--text-primary)] transition-all duration-300 ${mobileMenuOpen ? '-translate-y-1 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-b border-[var(--border)] bg-[var(--bg-primary)] transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'bg-[var(--bg-secondary)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
