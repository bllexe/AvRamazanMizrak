import React from 'react';
import Link from 'next/link';
import { getArticles, getCategories, getProfile } from '@/lib/supabase';
import BlogFilters from '@/components/BlogFilters';

export const revalidate = 0; // Dynamic rendering

interface ArticlesPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sortBy?: string;
    page?: string;
  };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const categories = await getCategories();
  const rawArticles = await getArticles();
  const author = await getProfile();

  const authorName = author?.full_name || 'Av. Ramazan Mızrak';

  const activeCategorySlug = searchParams.category || '';
  const searchWord = (searchParams.search || '').toLowerCase();
  const sortBy = searchParams.sortBy || 'newest';
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const pageSize = 9; // 9 articles per page for grid layout

  // Find active category
  const activeCategory = activeCategorySlug
    ? categories.find((c: any) => c.slug === activeCategorySlug)
    : null;

  // Filter published articles
  let filteredArticles = rawArticles.filter((art: any) => art.status === 'published');

  // Filter by category
  if (activeCategory) {
    filteredArticles = filteredArticles.filter(
      (art: any) =>
        art.category_id === activeCategory.id ||
        (Array.isArray(art.category_ids) && art.category_ids.includes(activeCategory.id))
    );
  }

  // Filter by search query
  if (searchWord) {
    filteredArticles = filteredArticles.filter(
      (art: any) =>
        (art.title || '').toLowerCase().includes(searchWord) ||
        (art.summary || '').toLowerCase().includes(searchWord) ||
        (art.content || '').toLowerCase().includes(searchWord)
    );
  }

  // Sort articles
  if (sortBy === 'oldest') {
    filteredArticles.sort(
      (a: any, b: any) =>
        new Date(a.published_at || a.created_at).getTime() -
        new Date(b.published_at || b.created_at).getTime()
    );
  } else if (sortBy === 'popular') {
    filteredArticles.sort((a: any, b: any) => (b.view_count || 0) - (a.view_count || 0));
  } else {
    // newest
    filteredArticles.sort(
      (a: any, b: any) =>
        new Date(b.published_at || b.created_at).getTime() -
        new Date(a.published_at || a.created_at).getTime()
    );
  }

  // Pagination calculations
  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalArticles);
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize);

  // Helper to generate categories string for an article
  const getArticleCategories = (art: any) => {
    const cats = categories.filter(
      (c: any) =>
        art.categories?.some((ac: any) => ac.id === c.id) ||
        art.category_ids?.includes(c.id) ||
        c.id === art.category_id
    );
    return cats.length > 0 ? cats.map((c: any) => c.name).join(' / ') : 'Genel';
  };

  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (activeCategorySlug) params.set('category', activeCategorySlug);
    if (searchWord) params.set('search', searchWord);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    params.set('page', pageNum.toString());
    return `/makaleler?${params.toString()}`;
  };

  // Generate page numbers range for pagination UI (e.g., 1, 2, 3 ... 10)
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-2); // ellipsis
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="pt-24 pb-20 bg-[#F8F7F4] dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* Page Header */}
      <section className="bg-white dark:bg-slate-800 border-b border-stone-gray/60 dark:border-slate-700/60 py-10 transition-colors duration-300">
        <div className="max-w-container-max mx-auto px-gutter">
          <nav className="flex items-center space-x-2 text-stone-gray dark:text-slate-500 font-label-caps text-xs mb-4">
            <Link className="hover:text-legal-navy dark:hover:text-slate-300 transition-colors" href="/">
              Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-prestige-gold font-bold">Makaleler</span>
          </nav>
          <div className="max-w-3xl">
            <span className="font-label-caps text-xs text-prestige-gold block mb-2 font-bold tracking-widest uppercase">
              HUKUKİ BİLGİ BANKASI & REHBER
            </span>
            <h1 className="font-display-lg text-3xl md:text-4xl text-legal-navy dark:text-slate-100 mb-3 font-bold transition-colors">
              Hukuki Makaleler & Analizler
            </h1>
            <p className="font-body-lg text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed transition-colors">
              Güncel yasal düzenlemeler, mahkeme kararları ve sektörel hukuki analizler ile haklarınızı keşfedin.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-white dark:bg-slate-800 border-b border-stone-gray/60 dark:border-slate-700/60 shadow-sm sticky top-20 z-20 transition-colors duration-300">
        <BlogFilters categories={categories} />
      </section>

      {/* Articles Grid Section */}
      <section className="py-12">
        <div className="max-w-container-max mx-auto px-gutter space-y-8">
          {/* Results Summary Bar */}
          {totalArticles > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-on-surface-variant dark:text-slate-400 border-b border-stone-gray/40 dark:border-slate-700/40 pb-4">
              <div>
                Toplam <span className="font-bold text-legal-navy dark:text-slate-200">{totalArticles}</span> makaleden{' '}
                <span className="font-bold text-legal-navy dark:text-slate-200">
                  {startIndex + 1} - {endIndex}
                </span>{' '}
                arası gösteriliyor.
              </div>
              {activeCategorySlug && (
                <div className="flex items-center gap-1.5 bg-prestige-gold/10 text-prestige-gold px-3 py-1 rounded-full font-semibold border border-prestige-gold/30">
                  <span>Kategori: {activeCategory?.name}</span>
                  <Link href="/makaleler" className="hover:text-legal-navy dark:hover:text-slate-200 font-bold ml-1 transition-colors">
                    ✕
                  </Link>
                </div>
              )}
            </div>
          )}

          {paginatedArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((art: any) => (
                  <Link
                    key={art.id}
                    className="group bg-white dark:bg-slate-800 border border-stone-gray/60 dark:border-slate-700/60 hover:border-prestige-gold dark:hover:border-prestige-gold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col rounded-2xl overflow-hidden"
                    href={`/makaleler/${art.slug}`}
                  >
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-label-caps text-prestige-gold mb-3 block uppercase font-bold text-[11px] tracking-wider">
                          {getArticleCategories(art)}
                        </span>
                        <h3 className="font-headline-sm text-xl text-legal-navy dark:text-slate-100 group-hover:text-prestige-gold dark:group-hover:text-prestige-gold transition-colors leading-snug mb-3 font-bold line-clamp-2">
                          {art.title}
                        </h3>
                        <p className="text-on-surface-variant dark:text-slate-400 text-xs line-clamp-3 mb-6 leading-relaxed transition-colors">
                          {art.summary}
                        </p>
                      </div>

                      {/* Card Footer with Author, Date & Reading Time */}
                      <div className="pt-4 border-t border-stone-gray/40 dark:border-slate-700/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant dark:text-slate-400 mt-auto transition-colors">
                        {/* Author Info */}
                        <div className="flex items-center gap-1.5 font-semibold text-legal-navy dark:text-slate-200 bg-stone-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md border border-stone-gray/40 dark:border-slate-700/40">
                          <span className="material-symbols-outlined text-sm text-prestige-gold">person</span>
                          <span>{authorName}</span>
                        </div>

                        {/* Date & Reading Time */}
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">calendar_today</span>
                            {new Date(art.published_at || art.created_at).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-stone-500">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {art.reading_time_minutes || 3} dk okuma
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="pt-10 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {/* First Page */}
                    {currentPage > 1 && (
                      <Link
                        href={getPageUrl(1)}
                        className="w-10 h-10 border border-stone-gray/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center hover:border-prestige-gold dark:hover:border-prestige-gold text-legal-navy dark:text-slate-200 transition-colors shadow-sm"
                        title="İlk Sayfa"
                      >
                        <span className="material-symbols-outlined text-sm">first_page</span>
                      </Link>
                    )}

                    {/* Previous Page */}
                    {currentPage > 1 && (
                      <Link
                        href={getPageUrl(currentPage - 1)}
                        className="px-3.5 h-10 border border-stone-gray/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 rounded-lg flex items-center gap-1 text-xs font-bold hover:border-prestige-gold dark:hover:border-prestige-gold text-legal-navy dark:text-slate-200 transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                        Önceki
                      </Link>
                    )}

                    {/* Page Numbers */}
                    {getPageNumbers().map((pNum, idx) => {
                      if (pNum === -1 || pNum === -2) {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 text-stone-400 dark:text-slate-500 font-bold">
                            ...
                          </span>
                        );
                      }
                      return (
                        <Link
                          key={pNum}
                          href={getPageUrl(pNum)}
                          className={`w-10 h-10 border rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                            currentPage === pNum
                              ? 'bg-legal-navy dark:bg-prestige-gold text-white dark:text-slate-900 border-legal-navy dark:border-prestige-gold shadow-md'
                              : 'border-stone-gray/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 text-legal-navy dark:text-slate-200 hover:border-prestige-gold dark:hover:border-prestige-gold shadow-sm'
                          }`}
                        >
                          {pNum}
                        </Link>
                      );
                    })}

                    {/* Next Page */}
                    {currentPage < totalPages && (
                      <Link
                        href={getPageUrl(currentPage + 1)}
                        className="px-3.5 h-10 border border-stone-gray/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 rounded-lg flex items-center gap-1 text-xs font-bold hover:border-prestige-gold dark:hover:border-prestige-gold text-legal-navy dark:text-slate-200 transition-colors shadow-sm"
                      >
                        Sonraki
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </Link>
                    )}

                    {/* Last Page */}
                    {currentPage < totalPages && (
                      <Link
                        href={getPageUrl(totalPages)}
                        className="w-10 h-10 border border-stone-gray/70 dark:border-slate-700/70 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center hover:border-prestige-gold dark:hover:border-prestige-gold text-legal-navy dark:text-slate-200 transition-colors shadow-sm"
                        title="Son Sayfa"
                      >
                        <span className="material-symbols-outlined text-sm">last_page</span>
                      </Link>
                    )}
                  </div>

                  <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                    Sayfa {currentPage} / {totalPages}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-800 border border-stone-gray/70 dark:border-slate-700/70 rounded-2xl shadow-sm transition-colors duration-300">
              <span className="material-symbols-outlined text-5xl text-stone-400 dark:text-slate-500 mb-4">search_off</span>
              <h3 className="font-headline-sm text-legal-navy dark:text-slate-100 text-xl font-bold">Makale Bulunamadı</h3>
              <p className="text-on-surface-variant dark:text-slate-400 text-xs mt-2 max-w-md mx-auto">
                Aradığınız kriterlere uygun makale bulunmamaktadır. Lütfen farklı anahtar kelimelerle arama yapmayı veya filtreleri sıfırlamayı deneyin.
              </p>
              <Link
                href="/makaleler"
                className="inline-block mt-6 px-6 py-2.5 bg-legal-navy dark:bg-prestige-gold text-white dark:text-slate-900 font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-opacity-90 transition-colors"
              >
                Filtreleri Sıfırla
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
