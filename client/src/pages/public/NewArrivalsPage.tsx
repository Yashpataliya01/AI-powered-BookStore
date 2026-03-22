// src/pages/public/NewArrivalsPage.tsx
import React from 'react';
import BookCard from '@/components/ui/BookCard';
import { getNewArrivals, books } from '@/data/books';

const NewArrivalsPage: React.FC = () => {
  const newArrivals = getNewArrivals();
  const recent      = books.filter(b => b.year >= 2020 && !b.newArrival).slice(0, 4);
  const all         = [...newArrivals, ...recent];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-[var(--accent)]" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--accent)]">Just In</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)]">New Arrivals</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Fresh additions to our collection</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {all.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;
