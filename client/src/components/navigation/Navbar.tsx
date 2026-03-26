// src/components/navigation/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useCartCount,
  useUI,
  useIsAuthed,
  useCurrentUser,
} from "@/hooks";
import { toggleCart } from "@/redux/cartSlice";
import { toggleMobileMenu, toggleTheme, toggleSearch } from "@/redux/uiSlice";
import { logout } from "@/redux/authSlice";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useCartCount();
  const { theme, mobileMenuOpen } = useUI();
  const isAuthed = useIsAuthed();
  const user = useCurrentUser();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Bestsellers", href: "/bestsellers" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[var(--bg-primary)] shadow-sm border-b border-[var(--border)]" : "bg-transparent"}`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[var(--accent)] rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]">
            Folio
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`text-sm tracking-wide transition-colors duration-200 ${location.pathname === link.href ? "text-[var(--accent)] font-medium" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => dispatch(toggleSearch())}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Theme */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
          >
            {theme === "light" ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          {/* Cart */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* Auth — User menu or Sign In */}
          {isAuthed && user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[100px]">
                  {user.username}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />

                  {/* Dropdown */}
                  <div
                    className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-xl z-20 py-1 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        {user?.username}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Single Menu Item */}
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      My Orders
                    </Link>

                    {/* Logout */}
                    <div className="border-t border-[var(--border)] mt-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Sign In
            </Link>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <span
              className={`block w-5 h-px bg-[var(--text-primary)] transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[3px]" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-[var(--text-primary)] transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border)] ${mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {!isAuthed && (
            <li>
              <Link
                to="/login"
                className="text-sm font-medium text-[var(--accent)]"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                Sign In / Register
              </Link>
            </li>
          )}
          {isAuthed && (
            <li>
              <button onClick={handleLogout} className="text-sm text-red-500">
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
