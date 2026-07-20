import React from 'react';
import Link from 'next/link';
import { getProfile, getArticles, getCategories } from '@/lib/supabase';
import ArticlesSlider from '@/components/ArticlesSlider';

export default async function Home() {
  const author = await getProfile();
  const rawArticles = await getArticles();
  const categories = await getCategories();

  // Filter, sort and slice articles
  const articles = rawArticles
    .filter((a: any) => a.status === 'published')
    .sort((a: any, b: any) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-subtle-pattern border-b border-stone-gray/40">
        <div className="max-w-container-max mx-auto px-gutter relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Area */}
            <div className="lg:col-span-7 space-y-6">
              <span className="font-label-caps text-label-caps text-prestige-gold block tracking-widest">
                PRESTİJLİ HUKUKİ ÇÖZÜMLER
              </span>
              <h1 className="font-display-lg text-display-lg text-legal-navy leading-tight">
                Hukukta Güven, Deneyim ve Profesyonel Yaklaşım
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-xl">
                {author?.bio_short ||
                  'Karmaşık hukuki süreçlerinizi stratejik bir bakış açısıyla yönetiyoruz. 10 yılı aşkın tecrübe ile her vakada mutlak titizlik ve şeffaflık önceliğimizdir.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/iletisim"
                  className="bg-legal-navy text-white px-8 py-4 rounded-lg font-bold hover:bg-opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg hover:shadow-legal-navy/10"
                >
                  Randevu Talep Et
                </Link>
                <Link
                  href="/hakkimda"
                  className="border border-[#DEDCD7] hover:border-prestige-gold text-legal-navy px-8 py-4 rounded-lg font-bold hover:bg-white transition-all"
                >
                  Hakkımızda Daha Fazlası
                </Link>
              </div>
            </div>
            {/* Graphic / Visual Column */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-stone-gray/80 shadow-2xl bg-white">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdFMptAbNELibo1aqWndICShCQWU2NEf1FJGgyM7yTzC6SZNLPhdvm0zS1SU-l5hsM242AZ-WCF972rbnsZJlMTuLG1VId6gLiNgq5PJmgPSZY9y6zcB-R72OFotu4OM0aW39WL4FCwOoZF036H-OLbF8D6gp0ccokSMYSWyw2QA5lcST344qgUwhn5Tuo4edtOyRQCdaH-3L1Mt80SfBNMyXBCT8dalcIX5vj0KpUr1gaXrq3-KlysiNe7xETr2DEN7y9bmJp7H4P')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-legal-navy/20 to-transparent" />
              </div>
              {/* Decorative badge overlay */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-[#DEDCD7] p-4 rounded-lg shadow-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-prestige-gold text-3xl">gavel</span>
                <div>
                  <p className="text-xs font-bold text-legal-navy uppercase tracking-wider">
                    Av. Ramazan Mızrak
                  </p>
                  <p className="text-[10px] text-on-surface-variant">Kurucu Hukukçu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio / Hakkımda Section */}
      {author && (
        <section className="py-20 bg-white">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Left: Profile Image & Stats Grid */}
              <div className="lg:col-span-5 space-y-6">
                <div className="w-full aspect-[4/5] bg-stone-gray overflow-hidden shadow-xl rounded-lg border border-stone-gray/60 relative">
                  <img
                    src={author.image_url}
                    alt={author.full_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-legal-navy/10 to-transparent" />
                </div>

                {/* Stats Bento Widgets */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-[#F8F7F4] border border-[#DEDCD7] rounded-lg hover:border-prestige-gold transition-colors flex flex-col justify-between">
                    <span className="material-symbols-outlined text-prestige-gold mb-2 text-[28px]">
                      workspace_premium
                    </span>
                    <div>
                      <span className="block text-2xl font-bold text-legal-navy leading-none mb-1">
                        {author.experience_years}+ Yıl
                      </span>
                      <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Mesleki Tecrübe
                      </span>
                    </div>
                  </div>
                  <div className="p-5 bg-[#F8F7F4] border border-[#DEDCD7] rounded-lg hover:border-prestige-gold transition-colors flex flex-col justify-between">
                    <span className="material-symbols-outlined text-prestige-gold mb-2 text-[28px]">
                      gavel
                    </span>
                    <div>
                      <span className="block text-xl font-bold text-legal-navy leading-none mb-1">
                        {author.bar_number || 'Aktif'}
                      </span>
                      <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Baro Sicil No
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Bio Content */}
              <div className="lg:col-span-7 space-y-6">
                <span className="font-label-caps text-label-caps text-prestige-gold uppercase block tracking-wider">
                  Avukat Profili
                </span>
                <h2 className="font-headline-md text-headline-md text-legal-navy">
                  {author.full_name}
                </h2>
                <p className="font-label-caps text-sm text-prestige-gold tracking-widest border-b border-stone-gray/40 pb-4">
                  {author.title} | Türkiye Barolar Birliği
                </p>
                <div
                  className="font-body-lg text-body-lg text-on-surface-variant space-y-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: author.bio_long }}
                />
                <div className="pt-4 flex gap-6">
                  <Link
                    href="/hakkimda"
                    className="inline-flex items-center gap-2 text-prestige-gold font-bold hover:text-legal-navy transition-colors group"
                  >
                    Eğitim ve Sertifikalarımı İnceleyin
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Bento Grid / Slider */}
      <section className="py-20 bg-[#F8F7F4] border-t border-stone-gray/40">
        <div className="max-w-container-max mx-auto px-gutter">
          <ArticlesSlider articles={articles} categories={categories} />
        </div>
      </section>
    </div>
  );
}
