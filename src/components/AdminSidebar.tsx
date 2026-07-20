'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setAdminEmail(data.email);
        }
      })
      .catch((err) => console.error('Failed to fetch admin identity', err));
  }, []);

  const menuItems = [
    { name: 'Kontrol Paneli', path: '/admin', icon: 'dashboard' },
    { name: 'Makaleler', path: '/admin/articles', icon: 'article' },
    { name: 'Kategoriler', path: '/admin/categories', icon: 'category' },
    { name: 'Kaynaklar', path: '/admin/resources', icon: 'folder' },
    { name: 'Mesajlar', path: '/admin/messages', icon: 'mail' },
    { name: 'Profil Ayarları', path: '/admin/profile', icon: 'person' },
    { name: 'Site Ayarları', path: '/admin/settings', icon: 'settings' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <>
      {/* Mobile Header Toggle */}
      <header className="lg:hidden h-16 border-b border-stone-gray bg-white px-gutter flex items-center justify-between sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-prestige-gold">gavel</span>
          <span className="font-bold text-legal-navy text-sm uppercase tracking-wider">Av. Ramazan Mızrak</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 flex items-center justify-center border border-stone-gray rounded text-legal-navy"
        >
          <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
        </button>
      </header>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-legal-navy text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand area */}
          <div className="h-20 border-b border-white/10 px-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-prestige-gold text-3xl">gavel</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-prestige-gold">Yönetici Paneli</p>
              <p className="text-[10px] opacity-75">Av. Ramazan Mızrak</p>
              {adminEmail && (
                <p className="text-[9px] opacity-50 truncate max-w-[150px]" title={adminEmail}>
                  {adminEmail}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-prestige-gold text-legal-navy shadow-lg shadow-prestige-gold/10'
                      : 'hover:bg-white/5 text-white/80 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Siteyi Görüntüle
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-legal-navy/30 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  );
}
