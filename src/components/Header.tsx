'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  siteTitle: string;
}

export default function Header({ siteTitle }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white dark:bg-slate-900 border-b border-stone-gray dark:border-slate-800 h-20 flex items-center transition-colors duration-300">
        <nav className="w-full max-w-container-max mx-auto px-gutter flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="font-headline-sm text-headline-sm text-legal-navy dark:text-slate-100 tracking-tight font-bold transition-colors"
            >
              {siteTitle}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/hakkimda"
              className="font-nav-link text-nav-link text-on-surface-variant dark:text-slate-300 hover:text-prestige-gold dark:hover:text-prestige-gold transition-colors duration-200"
            >
              Hakkımda
            </Link>
            <Link
              href="/makaleler"
              className="font-nav-link text-nav-link text-on-surface-variant dark:text-slate-300 hover:text-prestige-gold dark:hover:text-prestige-gold transition-colors duration-200"
            >
              Makaleler
            </Link>
            <Link
              href="/iletisim"
              className="font-nav-link text-nav-link text-on-surface-variant dark:text-slate-300 hover:text-prestige-gold dark:hover:text-prestige-gold transition-colors duration-200"
            >
              İletişim
            </Link>
            <Link
              href="/kaynaklar"
              className="font-nav-link text-nav-link text-on-surface-variant dark:text-slate-300 hover:text-prestige-gold dark:hover:text-prestige-gold transition-colors duration-200"
            >
              Kaynaklar
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Link
              href="/iletisim"
              className="hidden md:inline-flex px-6 py-2.5 bg-legal-navy dark:bg-prestige-gold text-paper-white dark:text-legal-navy font-nav-link font-bold text-nav-link hover:bg-opacity-90 transition-all rounded"
            >
              Randevu Al
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-legal-navy dark:text-slate-200 flex items-center p-2 rounded-lg hover:bg-stone-gray/10 dark:hover:bg-slate-800 transition-colors"
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
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out border-l border-stone-gray dark:border-slate-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-gray dark:border-slate-800">
          <span className="font-headline-sm text-headline-sm text-legal-navy dark:text-slate-100 font-bold">Menü</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-legal-navy dark:text-slate-200 flex items-center p-2 rounded-lg hover:bg-stone-gray/10 dark:hover:bg-slate-800 transition-colors"
            aria-label="Menüyü Kapat"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col p-6 space-y-6">
          <Link
            href="/hakkimda"
            onClick={() => setIsOpen(false)}
            className="font-nav-link text-lg text-legal-navy dark:text-slate-200 hover:text-prestige-gold dark:hover:text-prestige-gold transition-colors"
          >
            Hakkımda
          </Link>
          <Link
            href="/makaleler"
            onClick={() => setIsOpen(false)}
            className="font-nav-link text-lg text-legal-navy dark:text-slate-200 hover:text-prestige-gold dark:hover:text-prestige-gold transition-colors"
          >
            Makaleler
          </Link>
          <Link
            href="/iletisim"
            onClick={() => setIsOpen(false)}
            className="font-nav-link text-lg text-legal-navy dark:text-slate-200 hover:text-prestige-gold dark:hover:text-prestige-gold transition-colors"
          >
            İletişim
          </Link>
          <Link
            href="/kaynaklar"
            onClick={() => setIsOpen(false)}
            className="font-nav-link text-lg text-legal-navy dark:text-slate-200 hover:text-prestige-gold dark:hover:text-prestige-gold transition-colors"
          >
            Kaynaklar
          </Link>

          <div className="pt-4 border-t border-stone-gray/40 dark:border-slate-700/50 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-nav-link text-lg text-legal-navy dark:text-slate-200 font-medium">Tema</span>
              <ThemeToggle />
            </div>
            <Link
              href="/iletisim"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-legal-navy dark:bg-prestige-gold text-paper-white dark:text-legal-navy font-nav-link font-bold text-center rounded-lg hover:bg-opacity-90 transition-all"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
