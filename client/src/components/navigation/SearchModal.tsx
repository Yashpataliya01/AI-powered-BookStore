// src/components/navigation/SearchModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI, useAppDispatch } from '@/hooks';
import { closeSearch } from '@/redux/uiSlice';
import { setSearchQuery } from '@/redux/filterSlice';
import { books } from '@/data/books';
import type { Book } from '@/types';

const SearchModal: React.FC = () => {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const { searchOpen } = useUI();
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
    else { setQuery(''); setResults([]); }
  }, [searchOpen]);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.tags.some(t => t.includes(q))
    ).slice(0, 6));
  }, [query]);

  const close   = () => dispatch(closeSearch());
  const goSearch = () => {
    if (!query.trim()) return;
    dispatch(setSearchQuery(query));
    close();
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  };
  const goBook = (book: Book) => { close(); navigate(`/book/${book.id}`); };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-xl bg-[var(--bg-primary)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input ref={inputRef} type="text" value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && goSearch()}
            placeholder="Search books, authors, categories…"
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm outline-none" />
          <kbd className="hidden sm:block text-xs text-[var(--text-muted)] border border-[var(--border)] rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2">
            {results.map(book => (
              <li key={book.id}>
                <button onClick={() => goBook(book)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[var(--bg-secondary)] transition-colors text-left">
                  <img src={book.cover} alt={book.title} className="w-8 h-10 object-cover rounded-sm flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{book.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{book.author} · {book.category}</p>
                  </div>
                  <span className="ml-auto text-sm font-bold text-[var(--accent)] flex-shrink-0">${book.price}</span>
                </button>
              </li>
            ))}
            <li className="px-5 py-2 border-t border-[var(--border)]">
              <button onClick={goSearch} className="text-xs text-[var(--accent)] hover:underline">
                See all results for "{query}"
              </button>
            </li>
          </ul>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-[var(--text-muted)]">No results for "{query}"</p>
          </div>
        )}

        {query.length === 0 && (
          <div className="px-5 py-4">
            <p className="text-[10px] text-[var(--text-muted)] mb-3 uppercase tracking-wider font-semibold">Popular</p>
            <div className="flex flex-wrap gap-2">
              {['Fiction','Self-help','Philosophy','Biography','Science'].map(tag => (
                <button key={tag} onClick={() => setQuery(tag)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
