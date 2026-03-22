// src/hoc/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthed } from '@/hooks';

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps public-only routes (login, signup).
 * If already authenticated, redirects to home.
 */
const PublicRoute: React.FC<Props> = ({ children }) => {
  const isAuthed = useIsAuthed();

  if (isAuthed) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
