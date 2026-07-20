'use client';

import React, { useState } from 'react';

interface AdminSettingsFormProps {
  initialSettings: { [key: string]: string };
  initialKvkk: string;
  initialPrivacy: string;
  initialTerms: string;
}

export default function AdminSettingsForm({
  initialSettings,
  initialKvkk,
  initialPrivacy,
  initialTerms,
}: AdminSettingsFormProps) {
  const [formData, setFormData] = useState({
    site_title: initialSettings.site_title || '',
    site_description: initialSettings.site_description || '',
    office_address: initialSettings.office_address || '',
    kvkk: initialKvkk || '',
    privacy: initialPrivacy || '',
    terms: initialTerms || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Ayarlar kaydedilemedi.');
      }
    } catch (err) {
      console.error('Update settings error', err);
      alert('Sistemsel bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl bg-white dark:bg-slate-800 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl p-8 shadow-sm space-y-6">
      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 border border-green-200">
          <span className="material-symbols-outlined">check_circle</span>
          Ayarlar başarıyla güncellendi.
        </div>
      )}

      <div className="space-y-2 flex flex-col">
        <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="site_title">
          WEB SİTE BAŞLIĞI
        </label>
        <input
          className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm"
          id="site_title"
          type="text"
          required
          value={formData.site_title}
          onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="site_description">
          SİTE AÇIKLAMASI (SEO VE META AÇIKLAMA GÖSTERİMİ)
        </label>
        <textarea
          className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-none text-sm"
          id="site_description"
          required
          rows={4}
          value={formData.site_description}
          onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="office_address">
          HUKUK BÜROSU ADRESİ
        </label>
        <textarea
          className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-none text-sm"
          id="office_address"
          required
          rows={3}
          value={formData.office_address}
          onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
        />
      </div>

      {/* Hukuki Belgeler (KVKK, Gizlilik Politikası, Kullanım Koşulları) */}
      <div className="space-y-6 border-t border-stone-gray/40 dark:border-slate-700/40 pt-6">
        <h3 className="font-headline-sm text-lg text-legal-navy dark:text-slate-100 font-bold">Hukuki Belgeler</h3>

        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="kvkk">
            KVKK METNİ
          </label>
          <textarea
            className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-y text-sm font-sans"
            id="kvkk"
            rows={8}
            placeholder="Kişisel Verilerin Korunması Kanunu aydınlatma metni..."
            value={formData.kvkk}
            onChange={(e) => setFormData({ ...formData, kvkk: e.target.value })}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="privacy">
            GİZLİLİK POLİTİKASI
          </label>
          <textarea
            className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-y text-sm font-sans"
            id="privacy"
            rows={8}
            placeholder="Gizlilik politikası metni..."
            value={formData.privacy}
            onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="terms">
            KULLANIM KOŞULLARI
          </label>
          <textarea
            className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-y text-sm font-sans"
            id="terms"
            rows={8}
            placeholder="Kullanım koşulları metni..."
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-6">
        <button
          className="w-full py-4 bg-legal-navy text-white font-bold rounded-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-lg text-sm uppercase tracking-wider disabled:opacity-75"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Ayarları Güncelle'}
          <span className="material-symbols-outlined text-prestige-gold group-hover:translate-x-1 transition-transform text-[20px]">
            save
          </span>
        </button>
      </div>
    </form>
  );
}
