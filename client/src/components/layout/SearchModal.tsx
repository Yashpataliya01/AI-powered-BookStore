// src/components/layout/SearchModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useUI } from '../../hooks';
import { books } from '../../data/books';
import { setSearchQuery } from '../../store/slices/filterSlice';
import { closeSearch } from '../../store/slices/uiSlice';
import { Book } from '../../types';

const SearchModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchOpen } = useUI();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(closeSearch());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, searchOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const normalizedQuery = query.toLowerCase();
    const filtered = books
      .filter(
        book =>
          book.title.toLowerCase().includes(normalizedQuery) ||
          book.author.toLowerCase().includes(normalizedQuery) ||
          book.category.toLowerCase().includes(normalizedQuery) ||
          book.tags.some(tag => tag.includes(normalizedQuery))
      )
      .slice(0, 5);

    setResults(filtered);
  }, [query]);

  const handleSelect = (book: Book) => {
    dispatch(closeSearch());
    navigate(`/book/${book.id}`);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    dispatch(setSearchQuery(query));
    dispatch(closeSearch());
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 sm:pt-24">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch(closeSearch())}
      />
      <div className="relative flex max-h-[calc(100vh-6rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-[var(--bg-primary)] shadow-2xl sm:max-h-[70vh]">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => event.key === 'Enter' && handleSearch()}
            placeholder="Search books, authors, categories..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
          <kbd className="hidden rounded border border-[var(--border)] px-1.5 py-0.5 text-xs text-[var(--text-muted)] sm:block">ESC</kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-[22rem] overflow-y-auto py-2">
            {results.map(book => (
              <li key={book.id}>
                <button
                  onClick={() => handleSelect(book)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-secondary)] sm:px-5"
                >
                  <img src={book.cover} alt={book.title} className="h-10 w-8 rounded-sm object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-[var(--text-primary)]">{book.title}</p>
                    <p className="line-clamp-1 text-xs text-[var(--text-muted)]">{book.author} · {book.category}</p>
                  </div>
                  <span className="ml-2 text-xs font-medium text-[var(--accent)] sm:text-sm">${book.price}</span>
                </button>
              </li>
            ))}
            <li className="border-t border-[var(--border)] px-4 py-2 sm:px-5">
              <button onClick={handleSearch} className="text-xs text-[var(--accent)] hover:underline">
                See all results for "{query}"
              </button>
            </li>
          </ul>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="px-4 py-8 text-center sm:px-5">
            <p className="text-sm text-[var(--text-muted)]">No results for "{query}"</p>
          </div>
        )}

        {query.length === 0 && (
          <div className="px-4 py-4 sm:px-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Fiction', 'Self-help', 'Philosophy', 'Biography', 'Science'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
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
