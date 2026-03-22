// src/layout/MainLayout.tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/layout/Footer';
import CartDrawer from '@/layout/CartDrawer';
import SearchModal from '@/components/navigation/SearchModal';
import { useUI } from '@/hooks';

const MainLayout: React.FC = () => {
  const { theme } = useUI();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
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

export default MainLayout;
