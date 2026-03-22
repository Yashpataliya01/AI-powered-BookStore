// src/pages/public/ShopPage.tsx
import React, { useMemo, useState } from 'react';
import BookCard from '@/components/ui/BookCard';
import Button from '@/components/common/Button';
import { books, categories } from '@/data/books';
import { useAppDispatch, useFilter } from '@/hooks';
import { setCategory, setSortBy, setSearchQuery, setRating, resetFilters } from '@/redux/filterSlice';
import type { FilterState } from '@/types';

const ShopPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter   = useFilter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = [...books];
    if (filter.category !== 'All') r = r.filter(b => b.category === filter.category);
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      r = r.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (filter.rating > 0) r = r.filter(b => b.rating >= filter.rating);
    switch (filter.sortBy) {
      case 'price-asc':  r.sort((a,b) => a.price - b.price); break;
      case 'price-desc': r.sort((a,b) => b.price - a.price); break;
      case 'rating':     r.sort((a,b) => b.rating - a.rating); break;
      case 'newest':     r.sort((a,b) => b.year - a.year); break;
    }
    return r;
  }, [filter]);

  const sortOptions: { label: string; value: FilterState['sortBy'] }[] = [
    { label:'Relevance',        value:'relevance'  },
    { label:'Price: Low → High',value:'price-asc'  },
    { label:'Price: High → Low',value:'price-desc' },
    { label:'Top Rated',        value:'rating'     },
    { label:'Newest',           value:'newest'     },
  ];

  const Filters = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-primary)] mb-4">Categories</h3>
        <ul className="space-y-1.5">
          {categories.map(cat => (
            <li key={cat}>
              <button onClick={() => dispatch(setCategory(cat))}
                className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${filter.category === cat ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}`}>
                {cat}
                <span className="ml-1 text-xs opacity-50">({cat==='All'?books.length:books.filter(b=>b.category===cat).length})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-primary)] mb-4">Min. Rating</h3>
        <div className="space-y-1.5">
          {[0,4,4.5,4.7].map(r => (
            <button key={r} onClick={() => dispatch(setRating(r))}
              className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors flex items-center gap-2 ${filter.rating===r ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
              {r === 0 ? 'Any rating' : <><span className="text-[var(--accent)]">★</span> {r}+</>}
            </button>
          ))}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => dispatch(resetFilters())}>Reset Filters</Button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-10">
          <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)] mb-1">
            {filter.category === 'All' ? 'All Books' : filter.category}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">{filtered.length} books found</p>
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0"><Filters /></aside>

          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                </svg>
                Filters
              </Button>
              <div className="flex-1 max-w-sm relative">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
                  className="absolute left-3 top-1/2 -translate-y-1/2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" value={filter.searchQuery} onChange={e => dispatch(setSearchQuery(e.target.value))}
                  placeholder="Search books…"
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              <select value={filter.sortBy} onChange={e => dispatch(setSortBy(e.target.value as FilterState['sortBy']))}
                className="text-sm border border-[var(--border)] rounded-full px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] cursor-pointer">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[var(--text-muted)] mb-4">No books match your filters.</p>
                <Button variant="outline" size="sm" onClick={() => dispatch(resetFilters())}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filtered.map(book => <BookCard key={book.id} book={book} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg-primary)] shadow-xl p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-[var(--text-primary)]">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <Filters />
          </aside>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
