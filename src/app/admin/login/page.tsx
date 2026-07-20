'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@avdanisman.com');
  const [password, setPassword] = useState('adminpassword');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailFocus = () => {
    if (email === 'admin@avdanisman.com') {
      setEmail('');
    }
  };

  const handlePasswordFocus = () => {
    if (password === 'adminpassword') {
      setPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Redirect to admin dashboard
        router.push('/admin');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Giriş yapılamadı.');
      }
    } catch (err) {
      console.error('Login submit error', err);
      setError('Sistemsel bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased flex items-center justify-center min-h-screen p-gutter bg-subtle-pattern">
      <div className="w-full max-w-md bg-white border border-stone-gray rounded-xl p-8 md:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="font-label-caps text-label-caps text-prestige-gold tracking-widest uppercase font-bold text-xs">
            Yönetim Paneli
          </span>
          <h1 className="font-headline-sm text-headline-sm text-legal-navy font-bold">
            Avukat Girişi
          </h1>
          <p className="text-sm text-on-surface-variant">Sitenizi yönetmek için bilgilerinizi giriniz.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded text-sm font-semibold flex items-center gap-2 border border-red-200">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold" htmlFor="email">
              E-POSTA ADRESİ
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none text-sm"
              id="email"
              type="email"
              placeholder="admin@avdanisman.com"
              required
              value={email}
              onFocus={handleEmailFocus}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold" htmlFor="password">
              ŞİFRE
            </label>
            <div className="relative">
              <input
                className="w-full pl-4 pr-12 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none text-sm"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onFocus={handlePasswordFocus}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-legal-navy transition-colors flex items-center"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            className="w-full py-3.5 bg-legal-navy text-white font-bold rounded-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-lg text-sm disabled:opacity-75"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            <span className="material-symbols-outlined text-prestige-gold group-hover:translate-x-1 transition-transform text-[20px]">
              login
            </span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-on-surface-variant hover:text-prestige-gold transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Siteye Geri Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
