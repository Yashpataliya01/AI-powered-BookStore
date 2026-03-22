// src/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] pt-16 pb-8 mt-24">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[var(--accent)] rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]">Folio</span>
          </Link>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
            Curated books for curious minds. Discover your next great read.
          </p>
          <div className="flex gap-3 mt-5">
            {['T','I','F'].map(s => (
              <a key={s} href="#"
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors text-xs">
                {s}
              </a>
            ))}
          </div>
        </div>

        {[
          { title: 'Shop',    links: [['All Books','/shop'],['New Arrivals','/new-arrivals'],['Bestsellers','/bestsellers'],['Categories','/categories']] },
          { title: 'Company', links: [['About Us','/about'],['Blog','/blog'],['Careers','/careers'],['Press','/press']] },
          { title: 'Support', links: [['FAQ','/faq'],['Shipping','/shipping'],['Returns','/returns'],['Contact','/contact']] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)] mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="border-t border-[var(--border)] pt-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Stay in the story.</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">New arrivals and exclusive deals in your inbox.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 sm:w-52 px-4 py-2.5 text-sm rounded-full border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors" />
            <button className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-full hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
        <p>© 2024 Folio Bookstore. All rights reserved.</p>
        <div className="flex gap-5">
          <Link to="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
          <Link to="/terms"   className="hover:text-[var(--text-primary)] transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
