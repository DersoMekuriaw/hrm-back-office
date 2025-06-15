'use client';

import { Navbar } from './Navbar';
import { Header } from './Header';
import Footer from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="md:hidden">
        <Navbar />
      </div>

      <div className="flex flex-col flex-1">
        <Header/>
        
        <div className="flex-1 overflow-auto">
          <main className="p-4 bg-gray-100 text-black min-h-[calc(100vh-64px-25px)]">             
            {children}
          </main>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}