'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setShowToast(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          consent: false,
        });
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Contact form submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-8 md:p-12 border border-[#E5E4E1] dark:border-slate-700/70 rounded-xl shadow-sm transition-colors duration-300">
        <h2 className="font-headline-md text-headline-md text-legal-navy dark:text-slate-100 mb-8 font-bold transition-colors">
          İletişim Formu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2 flex flex-col">
              <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 font-bold text-xs transition-colors" htmlFor="name">
                AD SOYAD
              </label>
              <input
                className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/60 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold dark:focus:border-prestige-gold hover:border-[#C4C1BA] dark:hover:border-slate-600 text-legal-navy dark:text-slate-100 transition-all outline-none"
                id="name"
                placeholder="Adınız Soyadınız"
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {/* Email */}
            <div className="space-y-2 flex flex-col">
              <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 font-bold text-xs transition-colors" htmlFor="email">
                E-POSTA ADRESİ
              </label>
              <input
                className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/60 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold dark:focus:border-prestige-gold hover:border-[#C4C1BA] dark:hover:border-slate-600 text-legal-navy dark:text-slate-100 transition-all outline-none"
                id="email"
                placeholder="email@ornek.com"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2 flex flex-col">
              <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 font-bold text-xs transition-colors" htmlFor="phone">
                TELEFON (İSTEĞE BAĞLI)
              </label>
              <input
                className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/60 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold dark:focus:border-prestige-gold hover:border-[#C4C1BA] dark:hover:border-slate-600 text-legal-navy dark:text-slate-100 transition-all outline-none"
                id="phone"
                placeholder="+90 (555) 000 00 00"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            {/* Subject */}
            <div className="space-y-2 flex flex-col">
              <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 font-bold text-xs transition-colors" htmlFor="subject">
                KONU
              </label>
              <input
                className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/60 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold dark:focus:border-prestige-gold hover:border-[#C4C1BA] dark:hover:border-slate-600 text-legal-navy dark:text-slate-100 transition-all outline-none"
                id="subject"
                placeholder="Hukuki Danışmanlık vb."
                required
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 font-bold text-xs transition-colors" htmlFor="message">
              MESAJINIZ
            </label>
            <textarea
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/60 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold dark:focus:border-prestige-gold hover:border-[#C4C1BA] dark:hover:border-slate-600 text-legal-navy dark:text-slate-100 transition-all outline-none resize-none"
              id="message"
              placeholder="Hukuki konuyu kısaca özetleyiniz..."
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3">
            <input
              className="mt-1.5 w-4 h-4 border-[#DEDCD7] dark:border-slate-600 text-prestige-gold rounded focus:ring-prestige-gold bg-[#FCFBFA] dark:bg-slate-800"
              id="consent"
              required
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            />
            <label className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed transition-colors" htmlFor="consent">
              Kişisel verilerimin{' '}
              <Link className="text-prestige-gold underline font-semibold" href="/legal/kvkk">
                KVKK Aydınlatma Metni
              </Link>{' '}
              çerçevesinde işlenmesini ve iletişim kurulmasını kabul ediyorum.
            </label>
          </div>

          {/* Submit Button */}
          <button
            className="w-full py-4 bg-legal-navy dark:bg-prestige-gold text-white dark:text-legal-navy font-bold rounded-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
            <span className="material-symbols-outlined text-prestige-gold dark:text-legal-navy group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </form>
      </div>

      {/* Success Toast */}
      <div
        className={`fixed bottom-8 right-8 bg-white dark:bg-slate-800 border-l-4 border-prestige-gold p-6 shadow-2xl transition-all duration-500 z-[100] flex items-center gap-4 rounded-r-lg ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
          }`}
      >
        <span className="material-symbols-outlined text-prestige-gold text-3xl">check_circle</span>
        <div>
          <p className="font-bold text-legal-navy dark:text-slate-100">Mesajınız Alındı</p>
          <p className="text-sm text-on-surface-variant dark:text-slate-400">En kısa sürede size geri dönüş yapacağım.</p>
        </div>
      </div>
    </>
  );
}
