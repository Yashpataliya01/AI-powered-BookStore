// src/pages/public/CategoriesPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { books, categories } from '@/data/books';
import { useAppDispatch } from '@/hooks';
import { setCategory } from '@/redux/filterSlice';

const catIcons: Record<string, string> = {
  Fiction: '📖', 'Non-Fiction': '💡', Science: '🔬', Philosophy: '🧠',
  Biography: '👤', 'Art & Design': '🎨', Technology: '💻', History: '🏛️',
};

const catDescriptions: Record<string, string> = {
  Fiction:       'Stories that transport you to other worlds and lives.',
  'Non-Fiction': 'Knowledge, insight and real-world wisdom.',
  Science:       'Explore the mysteries of the universe.',
  Philosophy:    'Timeless questions about existence and meaning.',
  Biography:     'Lives of the remarkable and inspiring.',
  'Art & Design':'Creativity, aesthetics and visual thinking.',
  Technology:    'The tools and ideas shaping our future.',
  History:       'The stories that made us who we are.',
};

const CategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = (cat: string) => {
    dispatch(setCategory(cat));
    navigate('/shop');
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-[var(--accent)]" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--accent)]">Explore</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)]">All Categories</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.filter(c => c !== 'All').map(cat => {
            const count  = books.filter(b => b.category === cat).length;
            const sample = books.filter(b => b.category === cat).slice(0, 3);
            return (
              <button key={cat} onClick={() => handleClick(cat)}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-left hover:border-[var(--accent)] hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{catIcons[cat] || '📚'}</div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {cat}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-2">{count} books</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5">{catDescriptions[cat]}</p>
                <div className="flex -space-x-2">
                  {sample.map(b => (
                    <img key={b.id} src={b.cover} alt={b.title}
                      className="w-8 h-10 object-cover rounded-sm border-2 border-[var(--bg-secondary)]" />
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
