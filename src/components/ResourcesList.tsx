'use client';

import React, { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  file_url?: string;
  file_size?: number;
  download_count: number;
  category: string;
  content?: string;
}

interface ResourcesListProps {
  initialResources: Resource[];
}

export default function ResourcesList({ initialResources }: ResourcesListProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [modalResource, setModalResource] = useState<Resource | null>(null);
  const [copyText, setCopyText] = useState('Kopyala');
  const [copyIcon, setCopyIcon] = useState('content_copy');

  const openModal = async (res: Resource) => {
    setModalResource(res);
    setCopyText('Kopyala');
    setCopyIcon('content_copy');

    // Trigger download count increment asynchronously
    try {
      const response = await fetch(`/api/resources/${res.id}/download`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update local state count
          setResources((prev) =>
            prev.map((r) =>
              r.id === res.id ? { ...r, download_count: result.download_count } : r
            )
          );
        }
      }
    } catch (err) {
      console.error('Failed to increment view counter', err);
    }
  };

  const closeModal = () => {
    setModalResource(null);
  };

  const copyToClipboard = () => {
    if (!modalResource?.content) return;

    navigator.clipboard
      .writeText(modalResource.content)
      .then(() => {
        setCopyText('Kopyalandı!');
        setCopyIcon('check');
        setTimeout(() => {
          setCopyText('Kopyala');
          setCopyIcon('content_copy');
        }, 2000);
      })
      .catch((err) => {
        console.error('Kopyalama hatası:', err);
        alert('Panoya kopyalanırken bir hata oluştu.');
      });
  };

  const handleDownloadClick = (id: string) => {
    // Increment local counter after user downloads
    setTimeout(() => {
      setResources((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, download_count: (r.download_count || 0) + 1 } : r
        )
      );
    }, 1000);
  };

  return (
    <div>
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-800 border border-stone-gray dark:border-slate-700/60 p-8 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 bg-[#F8F7F4] dark:bg-slate-900 border border-stone-gray dark:border-slate-700 rounded flex items-center justify-center text-prestige-gold">
                    <span className="material-symbols-outlined">description</span>
                  </span>
                  <span className="text-xs font-bold text-prestige-gold uppercase tracking-wider bg-[#F8F7F4] dark:bg-slate-900 px-2.5 py-1 rounded">
                    {res.category === 'guide'
                      ? 'Kılavuz'
                      : res.category === 'template'
                      ? 'Şablon'
                      : 'Doküman'}
                  </span>
                </div>
                <h3 className="font-headline-sm text-xl text-legal-navy dark:text-slate-100 mb-2 font-bold transition-colors">
                  {res.title}
                </h3>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-6 transition-colors">{res.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-stone-gray/60 dark:border-slate-700/60 pt-4 mt-6">
                <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                  {res.file_url ? (
                    <>
                      Boyut:{' '}
                      {res.file_size
                        ? (res.file_size / 1024).toFixed(1) + ' KB'
                        : 'Bilinmiyor'}{' '}
                      | İndirme: {res.download_count || 0}
                    </>
                  ) : (
                    <>Görünüm: {res.download_count || 0}</>
                  )}
                </span>
                {res.file_url ? (
                  <a
                    href={`/api/resources/${res.id}/download`}
                    onClick={() => handleDownloadClick(res.id)}
                    className="flex items-center gap-2 bg-legal-navy text-white px-5 py-2 rounded font-semibold text-xs hover:bg-opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span> İndir
                  </a>
                ) : res.content ? (
                  <button
                    type="button"
                    onClick={() => openModal(res)}
                    className="flex items-center gap-2 bg-prestige-gold text-white px-5 py-2.5 rounded font-semibold text-xs hover:bg-opacity-90 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>{' '}
                    İncele & Kopyala
                  </button>
                ) : (
                  <span className="text-xs text-stone-400 dark:text-slate-500">Detay yok</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 border border-stone-gray dark:border-slate-700/60 rounded-xl transition-colors">
          <span className="material-symbols-outlined text-5xl text-stone-gray dark:text-slate-600 mb-4">folder_off</span>
          <h3 className="font-headline-sm text-legal-navy dark:text-slate-100 text-xl font-bold">Doküman Bulunmamaktadır</h3>
          <p className="text-on-surface-variant dark:text-slate-400 mt-2">Henüz indirilebilir kaynak yüklenmemiştir.</p>
        </div>
      )}

      {/* Petition Template View Modal */}
      {modalResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A2B3C] bg-opacity-40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-stone-gray dark:border-slate-700 max-w-2xl w-full mx-4 overflow-hidden flex flex-col max-h-[85vh] z-10">
            {/* Header */}
            <div className="p-6 border-b border-stone-gray dark:border-slate-700 flex items-center justify-between shrink-0 bg-[#f3f4f5] dark:bg-slate-800/80">
              <div>
                <h3 className="font-headline-sm text-lg text-legal-navy dark:text-slate-100 font-bold">
                  {modalResource.title}
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
                  Aşağıdaki metni kopyalayarak düzenleyebilirsiniz.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-on-surface-variant dark:text-slate-400 hover:text-legal-navy dark:hover:text-slate-200 transition-colors flex items-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#FAF9F6] dark:bg-slate-900/50">
              <pre className="text-xs text-legal-navy dark:text-slate-300 font-mono leading-relaxed whitespace-pre-wrap select-text p-4 bg-white dark:bg-slate-800 border border-stone-gray dark:border-slate-700 rounded-lg">
                {modalResource.content}
              </pre>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-gray dark:border-slate-700 flex justify-end gap-3 shrink-0 bg-white dark:bg-slate-800">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 bg-[#E2E8F0] dark:bg-slate-700 hover:bg-opacity-90 dark:hover:bg-slate-600 text-legal-navy dark:text-slate-200 font-semibold text-xs rounded transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={copyToClipboard}
                className="px-5 py-2.5 bg-legal-navy hover:bg-opacity-95 text-white font-semibold text-xs rounded transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">{copyIcon}</span>
                <span>{copyText}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
