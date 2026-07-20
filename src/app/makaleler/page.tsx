import React from 'react';
import Link from 'next/link';
import { getArticles, getCategories } from '@/lib/supabase';
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

  const activeCategorySlug = searchParams.category || '';
  const searchWord = (searchParams.search || '').toLowerCase();
  const sortBy = searchParams.sortBy || 'newest';
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 6;

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
  const totalPages = Math.ceil(totalArticles / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize);

  // Helper to generate categories string for an article
  const getArticleCategories = (art: any) => {
    const cats = categories.filter(
      (c: any) => art.categories?.some((ac: any) => ac.id === c.id) || art.category_ids?.includes(c.id) || c.id === art.category_id
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

  return (
    <div className="pt-20 flex-1">
      {/* Page Header */}
      <section className="pt-12 pb-8 bg-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <nav className="flex items-center space-x-2 text-stone-gray font-label-caps text-label-caps mb-6">
            <Link className="hover:text-legal-navy transition-colors" href="/">
              Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-legal-navy">Makaleler</span>
          </nav>
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-prestige-gold block mb-2 font-bold">
              BİLGİ PAYLAŞTIKÇA ÇOĞALIR
            </span>
            <h1 className="font-display-lg text-display-lg text-legal-navy mb-4 font-bold">
              Hukuki Makaleler & Analizler
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Güncel yasal düzenlemeler, mahkeme kararları ve sektörel analizler ile haklarınızı daha iyi tanıyın.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-white border-t border-b border-stone-gray/60">
        <BlogFilters categories={categories} />
      </section>

      {/* Articles Grid Section */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-gutter">
          {paginatedArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((art: any) => (
                  <Link
                    key={art.id}
                    className="group bg-white border border-stone-gray/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col rounded overflow-hidden"
                    href={`/makaleler/${art.slug}`}
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <span className="font-label-caps text-label-caps text-prestige-gold mb-3 block uppercase font-bold text-xs">
                        {getArticleCategories(art)}
                      </span>
                      <h3 className="font-headline-sm text-[20px] text-legal-navy group-hover:text-prestige-gold transition-colors leading-snug mb-4 font-bold">
                        {art.title}
                      </h3>
                      <p className="text-on-surface-variant text-body-md line-clamp-3 mb-6 flex-1">
                        {art.summary}
                      </p>
                      <div className="flex justify-between items-center text-xs text-on-surface-variant border-t border-stone-gray/30 pt-4 mt-auto">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {new Date(art.published_at || art.created_at).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {art.reading_time_minutes} dk okuma
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16">
                  {page > 1 && (
                    <Link
                      href={getPageUrl(page - 1)}
                      className="w-10 h-10 border border-stone-gray rounded flex items-center justify-center hover:border-prestige-gold text-legal-navy"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </Link>
                  )}

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <Link
                        key={pageNum}
                        href={getPageUrl(pageNum)}
                        className={`w-10 h-10 border rounded flex items-center justify-center font-bold text-sm transition-colors ${
                          page === pageNum
                            ? 'bg-legal-navy text-white border-legal-navy'
                            : 'border-stone-gray text-legal-navy hover:border-prestige-gold'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}

                  {page < totalPages && (
                    <Link
                      href={getPageUrl(page + 1)}
                      className="w-10 h-10 border border-stone-gray rounded flex items-center justify-center hover:border-prestige-gold text-legal-navy"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white border border-stone-gray rounded-xl">
              <span className="material-symbols-outlined text-5xl text-stone-gray mb-4">search_off</span>
              <h3 className="font-headline-sm text-legal-navy text-xl font-bold">Makale Bulunamadı</h3>
              <p className="text-on-surface-variant mt-2">
                Arama kriterlerinize uygun makale bulunmamaktadır. Lütfen farklı kelimelerle arama yapın.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
