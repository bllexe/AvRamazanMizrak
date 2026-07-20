import React from 'react';
import Link from 'next/link';
import { getResources } from '@/lib/supabase';
import ResourcesList from '@/components/ResourcesList';

export const revalidate = 0; // Dynamic rendering

export default async function ResourcesPage() {
  const resources = await getResources();

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
            <span className="text-legal-navy">Kaynaklar</span>
          </nav>
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-prestige-gold block mb-2 font-bold">
              FAYDALI DOKÜMANLAR
            </span>
            <h1 className="font-display-lg text-display-lg text-legal-navy mb-4 font-bold">
              Hukuki Kaynaklar & İndirmeler
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Süreçlerinizi kolaylaştıracak kılavuzlar, kontrol listeleri ve hukuki sözleşme şablonlarını ücretsiz indirin.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Listing */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-gutter">
          <ResourcesList initialResources={resources} />
        </div>
      </section>
    </div>
  );
}
