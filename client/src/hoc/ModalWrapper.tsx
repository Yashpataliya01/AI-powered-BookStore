// src/hoc/ModalWrapper.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen:    boolean;
  onClose:   () => void;
  children:  React.ReactNode;
  maxWidth?: string;
}

/**
 * Generic modal portal wrapper.
 * Locks body scroll while open and closes on overlay click or ESC.
 */
const ModalWrapper: React.FC<Props> = ({ isOpen, onClose, children, maxWidth = '500px' }) => {
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="relative w-full rounded-2xl bg-[var(--bg-primary)] shadow-2xl z-10 p-6"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalWrapper;
