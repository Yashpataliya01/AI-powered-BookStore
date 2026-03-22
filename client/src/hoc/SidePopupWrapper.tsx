// src/hoc/SidePopupWrapper.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen:   boolean;
  onClose:  () => void;
  children: React.ReactNode;
  side?:    'left' | 'right';
  width?:   string;
  title?:   string;
}

/**
 * Slide-in side panel portal (used for Cart, Filters, etc.)
 */
const SidePopupWrapper: React.FC<Props> = ({
  isOpen, onClose, children, side = 'right', width = '400px', title,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full bg-[var(--bg-primary)] z-50 shadow-2xl flex flex-col transition-transform duration-400 ease-out`}
        style={{
          width,
          transform: isOpen
            ? 'translateX(0)'
            : side === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] flex-shrink-0">
            <h2 className="font-['Playfair_Display'] text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-muted)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </>,
    document.body
  );
};

export default SidePopupWrapper;
