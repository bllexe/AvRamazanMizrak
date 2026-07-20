import React from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/supabase';

export const revalidate = 0; // Dynamic rendering

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const {
    publishedCount,
    newMessagesCount,
    totalViews,
    recentMessages,
    recentArticles,
    chartData,
  } = stats;

  // Calculate SVG Chart points
  const maxVal = Math.max(...chartData.map((d: any) => d.views), 10);
  const chartWidth = 800;
  const chartHeight = 200;
  const points = chartData.map((d: any, index: number) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - (d.views / maxVal) * (chartHeight - 40);
    return { x, y };
  });

  const pathD = points.reduce(
    (acc: string, p: any, i: number) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );
  const areaD = points.length > 0 ? `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z` : '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 pb-6 border-b border-stone-gray/40">
        <div>
          <h2 className="font-headline-md text-2xl text-legal-navy font-bold">Hoş Geldiniz</h2>
          <p className="text-sm text-on-surface-variant">İşte bugün neler olduğu hakkında bir özet.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles/create"
            className="bg-legal-navy text-white px-6 py-2.5 rounded-lg hover:bg-opacity-95 transition-all flex items-center text-sm font-semibold shadow-md shadow-legal-navy/10 hover:scale-[1.01]"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
            Yeni Makale
          </Link>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 border border-stone-gray/60 rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#F8F7F4] flex items-center justify-center rounded-lg text-legal-navy">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-green-600 text-[12px] font-bold flex items-center bg-green-50 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> Canlı
            </span>
          </div>
          <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            Toplam Okunma
          </h3>
          <p className="font-headline-md text-3xl text-legal-navy font-bold mt-1">{totalViews}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 border border-stone-gray/60 rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#F8F7F4] flex items-center justify-center rounded-lg text-prestige-gold">
              <span className="material-symbols-outlined">mail</span>
            </div>
            {newMessagesCount > 0 ? (
              <span className="text-prestige-gold text-[12px] font-bold bg-amber-50 px-2 py-0.5 rounded">
                Yeni Mesaj
              </span>
            ) : (
              <span className="text-on-surface-variant text-[12px] font-medium">Temiz</span>
            )}
          </div>
          <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            Bekleyen Mesajlar
          </h3>
          <p className="font-headline-md text-3xl text-legal-navy font-bold mt-1">
            {newMessagesCount}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 border border-stone-gray/60 rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#F8F7F4] flex items-center justify-center rounded-lg text-legal-navy">
              <span className="material-symbols-outlined">article</span>
            </div>
            <span className="text-on-surface-variant text-[12px] font-semibold bg-stone-100 px-2 py-0.5 rounded">
              Toplam
            </span>
          </div>
          <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            Yayındaki Makaleler
          </h3>
          <p className="font-headline-md text-3xl text-legal-navy font-bold mt-1">
            {publishedCount}
          </p>
        </div>
      </section>

      {/* Middle Section: Chart & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-stone-gray/60 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="font-headline-sm text-lg text-legal-navy font-bold">Ziyaretçi Grafiği</h3>
            <p className="text-xs text-on-surface-variant">
              Son 7 günlük trafik analizi (Sayfa Görüntüleme)
            </p>
          </div>

          {/* SVG Chart */}
          <div className="relative w-full flex-1 min-h-[220px]">
            <svg
              className="w-full h-full min-h-[200px]"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line stroke="#F1F0EC" strokeWidth="1" x1="0" x2={chartWidth} y1="0" y2="0" />
              <line stroke="#F1F0EC" strokeWidth="1" x1="0" x2={chartWidth} y1={chartHeight / 4} y2={chartHeight / 4} />
              <line stroke="#F1F0EC" strokeWidth="1" x1="0" x2={chartWidth} y1={chartHeight / 2} y2={chartHeight / 2} />
              <line stroke="#F1F0EC" strokeWidth="1" x1="0" x2={chartWidth} y1={(3 * chartHeight) / 4} y2={(3 * chartHeight) / 4} />
              <line stroke="#F1F0EC" strokeWidth="1" x1="0" x2={chartWidth} y1={chartHeight} y2={chartHeight} />

              {/* Draw path if views exist */}
              {points.length > 0 && (
                <>
                  <path d={areaD} fill="rgba(197, 160, 89, 0.04)" />
                  <path d={pathD} fill="none" stroke="#C5A059" strokeWidth="2.5" />
                  {points.map((p: any, idx: number) => (
                    <circle key={idx} cx={p.x} cy={p.y} fill="#C5A059" r="4.5" />
                  ))}
                </>
              )}
            </svg>
          </div>

          <div className="flex justify-between mt-4 text-[11px] text-on-surface-variant font-semibold border-t border-stone-gray/20 pt-4">
            {chartData.map((d: any, idx: number) => (
              <span key={idx}>
                {d.day} ({d.views})
              </span>
            ))}
          </div>
        </div>

        {/* Recent Messages Summary (1/3 width) */}
        <div className="bg-white border border-stone-gray/60 rounded-xl p-6 shadow-sm flex flex-col max-h-[360px]">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h3 className="font-headline-sm text-lg text-legal-navy font-bold">Son Mesajlar</h3>
            <Link
              className="text-prestige-gold text-sm font-semibold hover:underline"
              href="/admin/messages"
            >
              Tümü
            </Link>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-1 scrollbar-none">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg: any) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 border-b border-stone-gray/40 pb-3 last:border-0 last:pb-0"
                >
                  <div className="w-9 h-9 bg-[#F8F7F4] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-legal-navy text-xs uppercase border border-stone-gray/40">
                    {(msg.name || 'AA').substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-xs font-bold text-legal-navy truncate">{msg.name}</p>
                      <span className="text-[9px] text-on-surface-variant shrink-0">
                        {new Date(msg.submitted_at).toLocaleDateString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[10px] text-prestige-gold font-bold truncate mt-0.5">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-on-surface-variant text-sm">
                Mesaj bulunmamaktadır.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Table Section */}
      <section className="bg-white border border-stone-gray/60 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-gray/40 flex justify-between items-center bg-[#FAF9F6]">
          <h3 className="font-headline-sm text-lg text-legal-navy font-bold">Son Eklenen Makaleler</h3>
          <Link
            href="/admin/articles"
            className="border border-stone-gray/80 px-4 py-2 rounded-lg text-xs font-bold text-legal-navy hover:bg-stone-50 transition-colors"
          >
            Tümünü Yönet
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-on-surface-variant text-[10px] uppercase font-bold tracking-wider border-b border-stone-gray/40">
                <th className="px-6 py-4">Başlık</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Oluşturma Tarihi</th>
                <th className="px-6 py-4">Okunma</th>
                <th className="px-6 py-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-gray/30 text-sm">
              {recentArticles.length > 0 ? (
                recentArticles.map((art: any) => (
                  <tr key={art.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-legal-navy">{art.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#F8F7F4] border border-stone-gray/60 px-2 py-1 rounded text-[10px] font-bold text-legal-navy uppercase">
                        {art.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">
                      {new Date(art.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">
                      {art.view_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      {art.status === 'published' ? (
                        <span className="flex items-center text-[10px] text-green-700 font-bold uppercase tracking-wider bg-green-50 border border-green-200 px-2.5 py-1 rounded w-fit">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />{' '}
                          Yayında
                        </span>
                      ) : (
                        <span className="flex items-center text-[10px] text-prestige-gold font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 px-2.5 py-1 rounded w-fit">
                          <span className="w-1.5 h-1.5 bg-prestige-gold rounded-full mr-1.5" />{' '}
                          Taslak
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-on-surface-variant text-sm">
                    Makale bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
