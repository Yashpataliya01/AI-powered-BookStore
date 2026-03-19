// src/pages/BestsellersPage.tsx
import React from 'react';
import BookCard from '../components/ui/BookCard';
import { getBestSellers } from '../data/books';

const BestsellersPage: React.FC = () => {
  const bestsellers = getBestSellers();

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-10 sm:mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--accent)]">Most Popular</p>
          <h1 className="font-['Playfair_Display'] text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">Bestsellers</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{bestsellers.length} top-rated books</p>
        </div>
        <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {bestsellers.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestsellersPage;
