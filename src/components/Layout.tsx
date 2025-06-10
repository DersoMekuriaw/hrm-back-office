'use client';

import { useState } from 'react';
import { Navbar } from './Navbar';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  const [drawerOpened, setDrawerOpened] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <div className="md:hidden">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Header
          opened={drawerOpened}
          onBurgerClick={() => setDrawerOpened(!drawerOpened)}
        />
        <main className="p-4 overflow-auto bg-gray-100 h-full text-black">
          {children}
        </main>
          <Footer />
      </div>
    </div>
  );
}
