'use client';

import React, { useState, useEffect } from 'react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  submitted_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal state
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

  // Delete Modal state
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages-list');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (msg: ContactSubmission) => {
    try {
      const response = await fetch(`/api/admin/messages/${msg.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'read' }),
      });

      if (response.ok) {
        // Update local state
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
        if (selectedMessage && selectedMessage.id === msg.id) {
          setSelectedMessage({ ...selectedMessage, status: 'read' });
        }
      }
    } catch (err) {
      console.error('Mark read status error', err);
    }
  };

  const handleRowClick = (msg: ContactSubmission) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') {
      handleMarkAsRead(msg);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Avoid row click details modal
    setDeleteModalId(id);
  };

  const confirmDelete = async () => {
    if (!deleteModalId) return;

    try {
      const response = await fetch(`/api/admin/messages/${deleteModalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteModalId(null);
        setSelectedMessage(null);
        await fetchMessages();
      } else {
        alert('Mesaj silinemedi.');
      }
    } catch (err) {
      console.error('Delete message error', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-stone-gray/40 dark:border-slate-700/40 shrink-0">
        <h2 className="font-headline-md text-2xl text-legal-navy dark:text-slate-100 font-bold">Gelen Mesajlar</h2>
        <p className="text-sm text-on-surface-variant dark:text-slate-400">
          Sitenizdeki iletişim formlarından gönderilen mesajları yönetin.
        </p>
      </header>

      {/* Content */}
      <section className="bg-white dark:bg-slate-800 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 dark:bg-slate-900/50 text-on-surface-variant dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-stone-gray/40 dark:border-slate-700/40">
                <th className="px-6 py-4">Gönderen</th>
                <th className="px-6 py-4">İletişim Bilgileri</th>
                <th className="px-6 py-4">Konu</th>
                <th className="px-6 py-4">Mesaj Detayı</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-gray/30 dark:divide-slate-700/50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant dark:text-slate-400">
                    Mesajlar yükleniyor...
                  </td>
                </tr>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isNew = msg.status === 'new';
                  return (
                    <tr
                      key={msg.id}
                      onClick={() => handleRowClick(msg)}
                      className={`cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-slate-700/50 dark:bg-slate-900/50/80 ${
                        isNew ? 'bg-[#FCFAF2]/60 font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-legal-navy dark:text-slate-100 font-bold">{msg.name}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-slate-400 space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px]">mail</span>{' '}
                          {msg.email}
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[14px]">call</span>{' '}
                            {msg.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-legal-navy dark:text-slate-100 font-bold">{msg.subject}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-slate-400 max-w-xs truncate font-medium">
                        {msg.message}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                        {new Date(msg.submitted_at).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {isNew ? (
                          <span className="bg-[#FCF6E5] text-[#8C6D15] px-2.5 py-0.5 border border-yellow-200 rounded-full text-[10px] font-bold">
                            Yeni
                          </span>
                        ) : (
                          <span className="bg-stone-100 dark:bg-slate-700 text-stone-600 px-2.5 py-0.5 border border-stone-200 rounded-full text-[10px] font-bold">
                            Okundu
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isNew && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(msg);
                              }}
                              className="bg-legal-navy text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-opacity-90 transition-all shadow-sm"
                            >
                              Okundu İşaretle
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteClick(e, msg.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1.5 rounded-lg"
                            title="Mesajı Sil"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant dark:text-slate-400">
                    Gelen mesaj bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A2B3C] bg-opacity-40 backdrop-blur-sm"
            onClick={() => setSelectedMessage(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-stone-gray dark:border-slate-700 max-w-lg w-full mx-4 overflow-hidden flex flex-col z-10">
            {/* Header */}
            <div className="p-6 border-b border-stone-gray/40 dark:border-slate-700/40 flex items-center justify-between bg-[#F8F7F4] dark:bg-slate-900/50">
              <div>
                <h3 className="font-headline-sm text-lg text-legal-navy dark:text-slate-100 font-bold">
                  Mesaj Detayı
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
                  Gönderen: {selectedMessage.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-on-surface-variant dark:text-slate-400 hover:text-legal-navy dark:text-slate-100 transition-colors flex items-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 bg-white dark:bg-slate-800 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-stone-gray/20 dark:border-slate-700/20 pb-4">
                <div>
                  <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold uppercase block">
                    E-Posta
                  </span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-prestige-gold hover:underline font-bold"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold uppercase block">
                      Telefon
                    </span>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-legal-navy dark:text-slate-100 hover:underline font-bold"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold uppercase block">
                  Tarih
                </span>
                <span className="font-semibold text-legal-navy dark:text-slate-100">
                  {new Date(selectedMessage.submitted_at).toLocaleString('tr-TR')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold uppercase block mb-1">
                  Konu
                </span>
                <span className="font-bold text-legal-navy dark:text-slate-100 text-base">
                  {selectedMessage.subject}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold uppercase block mb-1">
                  Mesaj
                </span>
                <p className="text-legal-navy dark:text-slate-100 whitespace-pre-wrap leading-relaxed bg-[#FAF9F6] dark:bg-slate-900/80 p-4 rounded-lg border border-stone-gray/40 dark:border-slate-700/40">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-gray/40 dark:border-slate-700/40 flex justify-end bg-white dark:bg-slate-800">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 bg-legal-navy text-white font-semibold text-xs rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A2B3C] bg-opacity-40 backdrop-blur-sm"
            onClick={() => setDeleteModalId(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-stone-gray dark:border-slate-700 max-w-sm w-full mx-4 overflow-hidden z-10">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <div>
                  <h4 className="font-bold text-legal-navy dark:text-slate-100 text-sm">Mesajı Sil</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1.5 leading-relaxed">
                    Bu iletişim mesajını silmek istediğinize emin misiniz? Bu işlem geri
                    alınamaz.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalId(null)}
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
