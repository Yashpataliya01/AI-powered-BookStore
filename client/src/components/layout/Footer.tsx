// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--bg-secondary)] pb-8 pt-12 sm:mt-24 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-12 grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-4 md:gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[var(--accent)]">
                <span className="text-xs font-bold text-white">F</span>
              </div>
              <span className="font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]">Folio</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
              Curated books for curious minds. Discover your next great read.
            </p>
            <div className="mt-5 flex gap-3">
              {['twitter', 'instagram', 'facebook'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <span className="text-xs capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Shop',
              links: [
                { label: 'All Books', href: '/shop' },
                { label: 'New Arrivals', href: '/new-arrivals' },
                { label: 'Bestsellers', href: '/bestsellers' },
                { label: 'Categories', href: '/categories' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Careers', href: '/careers' },
                { label: 'Press', href: '/press' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'FAQ', href: '/faq' },
                { label: 'Shipping', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
                { label: 'Contact', href: '/contact' },
              ],
            },
          ].map(column => (
            <div key={column.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-8 border-t border-[var(--border)] pt-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h4 className="text-sm font-medium text-[var(--text-primary)]">Subscribe to our newsletter</h4>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Get new arrivals and exclusive offers in your inbox.</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] sm:w-64"
              />
              <button className="whitespace-nowrap rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[var(--accent-hover)]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-[var(--text-muted)] sm:flex-row sm:text-left">
          <p>2024 Folio Bookstore. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
            <Link to="/privacy" className="transition-colors hover:text-[var(--text-primary)]">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-[var(--text-primary)]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
