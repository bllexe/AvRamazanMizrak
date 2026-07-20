import React from 'react';
import { getProfile, getCertifications, getArticles, getCategories } from '@/lib/supabase';
import AboutCardsView from '@/components/AboutCardsView';
import ArticlesSlider from '@/components/ArticlesSlider';

export const revalidate = 0;

export default async function Home() {
  const author = await getProfile();
  const certifications = await getCertifications();
  const rawArticles = await getArticles();
  const categories = await getCategories();

  const articles = rawArticles
    .filter((a: any) => a.status === 'published')
    .sort(
      (a: any, b: any) =>
        new Date(b.published_at || b.created_at).getTime() -
        new Date(a.published_at || a.created_at).getTime()
    );

  return (
    <div>
      <AboutCardsView author={author} certifications={certifications} />
      {articles.length > 0 && (
        <section className="py-20 bg-[#F8F7F4] dark:bg-slate-900 border-t border-stone-gray/40 dark:border-slate-800">
          <div className="max-w-container-max mx-auto px-gutter">
            <ArticlesSlider articles={articles} categories={categories} />
          </div>
        </section>
      )}
    </div>
  );
}

