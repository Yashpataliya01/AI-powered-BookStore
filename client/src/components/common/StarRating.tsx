// src/components/common/StarRating.tsx
import React from 'react';

interface Props { rating: number; size?: number; showCount?: boolean; count?: number; }

const StarRating: React.FC<Props> = ({ rating, size = 12, showCount = false, count }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <svg key={star} width={size} height={size} viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? 'var(--accent)' : 'none'}
          stroke={star <= Math.round(rating) ? 'var(--accent)' : 'var(--text-muted)'}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
    {showCount && count !== undefined && (
      <span className="text-[10px] text-[var(--text-muted)]">({count.toLocaleString()})</span>
    )}
  </div>
);

export default StarRating;
