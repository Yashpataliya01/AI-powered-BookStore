// src/components/common/Button.tsx
import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[0_4px_16px_rgba(200,98,42,0.25)] hover:shadow-[0_4px_24px_rgba(200,98,42,0.4)]',
  secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)]',
  outline:   'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
  ghost:     'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
  danger:    'bg-red-500 text-white hover:bg-red-600',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs rounded-full',
  md: 'px-6 py-3 text-sm rounded-full',
  lg: 'px-8 py-4 text-sm rounded-full',
};

const Button: React.FC<Props> = ({
  variant = 'primary', size = 'md', loading = false, fullWidth = false,
  leftIcon, rightIcon, children, disabled, className = '', ...rest
}) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 font-semibold
      transition-all duration-200 select-none
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}
    {...rest}
  >
    {loading ? (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : leftIcon}
    {children}
    {!loading && rightIcon}
  </button>
);

export default Button;
