'use client';

import React, { useState, useEffect } from 'react';

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  file_url?: string;
  file_size?: number;
  content?: string;
  display_order: number;
  download_count: number;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'guide',
    display_order: '0',
    description: '',
    content: '',
    existing_file_url: '',
    existing_file_size: '0',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    resourceId: string | null;
  }>({
    isOpen: false,
    resourceId: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/admin/resources-list');
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources || []);
      }
    } catch (err) {
      console.error('Failed to load resources', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleEdit = (res: ResourceItem) => {
    setFormMode('edit');
    setEditingId(res.id);
    setFormData({
      title: res.title,
      category: res.category,
      display_order: res.display_order.toString(),
      description: res.description || '',
      content: res.content || '',
      existing_file_url: res.file_url || '',
      existing_file_size: (res.file_size || 0).toString(),
    });
    setSelectedFile(null);
  };

  const handleCancel = () => {
    setFormMode('create');
    setEditingId(null);
    setFormData({
      title: '',
      category: 'guide',
      display_order: '0',
      description: '',
      content: '',
      existing_file_url: '',
      existing_file_size: '0',
    });
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('display_order', formData.display_order);
      submitData.append('description', formData.description);
      submitData.append('content', formData.content);
      submitData.append('existing_file_url', formData.existing_file_url);
      submitData.append('existing_file_size', formData.existing_file_size);

      if (selectedFile) {
        submitData.append('file', selectedFile);
      }

      const url =
        formMode === 'create'
          ? '/api/admin/resources'
          : `/api/admin/resources/${editingId}`;
      const method = formMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (response.ok) {
        handleCancel();
        await fetchResources();
      } else {
        const data = await response.json();
        alert(data.error || 'İşlem başarısız.');
      }
    } catch (err) {
      console.error('Submit resource error', err);
      alert('Sistemsel bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, resourceId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.resourceId) return;
    try {
      const response = await fetch(`/api/admin/resources/${deleteModal.resourceId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDeleteModal({ isOpen: false, resourceId: null });
        await fetchResources();
      } else {
        alert('Kaynak silinemedi.');
      }
    } catch (err) {
      console.error('Delete resource error', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-stone-gray/40 dark:border-slate-700/40 shrink-0">
        <h2 className="font-headline-md text-2xl text-legal-navy dark:text-slate-100 font-bold">Kaynak & Doküman Yönetimi</h2>
        <p className="text-sm text-on-surface-variant dark:text-slate-400">
          Sitenizdeki &quot;Kaynaklar&quot; sayfasında listelenen dosya ve şablonları yönetin.
        </p>
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Resources List (2/3 width) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 dark:bg-slate-900/50 text-on-surface-variant dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-stone-gray/40 dark:border-slate-700/40">
                  <th className="px-6 py-4">Sıra</th>
                  <th className="px-6 py-4">Başlık</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Tür</th>
                  <th className="px-6 py-4">İndirilme</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-gray/30 dark:divide-slate-700/50 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-on-surface-variant dark:text-slate-400">
                      Kaynaklar yükleniyor...
                    </td>
                  </tr>
                ) : resources.length > 0 ? (
                  resources.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-50 dark:hover:bg-slate-700/50 dark:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-legal-navy dark:text-slate-100">
                        {res.display_order}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-legal-navy dark:text-slate-100">{res.title}</div>
                        {res.description && (
                          <div className="text-xs text-on-surface-variant dark:text-slate-400 truncate max-w-xs mt-0.5 font-medium">
                            {res.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-stone-100 dark:bg-slate-700 border border-stone-200 rounded-full text-legal-navy dark:text-slate-100">
                          {res.category === 'guide'
                            ? 'Kılavuz'
                            : res.category === 'template'
                              ? 'Şablon'
                              : 'Doküman'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {res.file_url ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">download</span>{' '}
                            Dosya
                          </span>
                        ) : res.content ? (
                          <span className="text-blue-600 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">
                              content_copy
                            </span>{' '}
                            Kopyalanabilir Metin
                          </span>
                        ) : (
                          <span className="text-stone-400 font-bold">Boş</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-legal-navy dark:text-slate-100">
                        {res.download_count}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(res)}
                            className="text-legal-navy dark:text-slate-100 hover:text-prestige-gold transition-colors flex items-center"
                            title="Düzenle"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(res.id)}
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
                    <td colSpan={6} className="text-center py-12 text-on-surface-variant dark:text-slate-400 font-medium">
                      Kaynak bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Form Card (1/3 width) */}
        <div className="bg-white dark:bg-slate-800 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-headline-sm text-lg text-legal-navy dark:text-slate-100 font-bold">
              {formMode === 'create' ? 'Yeni Kaynak Ekle' : 'Kaynağı Düzenle'}
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
              İndirilebilir bir dosya yükleyin veya kopyalanabilir şablon metni girin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="title">
                KAYNAK BAŞLIĞI
              </label>
              <input
                className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm"
                id="title"
                type="text"
                placeholder="Örn: KVKK Uyum Kılavuzu"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 flex flex-col">
                <label className="font-label-caps text-[10px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="category">
                  KATEGORİ
                </label>
                <select
                  className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-semibold"
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="guide">Kılavuz</option>
                  <option value="template">Şablon</option>
                  <option value="document">Doküman</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="font-label-caps text-[10px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="display_order">
                  SIRA NO
                </label>
                <input
                  className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm"
                  id="display_order"
                  type="number"
                  required
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-[10px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="file-upload">
                  DOSYA YÜKLE (OPSİYONEL)
                </label>
                <div className="group relative flex items-center">
                  <span className="material-symbols-outlined text-[15px] text-prestige-gold cursor-help hover:text-opacity-80 transition-colors">
                    info
                  </span>
                  <div className="absolute right-0 bottom-full mb-2 w-48 p-2.5 bg-legal-navy text-white text-[10px] rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-10 leading-normal border border-stone-gray/20 dark:border-slate-700/20 font-medium">
                    <strong className="text-prestige-gold">Dosya Yükleme Limitleri:</strong>
                    <br />
                    • Tek dosya: maks. 10 MB
                    <br />
                    • Dosya adeti: maks. 10 adet
                  </div>
                </div>
              </div>
              <input
                className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg outline-none text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-stone-100 dark:bg-slate-700 file:text-legal-navy dark:text-slate-100 hover:file:bg-opacity-80"
                id="file-upload"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              {/* <p className="text-[9px] text-on-surface-variant dark:text-slate-400 font-medium">
                Seçtiğiniz dosya otomatik olarak Supabase Storage&apos;a yüklenir.
              </p> */}
              {formMode === 'edit' && formData.existing_file_url && (
                <div className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 font-bold">
                  Mevcut Dosya:{' '}
                  <a
                    href={formData.existing_file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-prestige-gold hover:underline font-bold"
                  >
                    Dosyayı Gör
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="content">
                KOPYALANABİLİR ŞABLON METNİ (OPSİYONEL)
              </label>
              <textarea
                className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-y text-xs font-mono"
                id="content"
                rows={5}
                placeholder="Örn: Dilekçe şablonu içeriği..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <p className="text-[9px] text-on-surface-variant dark:text-slate-400 font-medium">
                Kullanıcılar sitenizde bu metni tek tıkla kopyalayabilir.
              </p>
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="description">
                KISA AÇIKLAMA (OPSİYONEL)
              </label>
              <textarea
                className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-none text-sm"
                id="description"
                rows={2}
                placeholder="Kaynak hakkında kısa özet..."
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
                  className="w-full py-2 bg-[#E2E8F0] text-legal-navy dark:text-slate-100 font-bold rounded-lg hover:bg-opacity-90 transition-all text-xs"
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
            onClick={() => setDeleteModal({ isOpen: false, resourceId: null })}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-stone-gray dark:border-slate-700 max-w-sm w-full mx-4 overflow-hidden z-10">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <div>
                  <h4 className="font-bold text-legal-navy dark:text-slate-100 text-sm">Kaynağı Sil</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1.5 leading-relaxed">
                    Bu kaynağı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, resourceId: null })}
                  className="px-4 py-2 bg-[#E2E8F0] hover:bg-opacity-90 text-legal-navy dark:text-slate-100 font-semibold text-xs rounded transition-colors"
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
