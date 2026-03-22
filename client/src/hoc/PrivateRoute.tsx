// src/hoc/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthed } from '@/hooks';

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps any route that requires authentication.
 * Redirects to /login and stores the intended path so we
 * can send the user back after they sign in.
 */
const PrivateRoute: React.FC<Props> = ({ children }) => {
  const isAuthed  = useIsAuthed();
  const location  = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
