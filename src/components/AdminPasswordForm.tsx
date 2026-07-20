'use client';

import React, { useState } from 'react';

export default function AdminPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (password.length < 6) {
      setStatus({ type: 'error', message: 'Şifre en az 6 karakter olmalıdır.' });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Şifreler eşleşmiyor.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...',
        });
        setPassword('');
        setConfirmPassword('');
        // Log out the user to clear the token cookies
        await fetch('/api/auth/logout', { method: 'POST' });
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Şifre değiştirilemedi.',
        });
      }
    } catch (err) {
      console.error('Password change error', err);
      setStatus({
        type: 'error',
        message: 'Sistemsel bir hata oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl bg-white border border-stone-gray/60 rounded-xl p-8 shadow-sm space-y-6"
    >
      <div className="border-b border-stone-gray/40 pb-3">
        <h3 className="font-headline-sm text-lg text-legal-navy font-bold">Şifre Değiştir</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Yönetici hesabınızın şifresini güncelleyin.
        </p>
      </div>

      {status.type && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 border ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          <span className="material-symbols-outlined">
            {status.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Password */}
        <div className="space-y-2 flex flex-col relative">
          <label
            className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold"
            htmlFor="new-password"
          >
            YENİ ŞİFRE
          </label>
          <div className="relative">
            <input
              className="w-full pl-4 pr-12 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none text-sm"
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="En az 6 karakter"
              value={password}
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

        {/* Confirm Password */}
        <div className="space-y-2 flex flex-col relative">
          <label
            className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold"
            htmlFor="confirm-password"
          >
            YENİ ŞİFRE (TEKRAR)
          </label>
          <div className="relative">
            <input
              className="w-full pl-4 pr-12 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none text-sm"
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Yeni şifreyi tekrar yazın"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-legal-navy transition-colors flex items-center"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showConfirmPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-gray/40">
        <button
          className="w-full py-3.5 bg-legal-navy text-white font-bold rounded-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-md text-xs uppercase tracking-wider disabled:opacity-75"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          <span className="material-symbols-outlined text-prestige-gold group-hover:translate-x-1 transition-transform text-[18px]">
            vpn_key
          </span>
        </button>
      </div>
    </form>
  );
}
