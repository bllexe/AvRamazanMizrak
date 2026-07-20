'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface ArticleFormProps {
  categories: Category[];
  initialData?: any;
  mode: 'create' | 'edit';
}

export default function AdminArticleForm({ categories, initialData, mode }: ArticleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    status: initialData?.status || 'draft',
    category_ids: initialData?.category_ids || (initialData?.category_id ? [initialData.category_id] : []),
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (catId: string, checked: boolean) => {
    setFormData((prev) => {
      const updatedIds = checked
        ? [...prev.category_ids, catId]
        : prev.category_ids.filter((id: string) => id !== catId);
      return { ...prev, category_ids: updatedIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.category_ids.length === 0) {
      alert('Lütfen en az bir kategori seçiniz.');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = mode === 'create' ? '/api/admin/articles' : `/api/admin/articles/${initialData.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Makale kaydedilemedi.');
      }
    } catch (err) {
      console.error('Submit article error', err);
      alert('Sistemsel bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl bg-white border border-stone-gray/60 rounded-xl p-8 shadow-sm space-y-6">
      <div className="space-y-2 flex flex-col">
        <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold" htmlFor="title">
          MAKALE BAŞLIĞI
        </label>
        <input
          className="w-full px-4 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none text-sm font-medium"
          id="title"
          type="text"
          placeholder="Örn: Yeni Veraset Kanunları"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold">
          KATEGORİLER (EN AZ BİR TANE SEÇİNİZ)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg p-4">
          {categories.map((cat) => {
            const isChecked = formData.category_ids.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center space-x-3 text-sm text-legal-navy cursor-pointer select-none font-bold"
              >
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={isChecked}
                  onChange={(e) => handleCheckboxChange(cat.id, e.target.checked)}
                  className="rounded border-stone-gray text-prestige-gold focus:ring-prestige-gold w-4 h-4 cursor-pointer"
                />
                <span className="font-bold">{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold" htmlFor="status">
            DURUM
          </label>
          <select
            className="w-full px-4 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-bold"
            id="status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 flex flex-col">
        <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold" htmlFor="summary">
          ÖZET (MAX 150 KARAKTER)
        </label>
        <textarea
          className="w-full px-4 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none resize-none text-sm font-medium"
          id="summary"
          placeholder="Makalenin kısa bir özeti..."
          required
          rows={3}
          maxLength={150}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold" htmlFor="content">
          MAKALE İÇERİĞİ (HTML VEYA TEXT FORMATINDA)
        </label>
        <textarea
          className="w-full px-4 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none resize-y text-sm font-medium"
          id="content"
          placeholder="Makalenin detaylı içeriğini yazın..."
          required
          rows={12}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold" htmlFor="meta_description">
            META AÇIKLAMASI (SEO)
          </label>
          <input
            className="w-full px-4 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none text-sm font-medium"
            id="meta_description"
            type="text"
            placeholder="Arama motoru gösterim açıklaması"
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block font-bold" htmlFor="meta_keywords">
            META ANAHTAR KELİMELERİ (SEO)
          </label>
          <input
            className="w-full px-4 py-3 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold hover:border-[#C4C1BA] transition-all outline-none text-sm font-medium"
            id="meta_keywords"
            type="text"
            placeholder="Örn: miras, vasiyet, avukat"
            value={formData.meta_keywords}
            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button
          className="flex-1 py-4 bg-legal-navy text-white font-bold rounded-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-lg text-sm disabled:opacity-75"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Makaleyi Kaydet'}
          <span className="material-symbols-outlined text-prestige-gold group-hover:translate-x-1 transition-transform text-[20px]">
            save
          </span>
        </button>
        <Link
          href="/admin/articles"
          className="px-6 py-4 bg-[#E2E8F0] hover:bg-opacity-90 text-legal-navy text-sm font-bold rounded-lg transition-colors flex items-center"
        >
          İptal Et
        </Link>
      </div>
    </form>
  );
}
