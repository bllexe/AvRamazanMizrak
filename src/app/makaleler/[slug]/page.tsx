import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles, getCategories, getProfile, supabase } from '@/lib/supabase';

export const revalidate = 0; // Dynamic rendering

interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const rawArticles = await getArticles();
  const article = rawArticles.find((a: any) => a.slug === params.slug && a.status === 'published');

  if (!article) return {};

  return {
    title: `${article.title} - Avukat Ramazan Mızrak`,
    description: article.meta_description || article.summary,
    keywords: article.meta_keywords || '',
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const slug = params.slug;
  const rawArticles = await getArticles();
  const article = rawArticles.find((a: any) => a.slug === slug && a.status === 'published');

  if (!article) {
    notFound();
  }

  // Increment view count
  if (supabase) {
    const updatedViewCount = (article.view_count || 0) + 1;
    await supabase
      .from('articles')
      .update({ view_count: updatedViewCount })
      .eq('id', article.id);
  }

  const categories = await getCategories();
  const author = await getProfile();

  // Find categories for this article
  const articleCats = categories.filter(
    (c: any) =>
      article.category_id === c.id ||
      (Array.isArray(article.category_ids) && article.category_ids.includes(c.id))
  );

  // Get related articles (sharing at least one category, excluding current article)
  const currentCategoryIds = article.category_ids || (article.category_id ? [article.category_id] : []);
  const related = rawArticles
    .filter((a: any) => {
      if (a.id === article.id || a.status !== 'published') return false;
      const otherCategoryIds = a.category_ids || (a.category_id ? [a.category_id] : []);
      return currentCategoryIds.some((id: string) => otherCategoryIds.includes(id));
    })
    .slice(0, 3);

  const getArticleCategories = (art: any) => {
    const cats = categories.filter(
      (c: any) =>
        art.category_id === c.id ||
        (Array.isArray(art.category_ids) && art.category_ids.includes(c.id))
    );
    return cats.length > 0 ? cats.map((c: any) => c.name).join(' / ') : 'Genel';
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${siteUrl}/makaleler/${article.slug}`;

  return (
    <div className="pt-20 flex-1">
      {/* Breadcrumb & Header Section */}
      <section className="pt-12 pb-8 bg-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <nav className="flex items-center space-x-2 text-stone-gray font-label-caps text-label-caps mb-8">
            <Link className="hover:text-legal-navy transition-colors" href="/">
              Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link className="hover:text-legal-navy transition-colors" href="/makaleler">
              Makaleler
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-legal-navy truncate max-w-[200px] md:max-w-none">
              {article.title}
            </span>
          </nav>
          <div className="max-w-article-max mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {articleCats.length > 0 ? (
                articleCats.map((c: any) => (
                  <span
                    key={c.id}
                    className="inline-block px-3 py-1 bg-surface-container-low text-legal-navy font-label-caps text-label-caps rounded uppercase font-bold text-xs"
                  >
                    {c.name}
                  </span>
                ))
              ) : (
                <span className="inline-block px-3 py-1 bg-surface-container-low text-legal-navy font-label-caps text-label-caps rounded uppercase font-bold text-xs">
                  Genel
                </span>
              )}
            </div>
            <h1 className="font-display-lg text-display-lg text-legal-navy mb-6 leading-tight font-bold">
              {article.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-on-surface-variant font-body-md text-body-md">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-prestige-gold">calendar_today</span>
                {new Date(article.published_at || article.created_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-prestige-gold">schedule</span>
                {article.reading_time_minutes} Dakika Okuma
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row gap-gutter">
          {/* Social Share Floating Sidebar */}
          <aside className="hidden md:block w-12 shrink-0">
            <div className="sticky top-28 flex flex-col gap-4 items-center">
              <span
                className="font-label-caps text-[10px] text-stone-gray vertical-text uppercase mb-2"
                style={{ writingMode: 'vertical-rl' }}
              >
                Paylaş
              </span>
              <a
                className="w-10 h-10 flex items-center justify-center border border-stone-gray text-legal-navy hover:bg-legal-navy hover:text-white transition-all"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn'de Paylaş"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              {author?.whatsapp_number && (
                <a
                  className="w-10 h-10 flex items-center justify-center border border-stone-gray text-legal-navy hover:bg-legal-navy hover:text-white transition-all"
                  href={`https://wa.me/${author.whatsapp_number.replace(
                    /[^0-9]/g,
                    ''
                  )}?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp'ta Paylaş"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.468 3.42 1.284 4.884L2 22l5.244-1.284C8.688 21.528 10.32 22 12.012 22 17.544 22 22 17.52 22 12.012 22 6.48 17.544 2 12.012 2zm5.724 13.92c-.24.672-1.38 1.308-1.908 1.38-.492.072-.972.108-3.084-.756-2.58-1.056-4.236-3.672-4.368-3.84-.12-.18-1.044-1.392-1.044-2.652s.648-1.884.888-2.124c.24-.24.528-.3.708-.3h.504c.18 0 .42 0 .648.516.228.528.78 1.908.84 2.028.072.12.108.264.024.42-.084.18-.132.276-.264.432-.132.144-.276.324-.396.444-.132.132-.276.276-.12.54.156.264.696 1.152 1.488 1.86.132.12.252.24.372.336.96.804 1.728.996 2.016 1.092.3.108.48.06.66-.144.18-.204.78-.912.984-1.224.204-.3.408-.252.684-.144.276.108 1.752.828 2.052.972.3.156.504.228.576.36.072.132.072.756-.168 1.428z" />
                  </svg>
                </a>
              )}
            </div>
          </aside>

          {/* Content Area */}
          <article className="flex-1 max-w-article-max mx-auto">
            {article.image_url && (
              <div className="mb-12 rounded-xl overflow-hidden border border-stone-gray/60 shadow-lg">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-auto object-cover max-h-[450px]"
                />
              </div>
            )}

            <div
              className="article-content font-body-lg text-body-lg text-ink-black leading-relaxed space-y-6 prose prose-stone"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Author Card */}
            {author && (
              <div className="mt-20 p-8 border border-stone-gray bg-[#F8F7F4] flex flex-col md:flex-row items-center gap-8 rounded-lg">
                <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-2 border-prestige-gold relative">
                  <img
                    src={author.image_url}
                    alt={author.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <span className="font-label-caps text-label-caps text-prestige-gold mb-2 block font-bold text-xs">
                    YAZAR
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-legal-navy mb-2 font-bold">
                    {author.full_name}
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {author.bio_short}
                  </p>
                  <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                    {author.email && (
                      <a
                        className="text-legal-navy hover:text-prestige-gold transition-colors flex items-center"
                        href={`mailto:${author.email}`}
                        title="E-Posta Gönder"
                      >
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </a>
                    )}
                    {author.linkedin_url && (
                      <a
                        className="text-legal-navy hover:text-prestige-gold transition-colors flex items-center"
                        href={author.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {author.twitter_url && (
                      <a
                        className="text-legal-navy hover:text-prestige-gold transition-colors flex items-center"
                        href={author.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Twitter / X"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 bg-legal-navy p-10 text-center rounded shadow-xl">
              <h3 className="font-headline-md text-headline-md text-white mb-4 font-bold">
                Hukuki Yardıma mı İhtiyacınız Var?
              </h3>
              <p className="text-stone-gray opacity-80 font-body-md mb-8 max-w-md mx-auto">
                Sorularınız veya randevu talepleriniz için bana ulaşabilirsiniz.
              </p>
              <Link
                className="inline-block px-10 py-4 bg-prestige-gold text-legal-navy font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm"
                href="/iletisim"
              >
                Randevu Al
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-20 bg-[#F8F7F4] border-t border-stone-gray/30">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="font-label-caps text-label-caps text-prestige-gold mb-2 block uppercase font-bold text-xs">
                  Daha Fazla Oku
                </span>
                <h2 className="font-headline-md text-headline-md text-legal-navy font-bold">
                  İlgili Makaleler
                </h2>
              </div>
              <Link
                className="hidden md:flex items-center gap-2 text-legal-navy font-bold hover:text-prestige-gold transition-colors text-sm"
                href="/makaleler"
              >
                Tümünü Gör <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((art: any) => (
                <Link
                  key={art.id}
                  className="group bg-white border border-stone-gray/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded overflow-hidden flex flex-col"
                  href={`/makaleler/${art.slug}`}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="font-label-caps text-label-caps text-prestige-gold mb-3 block uppercase font-bold text-xs">
                      {getArticleCategories(art)}
                    </span>
                    <h3 className="font-headline-sm text-[20px] text-legal-navy group-hover:text-prestige-gold transition-colors leading-snug mb-4 line-clamp-2 font-bold">
                      {art.title}
                    </h3>
                    <p className="text-on-surface-variant text-body-md line-clamp-2 mb-4 flex-1">
                      {art.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
