import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLegalDocument } from '@/lib/supabase';

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

  return (
    <div className="pt-20 flex-1">
      <section className="py-16 bg-white">
        <div className="max-w-article-max mx-auto px-gutter">
          <nav className="flex items-center space-x-2 text-stone-gray font-label-caps text-label-caps mb-8">
            <Link className="hover:text-legal-navy transition-colors" href="/">
              Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-legal-navy">Yasal Metinler</span>
          </nav>

          <article className="prose max-w-none">
            <h1 className="font-display-lg text-display-lg text-legal-navy mb-4 font-bold">
              {title}
            </h1>
            <span className="text-xs font-bold text-prestige-gold uppercase tracking-wider block mb-6">
              Son Güncelleme:{' '}
              {new Date(document.last_updated).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <div
              className="legal-content space-y-6 prose prose-stone"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />
          </article>
        </div>
      </section>
    </div>
  );
}
