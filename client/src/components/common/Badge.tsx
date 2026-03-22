// src/components/common/Badge.tsx
import React from 'react';

type Variant = 'accent' | 'success' | 'danger' | 'muted';

interface Props {
  label:    string;
  variant?: Variant;
  size?:    'sm' | 'md';
}

const colors: Record<Variant, string> = {
  accent:  'bg-[var(--accent)] text-white',
  success: 'bg-emerald-500 text-white',
  danger:  'bg-rose-500 text-white',
  muted:   'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)]',
};

const Badge: React.FC<Props> = ({ label, variant = 'accent', size = 'sm' }) => (
  <span className={`inline-flex items-center font-medium rounded-full ${colors[variant]} ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}>
    {label}
  </span>
);

export default Badge;
