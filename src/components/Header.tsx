'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  siteTitle: string;
}

export default function Header({ siteTitle }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white border-b border-stone-gray h-20 flex items-center">
        <nav className="w-full max-w-container-max mx-auto px-gutter flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="font-headline-sm text-headline-sm text-legal-navy tracking-tight font-bold"
            >
              {siteTitle}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/hakkimda"
              className="font-nav-link text-nav-link text-on-surface-variant hover:text-prestige-gold transition-colors duration-200"
            >
              Hakkımda
            </Link>
            <Link
              href="/makaleler"
              className="font-nav-link text-nav-link text-on-surface-variant hover:text-prestige-gold transition-colors duration-200"
            >
              Makaleler
            </Link>
            <Link
              href="/iletisim"
              className="font-nav-link text-nav-link text-on-surface-variant hover:text-prestige-gold transition-colors duration-200"
            >
              İletişim
            </Link>
            <Link
              href="/kaynaklar"
              className="font-nav-link text-nav-link text-on-surface-variant hover:text-prestige-gold transition-colors duration-200"
            >
              Kaynaklar
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/iletisim"
              className="px-6 py-2.5 bg-legal-navy text-paper-white font-nav-link text-nav-link hover:bg-opacity-90 transition-all rounded"
            >
              Randevu Al
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-legal-navy flex items-center"
              aria-label="Menüyü Aç"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out border-l border-stone-gray ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-gray">
          <span className="font-headline-sm text-headline-sm text-legal-navy font-bold">Menü</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-legal-navy flex items-center"
            aria-label="Menüyü Kapat"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col p-6 space-y-6">
          <Link
            href="/hakkimda"
            onClick={() => setIsOpen(false)}
            className="font-nav-link text-lg text-legal-navy hover:text-prestige-gold transition-colors"
          >
            Hakkımda
          </Link>
          <Link
            href="/makaleler"
            onClick={() => setIsOpen(false)}
            className="font-nav-link text-lg text-legal-navy hover:text-prestige-gold transition-colors"
          >
            Makaleler
          </Link>
          <Link
            href="/iletisim"
            onClick={() => setIsOpen(false)}
            className="font-nav-link text-lg text-legal-navy hover:text-prestige-gold transition-colors"
          >
            İletişim
          </Link>
          <Link
            href="/kaynaklar"
            onClick={() => setIsOpen(false)}
            className="font-nav-link text-lg text-legal-navy hover:text-prestige-gold transition-colors"
          >
            Kaynaklar
          </Link>
        </div>
      </div>
    </>
  );
}
