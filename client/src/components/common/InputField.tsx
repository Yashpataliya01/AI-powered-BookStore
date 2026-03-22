// src/components/common/InputField.tsx
import React, { useState } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
}

const InputField: React.FC<Props> = ({ label, error, hint, type, className = '', ...rest }) => {
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState(false);
  const isPassword = type === 'password';
  const inputType  = isPassword && showPass ? 'text' : type;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-4 py-3.5 rounded-xl border text-sm bg-[var(--bg-primary)]
            text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-200
            ${error
              ? 'border-red-400'
              : focused
              ? 'border-[var(--accent)] shadow-[0_0_0_3px_rgba(200,98,42,0.08)]'
              : 'border-[var(--border)]'}
            ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {showPass ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2"/>
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p className="text-[11px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
};

export default InputField;
