// src/pages/CategoriesPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { books, categories } from '../data/books';
import { useAppDispatch } from '../hooks';
import { setCategory } from '../store/slices/filterSlice';

const catIcons: Record<string, string> = {
  Fiction: '📖',
  'Non-Fiction': '💡',
  Science: '🔬',
  Philosophy: '🧠',
  Biography: '👤',
  'Art & Design': '🎨',
  Technology: '💻',
  History: '🏛️',
};

const catDescriptions: Record<string, string> = {
  Fiction: 'Stories that transport you to other worlds and lives.',
  'Non-Fiction': 'Knowledge, insight and real-world wisdom.',
  Science: 'Explore the mysteries of the universe.',
  Philosophy: 'Timeless questions about existence and meaning.',
  Biography: 'Lives of the remarkable and inspiring.',
  'Art & Design': 'Creativity, aesthetics and visual thinking.',
  Technology: 'The tools and ideas shaping our future.',
  History: 'The stories that made us who we are.',
};

const CategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = (category: string) => {
    dispatch(setCategory(category));
    navigate('/shop');
  };

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-10 sm:mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--accent)]">Explore</p>
          <h1 className="font-['Playfair_Display'] text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">All Categories</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {categories.filter(category => category !== 'All').map(category => {
            const count = books.filter(book => book.category === category).length;
            const sample = books.filter(book => book.category === category).slice(0, 3);

            return (
              <button
                key={category}
                onClick={() => handleClick(category)}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 text-left transition-all duration-300 hover:border-[var(--accent)] hover:shadow-lg sm:p-6"
              >
                <div className="mb-4 text-4xl">{catIcons[category] || '📚'}</div>
                <h3 className="mb-1 font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                  {category}
                </h3>
                <p className="mb-3 text-xs text-[var(--text-muted)]">{count} books</p>
                <p className="mb-5 text-xs leading-relaxed text-[var(--text-secondary)]">{catDescriptions[category]}</p>
                <div className="flex -space-x-2">
                  {sample.map(book => (
                    <img
                      key={book.id}
                      src={book.cover}
                      alt={book.title}
                      className="h-10 w-8 rounded-sm border-2 border-[var(--bg-secondary)] object-cover"
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
