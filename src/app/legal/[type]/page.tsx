import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLegalDocument } from '@/lib/supabase';
import { formatLegalContent } from '@/lib/formatLegalContent';

export const revalidate = 0; // Dynamic rendering

interface LegalPageProps {
  params: {
    type: string;
  };
}

export async function generateMetadata({ params }: LegalPageProps) {
  const type = params.type;
  const title =
    type === 'kvkk'
      ? 'KVKK Aydınlatma Metni'
      : type === 'privacy'
      ? 'Gizlilik Politikası'
      : type === 'terms'
      ? 'Kullanım Koşulları'
      : 'Yasal Metin';

  return {
    title: `${title} - Avukat Ramazan Mızrak`,
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const type = params.type;
  if (!['kvkk', 'privacy', 'terms'].includes(type)) {
    notFound();
  }

  const document = await getLegalDocument(type);
  if (!document) {
    notFound();
  }

  const title =
    type === 'kvkk'
      ? 'KVKK Aydınlatma Metni'
      : type === 'privacy'
      ? 'Gizlilik Politikası'
      : 'Kullanım Koşulları';

  const formattedHtml = formatLegalContent(document.content || '');

  return (
    <div className="pt-20 flex-1 bg-[#F8F7F4] dark:bg-slate-900 transition-colors duration-300 min-h-screen flex flex-col">
      {/* Header & Breadcrumb Section */}
      <section className="pt-12 pb-8 bg-white dark:bg-slate-800 border-b border-stone-gray/30 dark:border-slate-700/60 transition-colors duration-300">
        <div className="max-w-container-max mx-auto px-gutter">
          <nav className="flex items-center space-x-2 text-stone-gray dark:text-slate-400 font-label-caps text-label-caps mb-8">
            <Link className="hover:text-legal-navy dark:hover:text-slate-200 transition-colors" href="/">
              Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-legal-navy dark:text-slate-100 font-semibold">Yasal Metinler</span>
          </nav>
          <div className="max-w-article-max mx-auto text-center">
            <h1 className="font-display-lg text-display-lg text-legal-navy dark:text-slate-100 mb-4 leading-tight font-bold transition-colors">
              {title}
            </h1>
            <span className="text-xs font-bold text-prestige-gold uppercase tracking-wider block">
              Son Güncelleme:{' '}
              {new Date(document.last_updated).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Section - Framed in Prestige Gold */}
      <section className="py-12 md:py-16 bg-[#F8F7F4] dark:bg-slate-950 relative transition-colors duration-300 flex-1">
        <div className="max-w-article-max mx-auto px-gutter">
          <article className="w-full bg-white dark:bg-slate-900 border-2 border-prestige-gold/70 dark:border-prestige-gold/80 rounded-2xl p-6 sm:p-10 md:p-14 shadow-[0_8px_30px_rgba(197,160,89,0.15)] dark:shadow-[0_8px_35px_rgba(197,160,89,0.2)] relative overflow-hidden transition-all duration-300">
            {/* Top decorative gradient gold bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-prestige-gold via-amber-300 to-prestige-gold" />

            <div
              className="legal-content article-content prose prose-lg prose-stone dark:prose-invert max-w-none w-full whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formattedHtml }}
            />
          </article>
        </div>
      </section>
    </div>
  );
}
