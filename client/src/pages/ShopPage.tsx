// src/pages/ShopPage.tsx
import React, { useMemo, useState } from 'react';
import BookCard from '../components/ui/BookCard';
import { books, categories } from '../data/books';
import { useAppDispatch, useFilter } from '../hooks';
import { resetFilters, setCategory, setRating, setSearchQuery, setSortBy } from '../store/slices/filterSlice';
import { FilterState } from '../types';

const ShopPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useFilter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...books];

    if (filter.category !== 'All') {
      result = result.filter(book => book.category === filter.category);
    }

    if (filter.searchQuery) {
      const normalizedQuery = filter.searchQuery.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(normalizedQuery) ||
          book.author.toLowerCase().includes(normalizedQuery)
      );
    }

    if (filter.rating > 0) {
      result = result.filter(book => book.rating >= filter.rating);
    }

    switch (filter.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }

    return result;
  }, [filter]);

  const sortOptions: { label: string; value: FilterState['sortBy'] }[] = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Newest', value: 'newest' },
  ];

  const FilterSidebar: React.FC<{ onSelect?: () => void }> = ({ onSelect }) => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]">Categories</h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category}>
              <button
                onClick={() => {
                  dispatch(setCategory(category));
                  onSelect?.();
                }}
                className={`w-full py-1 text-left text-sm transition-colors ${
                  filter.category === category
                    ? 'font-medium text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {category}
                <span className="ml-1 text-xs text-[var(--text-muted)]">
                  ({category === 'All' ? books.length : books.filter(book => book.category === category).length})
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]">Minimum Rating</h3>
        <div className="space-y-2">
          {[0, 4, 4.5, 4.7].map(rating => (
            <button
              key={rating}
              onClick={() => {
                dispatch(setRating(rating));
                onSelect?.();
              }}
              className={`flex w-full items-center gap-2 py-1 text-left text-sm transition-colors ${
                filter.rating === rating
                  ? 'font-medium text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {rating === 0 ? (
                'Any rating'
              ) : (
                <>
                  <span className="text-[var(--accent)]">★</span>
                  {rating}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          dispatch(resetFilters());
          onSelect?.();
        }}
        className="text-xs text-[var(--text-muted)] underline transition-colors hover:text-[var(--accent)]"
      >
        Reset all filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 sm:mb-10">
          <h1 className="mb-2 font-['Playfair_Display'] text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
            {filter.category === 'All' ? 'All Books' : filter.category}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">{filtered.length} books found</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="hidden w-52 flex-shrink-0 lg:block">
            <FilterSidebar />
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] sm:w-auto lg:hidden"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="12" y1="18" x2="20" y2="18" />
                </svg>
                Filters
              </button>

              <div className="relative w-full sm:max-w-sm sm:flex-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={filter.searchQuery}
                  onChange={event => dispatch(setSearchQuery(event.target.value))}
                  placeholder="Search books..."
                  className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] py-2 pl-9 pr-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              <select
                value={filter.sortBy}
                onChange={event => dispatch(setSortBy(event.target.value as FilterState['sortBy']))}
                className="w-full cursor-pointer rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm text-[var(--text-secondary)] outline-none transition-colors focus:border-[var(--accent)] sm:w-auto"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="mb-4 text-[var(--text-muted)]">No books match your filters.</p>
                <button onClick={() => dispatch(resetFilters())} className="text-sm text-[var(--accent)] hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 lg:gap-8">
                {filtered.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute bottom-0 left-0 top-0 w-full max-w-xs overflow-y-auto bg-[var(--bg-primary)] p-6 shadow-xl sm:max-w-sm sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                aria-label="Close filters"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <FilterSidebar onSelect={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
