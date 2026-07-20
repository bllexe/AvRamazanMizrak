'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  status: string;
  view_count: number;
  published_at?: string;
  created_at: string;
  categories: Category[];
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    articleId: string | null;
  }>({
    isOpen: false,
    articleId: null,
  });

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles-list');
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error('Failed to load articles', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, articleId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.articleId) return;
    try {
      const response = await fetch(`/api/admin/articles/${deleteModal.articleId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDeleteModal({ isOpen: false, articleId: null });
        await fetchArticles();
      } else {
        alert('Makale silinemedi.');
      }
    } catch (err) {
      console.error('Delete article error', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-stone-gray/40 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-2xl text-legal-navy font-bold">Makaleleri Yönet</h2>
          <p className="text-sm text-on-surface-variant">
            Blog içeriklerinizi yayınlayın, güncelleyin veya silin.
          </p>
        </div>
        <div>
          <Link
            href="/admin/articles/create"
            className="bg-legal-navy text-white px-6 py-2.5 rounded-lg hover:bg-opacity-95 transition-all flex items-center text-sm font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
            Yeni Makale Ekle
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="bg-white border border-stone-gray/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-on-surface-variant text-[10px] uppercase font-bold tracking-wider border-b border-stone-gray/40">
                <th className="px-6 py-4">Başlık</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Yayın/Taslak Tarihi</th>
                <th className="px-6 py-4">Okunma</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-gray/30 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-on-surface-variant">
                    Makaleler yükleniyor...
                  </td>
                </tr>
              ) : articles.length > 0 ? (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 max-w-sm">
                      <div className="font-bold text-legal-navy text-sm truncate">{art.title}</div>
                      <div className="text-xs text-on-surface-variant truncate mt-0.5 font-medium">
                        {art.summary}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {art.categories && art.categories.length > 0 ? (
                          art.categories.map((c) => (
                            <span
                              key={c.id}
                              className="bg-stone-100 px-2 py-0.5 border border-stone-200 rounded text-[9px] font-bold text-legal-navy"
                            >
                              {c.name}
                            </span>
                          ))
                        ) : (
                          <span className="bg-stone-100 px-2 py-0.5 border border-stone-200 rounded text-[9px] font-bold text-legal-navy">
                            Genel
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">
                      {new Date(art.published_at || art.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant font-bold">
                      {art.view_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      {art.status === 'published' ? (
                        <span className="flex items-center text-[10px] text-green-700 font-bold">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>{' '}
                          Yayında
                        </span>
                      ) : (
                        <span className="flex items-center text-[10px] text-prestige-gold font-bold">
                          <span className="w-1.5 h-1.5 bg-prestige-gold rounded-full mr-1.5"></span>{' '}
                          Taslak
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="text-legal-navy hover:text-prestige-gold transition-colors flex items-center"
                          title="Düzenle"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(art.id)}
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
                  <td colSpan={6} className="text-center py-12 text-on-surface-variant font-medium">
                    Makale bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A2B3C] bg-opacity-40 backdrop-blur-sm"
            onClick={() => setDeleteModal({ isOpen: false, articleId: null })}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-xl border border-stone-gray max-w-sm w-full mx-4 overflow-hidden z-10">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <div>
                  <h4 className="font-bold text-legal-navy text-sm">Makaleyi Sil</h4>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Bu makaleyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, articleId: null })}
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
