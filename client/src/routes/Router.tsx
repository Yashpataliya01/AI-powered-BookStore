// src/routes/Router.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from '@/layout/MainLayout';

// HOC guards
import PrivateRoute from '@/hoc/PrivateRoute';
import PublicRoute  from '@/hoc/PublicRoute';

// Authentication pages
import LoginPage    from '@/pages/authentication/LoginPage';

// Public pages
import HomePage       from '@/pages/public/HomePage';
import ShopPage       from '@/pages/public/ShopPage';
import BookDetailPage from '@/pages/public/BookDetailPage';
import CategoriesPage from '@/pages/public/CategoriesPage';
import BestsellersPage from '@/pages/public/BestsellersPage';
import NewArrivalsPage from '@/pages/public/NewArrivalsPage';

// Private pages
import WishlistPage  from '@/pages/private/WishlistPage';
import CheckoutPage  from '@/pages/private/CheckoutPage';
import OrdersPage    from '@/pages/private/OrdersPage';

const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>

      {/* ── Authentication (no Navbar/Footer) ── */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />

      {/* ── Main app shell ── */}
      <Route element={<MainLayout />}>

        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="shop"          element={<ShopPage />} />
        <Route path="book/:id"      element={<BookDetailPage />} />
        <Route path="categories"    element={<CategoriesPage />} />
        <Route path="bestsellers"   element={<BestsellersPage />} />
        <Route path="new-arrivals"  element={<NewArrivalsPage />} />

        {/* Private routes (require auth) */}
        <Route path="wishlist"  element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
        <Route path="checkout"  element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="orders"    element={<PrivateRoute><OrdersPage /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

    </Routes>
  </BrowserRouter>
);

export default Router;
