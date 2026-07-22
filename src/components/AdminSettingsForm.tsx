'use client';

import React, { useState } from 'react';
import { formatLegalContent } from '@/lib/formatLegalContent';

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

  const [activePreview, setActivePreview] = useState<{ [key: string]: boolean }>({
    kvkk: false,
    privacy: false,
    terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePreview = (field: 'kvkk' | 'privacy' | 'terms') => {
    setActivePreview((prev) => ({ ...prev, [field]: !prev[field] }));
  };

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
        <div className="bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 border border-green-200 dark:border-green-800">
          <span className="material-symbols-outlined">check_circle</span>
          Ayarlar başarıyla güncellendi.
        </div>
      )}

      <div className="space-y-2 flex flex-col">
        <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="site_title">
          WEB SİTE BAŞLIĞI
        </label>
        <input
          className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm text-slate-800 dark:text-slate-100"
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
          className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-none text-sm text-slate-800 dark:text-slate-100"
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
          className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-none text-sm text-slate-800 dark:text-slate-100"
          id="office_address"
          required
          rows={3}
          value={formData.office_address}
          onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
        />
      </div>

      {/* Hukuki Belgeler (KVKK, Gizlilik Politikası, Kullanım Koşulları) */}
      <div className="space-y-6 border-t border-stone-gray/40 dark:border-slate-700/40 pt-6">
        <div>
          <h3 className="font-headline-sm text-lg text-legal-navy dark:text-slate-100 font-bold mb-2">Hukuki Belgeler</h3>
          <div className="bg-amber-50 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-sm mb-1">
              <span className="material-symbols-outlined text-prestige-gold text-base">lightbulb</span>
              Metin Biçimlendirme Rehberi:
            </p>
            <p>• Paragraflar için araya boş bir satır bırakabilirsiniz.</p>
            <p>• Başlık eklemek için <strong>1. GİRİŞ</strong> veya <strong>### Başlık</strong> şeklinde yazabilirsiniz.</p>
            <p>• Liste yapmak için satır başlarına <strong>-</strong> veya <strong>1.</strong> koyabilirsiniz.</p>
            <p>• Vurgulu metin için <strong>**kalın metin**</strong> kullanabilirsiniz.</p>
          </div>
        </div>

        {/* KVKK Field */}
        <div className="space-y-2 flex flex-col">
          <div className="flex justify-between items-center">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="kvkk">
              KVKK METNİ
            </label>
            <button
              type="button"
              onClick={() => togglePreview('kvkk')}
              className="text-xs text-prestige-gold hover:underline flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-sm">
                {activePreview.kvkk ? 'edit' : 'visibility'}
              </span>
              {activePreview.kvkk ? 'Düzenlemeye Dön' : 'Canlı Önizleme'}
            </button>
          </div>

          {activePreview.kvkk ? (
            <div className="p-6 bg-white dark:bg-slate-900 border-2 border-prestige-gold/70 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-prestige-gold uppercase tracking-wider mb-4 pb-2 border-b border-stone-200 dark:border-slate-800">
                KVKK Sayfası Görünüm Önizlemesi
              </div>
              <div
                className="legal-content prose prose-stone dark:prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: formatLegalContent(formData.kvkk) }}
              />
            </div>
          ) : (
            <textarea
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-y text-sm font-sans text-slate-800 dark:text-slate-100"
              id="kvkk"
              rows={10}
              placeholder="Kişisel Verilerin Korunması Kanunu aydınlatma metni..."
              value={formData.kvkk}
              onChange={(e) => setFormData({ ...formData, kvkk: e.target.value })}
            />
          )}
        </div>

        {/* Privacy Policy Field */}
        <div className="space-y-2 flex flex-col">
          <div className="flex justify-between items-center">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="privacy">
              GİZLİLİK POLİTİKASI
            </label>
            <button
              type="button"
              onClick={() => togglePreview('privacy')}
              className="text-xs text-prestige-gold hover:underline flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-sm">
                {activePreview.privacy ? 'edit' : 'visibility'}
              </span>
              {activePreview.privacy ? 'Düzenlemeye Dön' : 'Canlı Önizleme'}
            </button>
          </div>

          {activePreview.privacy ? (
            <div className="p-6 bg-white dark:bg-slate-900 border-2 border-prestige-gold/70 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-prestige-gold uppercase tracking-wider mb-4 pb-2 border-b border-stone-200 dark:border-slate-800">
                Gizlilik Politikası Sayfası Görünüm Önizlemesi
              </div>
              <div
                className="legal-content prose prose-stone dark:prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: formatLegalContent(formData.privacy) }}
              />
            </div>
          ) : (
            <textarea
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-y text-sm font-sans text-slate-800 dark:text-slate-100"
              id="privacy"
              rows={10}
              placeholder="Gizlilik politikası metni..."
              value={formData.privacy}
              onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
            />
          )}
        </div>

        {/* Terms Field */}
        <div className="space-y-2 flex flex-col">
          <div className="flex justify-between items-center">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="terms">
              KULLANIM KOŞULLARI
            </label>
            <button
              type="button"
              onClick={() => togglePreview('terms')}
              className="text-xs text-prestige-gold hover:underline flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-sm">
                {activePreview.terms ? 'edit' : 'visibility'}
              </span>
              {activePreview.terms ? 'Düzenlemeye Dön' : 'Canlı Önizleme'}
            </button>
          </div>

          {activePreview.terms ? (
            <div className="p-6 bg-white dark:bg-slate-900 border-2 border-prestige-gold/70 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-prestige-gold uppercase tracking-wider mb-4 pb-2 border-b border-stone-200 dark:border-slate-800">
                Kullanım Koşulları Sayfası Görünüm Önizlemesi
              </div>
              <div
                className="legal-content prose prose-stone dark:prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: formatLegalContent(formData.terms) }}
              />
            </div>
          ) : (
            <textarea
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-y text-sm font-sans text-slate-800 dark:text-slate-100"
              id="terms"
              rows={10}
              placeholder="Kullanım koşulları metni..."
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            />
          )}
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
