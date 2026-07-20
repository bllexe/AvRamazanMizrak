'use client';

import React, { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order_index: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    order_index: '0',
    description: '',
  });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string | null;
  }>({
    isOpen: false,
    categoryId: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories'); // Let's check: we can fetch from public API or admin API
      // Wait, is there a public API for categories? Or we can just call `/api/admin/categories`?
      // Wait, let's create a general GET `/api/categories` or fetch direct categories in route.
      // Actually, since this page is a Client Component, we can fetch all categories from the API.
      // Let's check: does next.js have a public category list? Yes, we can make `/api/admin/categories` support GET if we want, or call public fetch.
      // Let's create `/api/admin/categories` supporting GET, or fetch it. Let's look at `src/app/api/admin/categories/route.ts` we just created. It only had POST.
      // We can easily call supabase or fetch categories. To keep it simple, we can define a GET handler in `/api/admin/categories/route.ts` to return all categories!
      // Yes! That is extremely safe and keeps everything unified.
      const res = await fetch('/api/admin/categories-list');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // We can also define a small fetch within the page itself since we are using React, or fetch from `/api/admin/categories-list`
    // Let's first implement `/api/admin/categories-list` endpoint so we can get categories securely!
    // Or even simpler, let's write a getCategories call.
    fetchCategories();
  }, []);

  const handleEdit = (cat: Category) => {
    setFormMode('edit');
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      order_index: cat.order_index.toString(),
      description: cat.description || '',
    });
  };

  const handleCancel = () => {
    setFormMode('create');
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      order_index: '0',
      description: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url =
        formMode === 'create'
          ? '/api/admin/categories'
          : `/api/admin/categories/${editingId}`;
      const method = formMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCancel();
        await fetchCategories();
      } else {
        const data = await response.json();
        alert(data.error || 'İşlem başarısız.');
      }
    } catch (err) {
      console.error('Submit category error', err);
      alert('Sistemsel bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, categoryId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.categoryId) return;
    try {
      const response = await fetch(`/api/admin/categories/${deleteModal.categoryId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDeleteModal({ isOpen: false, categoryId: null });
        await fetchCategories();
      } else {
        alert('Kategori silinemedi.');
      }
    } catch (err) {
      console.error('Delete category error', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-stone-gray/40 shrink-0">
        <h2 className="font-headline-md text-2xl text-legal-navy font-bold">Makale Kategorileri</h2>
        <p className="text-sm text-on-surface-variant">
          Makalelerinizi gruplandırmak için kategorileri yönetin.
        </p>
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Categories List (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-stone-gray/60 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-on-surface-variant text-[10px] uppercase font-bold tracking-wider border-b border-stone-gray/40">
                  <th className="px-6 py-4">Sıra</th>
                  <th className="px-6 py-4">Kategori Adı</th>
                  <th className="px-6 py-4">Slug / URL</th>
                  <th className="px-6 py-4">Açıklama</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-gray/30 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-on-surface-variant">
                      Kategoriler yükleniyor...
                    </td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-legal-navy">
                        {cat.order_index}
                      </td>
                      <td className="px-6 py-4 font-bold text-legal-navy">{cat.name}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant font-mono">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant max-w-xs truncate">
                        {cat.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="text-legal-navy hover:text-prestige-gold transition-colors flex items-center"
                            title="Düzenle"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cat.id)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                            title="Sil"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-on-surface-variant">
                      Kategori bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Form Card (1/3 width) */}
        <div className="bg-white border border-stone-gray/60 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-headline-sm text-lg text-legal-navy font-bold">
              {formMode === 'create' ? 'Yeni Kategori Ekle' : 'Kategoriyi Düzenle'}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Gerekli alanları doldurarak kaydediniz.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant tracking-wider block font-bold" htmlFor="name">
                KATEGORİ ADI
              </label>
              <input
                className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm"
                id="name"
                type="text"
                placeholder="Örn: Ceza Hukuku"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant tracking-wider block font-bold" htmlFor="slug">
                SLUG / URL (OPSİYONEL)
              </label>
              <input
                className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm"
                id="slug"
                type="text"
                placeholder="Orn: ceza-hukuku"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant tracking-wider block font-bold" htmlFor="order_index">
                SIRA NO
              </label>
              <input
                className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm"
                id="order_index"
                type="number"
                required
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
              />
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant tracking-wider block font-bold" htmlFor="description">
                AÇIKLAMA (OPSİYONEL)
              </label>
              <textarea
                className="w-full px-3 py-2 bg-[#FCFBFA] border border-[#DEDCD7] rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-none text-sm"
                id="description"
                rows={3}
                placeholder="Kategori açıklaması..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                className="w-full py-2.5 bg-legal-navy text-white font-bold rounded-lg hover:bg-opacity-95 transition-all text-xs disabled:opacity-75"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              {formMode === 'edit' && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-2 bg-[#E2E8F0] text-legal-navy font-bold rounded-lg hover:bg-opacity-90 transition-all text-xs"
                >
                  İptal Et
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A2B3C] bg-opacity-40 backdrop-blur-sm"
            onClick={() => setDeleteModal({ isOpen: false, categoryId: null })}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-xl border border-stone-gray max-w-sm w-full mx-4 overflow-hidden z-10">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <div>
                  <h4 className="font-bold text-legal-navy text-sm">Kategoriyi Sil</h4>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Bu kategoriyi silmek istediğinize emin misiniz? Kategorideki makaleler
                    kategorisiz kalacaktır. Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, categoryId: null })}
                  className="px-4 py-2 bg-[#E2E8F0] hover:bg-opacity-90 text-legal-navy font-semibold text-xs rounded transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-opacity-95 text-white font-semibold text-xs rounded transition-colors"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
