// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import Navbar from './Navbar';
import SearchModal from './SearchModal';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
    </div>
  );
};

export default Layout;
