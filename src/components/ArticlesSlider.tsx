'use client';

import React, { useRef } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  published_at: string;
  created_at: string;
  reading_time_minutes: number;
  categories?: any[];
  category_id?: string;
  category_ids?: string[];
}

interface ArticlesSliderProps {
  articles: Article[];
  categories: any[];
}

export default function ArticlesSlider({ articles, categories }: ArticlesSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const slide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const firstCard = sliderRef.current.querySelector('article');
      const scrollAmount = firstCard ? firstCard.clientWidth + 24 : 350;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getArticleCategories = (art: Article) => {
    const cats = categories.filter(
      (c) => art.categories?.some((ac) => ac.id === c.id) || art.category_ids?.includes(c.id) || c.id === art.category_id
    );
    return cats.length > 0 ? cats.map((c) => c.name).join(' / ') : 'Genel';
  };

  return (
    <div>
      {/* Slider Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <span className="font-label-caps text-label-caps text-prestige-gold block mb-2">
            GÜNCEL HUKUKİ YAZILARIMIZ
          </span>
          <h2 className="font-headline-md text-headline-md text-legal-navy font-bold">
            Makaleler & Analizler
          </h2>
        </div>
        {/* Slider Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/makaleler"
            className="hidden sm:flex items-center gap-2 text-legal-navy font-bold hover:text-prestige-gold transition-colors text-sm mr-2"
          >
            Tümünü Gör <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => slide('left')}
              className="w-10 h-10 border border-stone-gray/60 rounded-full flex items-center justify-center text-legal-navy hover:border-prestige-gold hover:text-prestige-gold transition-all bg-white shadow-sm hover:shadow active:scale-95"
              aria-label="Sola Kaydır"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              onClick={() => slide('right')}
              className="w-10 h-10 border border-stone-gray/60 rounded-full flex items-center justify-center text-legal-navy hover:border-prestige-gold hover:text-prestige-gold transition-all bg-white shadow-sm hover:shadow active:scale-95"
              aria-label="Sağa Kaydır"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {articles.length > 0 ? (
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-4 -my-4"
        >
          {articles.map((art) => (
            <article
              key={art.id}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start bg-white border border-stone-gray/60 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-[10px] text-prestige-gold mb-2 block uppercase tracking-wider">
                    {getArticleCategories(art)}
                  </span>
                  <h3 className="font-headline-sm text-lg text-legal-navy mb-3 line-clamp-2 hover:text-prestige-gold transition-colors font-bold">
                    <Link href={`/makaleler/${art.slug}`}>{art.title}</Link>
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed mb-4">
                    {art.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant border-t border-stone-gray/30 pt-4 mt-auto">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {new Date(art.published_at || art.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span>{art.reading_time_minutes} dk okuma</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-stone-gray/60 rounded-xl">
          <p className="text-on-surface-variant">Henüz yayınlanmış makale bulunmamaktadır.</p>
        </div>
      )}
    </div>
  );
}
