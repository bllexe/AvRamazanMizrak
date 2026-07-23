'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date_obtained?: string;
  display_order?: number;
}

interface AboutCardsViewProps {
  author: any;
  certifications: Certification[];
}

export default function AboutCardsView({ author, certifications }: AboutCardsViewProps) {
  // Tab state: default to 'biyografi' (no 'tum' tab)
  const [activeTab, setActiveTab] = useState<'biyografi' | 'uzmanlik' | 'egitim'>('biyografi');

  // Profile image (dynamic from DB or fallback)
  const profilePhoto =
    author?.image_url && !author.image_url.includes('lh3.googleusercontent.com')
      ? author.image_url
      : '/images/profil2.jpeg';

  // Dynamic Profile Data from Database
  const fullName = author?.full_name || 'Av. Ramazan Mızrak';
  const title = author?.title || 'Avukat & Hukuk Danışmanı';
  const barNumber = author?.bar_number || '';
  const experienceYears = author?.experience_years || '';
  const email = author?.email || '';
  const phone = author?.phone || '';
  const whatsappNumber = author?.whatsapp_number || '';
  const bioShort = author?.bio_short || '';
  const bioLong = author?.bio_long || '';

  // Dynamic Specializations from Database
  const specializations: string[] = Array.isArray(author?.specializations)
    ? author.specializations
    : typeof author?.specializations === 'string'
      ? JSON.parse(author.specializations || '[]')
      : [];

  // Dynamic Certifications from Database
  const certList = certifications || [];

  return (
    <div className="pt-24 pb-20 bg-[#F8F7F4] dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-gutter space-y-10">
        {/* Header Breadcrumb & Tab Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-gray/60 dark:border-slate-700/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-label-caps text-on-surface-variant mb-2">
              <Link href="/" className="hover:text-prestige-gold transition-colors">
                Anasayfa
              </Link>
              <span>/</span>
              <span className="text-prestige-gold font-bold">Hakkımda</span>
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl lg:text-5xl text-legal-navy dark:text-slate-100 font-bold tracking-tight">
              {fullName}
            </h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1 font-medium">
              Biyografi, Uzmanlık Alanları ve Eğitim & Sertifika Bilgileri
            </p>
          </div>

          {/* Clean 3-Tab Navigation (Biyografi, Uzmanlıklar, Eğitim & Sertifika) */}
          <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-stone-gray/60 dark:border-slate-700/60 shadow-sm self-start md:self-auto">
            <button
              onClick={() => setActiveTab('biyografi')}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'biyografi'
                ? 'bg-legal-navy text-white shadow-md'
                : 'text-on-surface-variant hover:text-legal-navy hover:bg-stone-50'
                }`}
            >
              <span className="material-symbols-outlined text-base">auto_stories</span>
              Biyografi
            </button>
            <button
              onClick={() => setActiveTab('uzmanlik')}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'uzmanlik'
                ? 'bg-legal-navy text-white shadow-md'
                : 'text-on-surface-variant hover:text-legal-navy hover:bg-stone-50'
                }`}
            >
              <span className="material-symbols-outlined text-base">gavel</span>
              Uzmanlıklar
            </button>
            <button
              onClick={() => setActiveTab('egitim')}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'egitim'
                ? 'bg-legal-navy text-white shadow-md'
                : 'text-on-surface-variant hover:text-legal-navy hover:bg-stone-50'
                }`}
            >
              <span className="material-symbols-outlined text-base">workspace_premium</span>
              Eğitim & Sertifika
            </button>
          </div>
        </div>

        {/* 1. BİYOGRAFİ TAB VIEW */}
        {activeTab === 'biyografi' && (
          <div className="space-y-10">
            {/* HERO PROFILE CARD */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-gray/70 dark:border-slate-700/70 p-6 md:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-prestige-gold/5 dark:bg-prestige-gold/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Profile Image */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden border-2 border-prestige-gold/40 shadow-2xl bg-stone-100 group">
                    <img
                      src={profilePhoto}
                      alt={fullName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-legal-navy/80 via-transparent to-transparent opacity-90" />

                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-legal-navy/90 backdrop-blur-md rounded-lg border border-white/10 text-white flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-prestige-gold">{fullName}</p>
                        <p className="text-[11px] text-stone-300">{title}</p>
                      </div>
                      {barNumber && (
                        <span className="text-[10px] bg-prestige-gold/20 text-prestige-gold border border-prestige-gold/40 px-2 py-1 rounded font-bold uppercase">
                          Sicil: {barNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-prestige-gold/10 border border-prestige-gold/30 rounded-full text-prestige-gold text-xs font-bold tracking-wider uppercase">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      TBB Kayıtlı Avukat & Danışman
                    </div>
                    <h2 className="font-display-lg text-3xl md:text-4xl text-legal-navy dark:text-slate-100 font-bold">
                      {fullName}
                    </h2>
                    <p className="text-prestige-gold font-bold text-sm tracking-wide">
                      {title} {experienceYears && `— ${experienceYears}+ Yıl Kıdem`}
                    </p>
                  </div>

                  {bioShort && (
                    <div className="p-4 bg-[#F8F7F4] dark:bg-slate-900/50 rounded-xl border border-stone-gray/60 dark:border-slate-700/60 text-legal-navy dark:text-slate-300 text-sm font-medium leading-relaxed italic border-l-4 border-l-prestige-gold">
                      &quot;{bioShort}&quot;
                    </div>
                  )}

                  {/* Identity Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {barNumber && (
                      <div className="p-3 bg-stone-50 dark:bg-slate-800/50 rounded-lg border border-stone-gray/40 dark:border-slate-700/40">
                        <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold block uppercase tracking-wider">
                          Baro Sicil No
                        </span>
                        <span className="text-sm font-bold text-legal-navy dark:text-slate-200">{barNumber}</span>
                      </div>
                    )}
                    {experienceYears && (
                      <div className="p-3 bg-stone-50 dark:bg-slate-800/50 rounded-lg border border-stone-gray/40 dark:border-slate-700/40">
                        <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold block uppercase tracking-wider">
                          Mesleki Tecrübe
                        </span>
                        <span className="text-sm font-bold text-legal-navy dark:text-slate-200">{experienceYears} Yıl +</span>
                      </div>
                    )}
                    {email && (
                      <div className="p-3 bg-stone-50 dark:bg-slate-800/50 rounded-lg border border-stone-gray/40 dark:border-slate-700/40 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold block uppercase tracking-wider">
                          E-Posta
                        </span>
                        <a
                          href={`mailto:${email}`}
                          className="text-xs font-bold text-prestige-gold hover:underline truncate block"
                        >
                          {email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                      href="/iletisim"
                      className="px-6 py-3.5 bg-legal-navy text-white text-xs font-bold rounded-lg hover:bg-opacity-95 transition-all shadow-md flex items-center gap-2 uppercase tracking-wider"
                    >
                      <span className="material-symbols-outlined text-prestige-gold text-lg">calendar_month</span>
                      Randevu Al
                    </Link>
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 bg-[#25D366] text-white text-xs font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-md flex items-center gap-2 uppercase tracking-wider"
                      >
                        <span className="material-symbols-outlined text-lg">chat</span>
                        WhatsApp İle Ulaşın
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILED BIO CARD */}
            <section className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl border border-stone-gray/70 dark:border-slate-700/70 shadow-md space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-gray/40 dark:border-slate-700/40 pb-4">
                <span className="material-symbols-outlined text-prestige-gold text-3xl">auto_stories</span>
                <div>
                  <h3 className="font-headline-md text-2xl text-legal-navy dark:text-slate-100 font-bold">
                    Biyografi & Vizyon
                  </h3>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">
                    {fullName} — Mesleki Geçmiş ve Hukuki İlkeler
                  </p>
                </div>
              </div>

              {bioLong ? (
                <div
                  className="font-body-lg text-body-lg text-on-surface-variant dark:text-slate-300 leading-relaxed space-y-4 prose prose-stone dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: bioLong }}
                />
              ) : (
                <p className="text-sm text-stone-500 italic">
                  Biyografi bilgisi henüz eklenmemiştir. Admin panelinden güncelleyebilirsiniz.
                </p>
              )}
            </section>
          </div>
        )}

        {/* 2. UZMANLIKLAR TAB VIEW */}
        {activeTab === 'uzmanlik' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-gray/60 dark:border-slate-700/60 pb-4">
              <div>
                <span className="font-label-caps text-xs text-prestige-gold uppercase tracking-widest block font-bold mb-1">
                  HUKUKİ ÇALIŞMA ALANLARI
                </span>
                <h2 className="font-headline-md text-2xl md:text-3xl text-legal-navy dark:text-slate-100 font-bold">
                  Uzmanlıklar
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-md">
                Müvekkillerimize sunulan temel hukuki danışmanlık ve dava takibi uzmanlıklarımız.
              </p>
            </div>

            {specializations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specializations.map((specItem: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-stone-gray/70 dark:border-slate-700/70 hover:border-prestige-gold dark:hover:border-prestige-gold hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-14 h-14 rounded-xl bg-[#F8F7F4] dark:bg-slate-900/50 border border-stone-gray/60 dark:border-slate-700/60 flex items-center justify-center text-prestige-gold mb-6 group-hover:bg-prestige-gold group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-3xl">gavel</span>
                      </div>

                      <h3 className="font-headline-sm text-xl text-legal-navy dark:text-slate-100 font-bold mb-3 group-hover:text-prestige-gold dark:group-hover:text-prestige-gold transition-colors">
                        {specItem}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-stone-gray/40 dark:border-slate-700/40">
                      <span className="px-2.5 py-1 bg-stone-50 dark:bg-slate-800/50 border border-stone-gray/50 dark:border-slate-700/50 text-legal-navy dark:text-slate-300 text-[10px] font-semibold rounded-md">
                        Uzmanlık Alanı
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-stone-gray/70 dark:border-slate-700/70 text-center text-sm text-stone-500 dark:text-slate-400 italic">
                Uzmanlık alanları henüz eklenmemiştir. Admin panelinden profil düzenleme bölümünden ekleyebilirsiniz.
              </div>
            )}
          </section>
        )}

        {/* 3. EĞİTİM & SERTİFİKA TAB VIEW */}
        {activeTab === 'egitim' && (
          <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-stone-gray/70 dark:border-slate-700/70 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-gray/40 dark:border-slate-700/40 pb-4">
              <span className="material-symbols-outlined text-prestige-gold text-3xl">
                workspace_premium
              </span>
              <div>
                <h3 className="font-headline-md text-2xl text-legal-navy dark:text-slate-100 font-bold">
                  Eğitim & Sertifikalar
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">Mesleki Uzmanlık Belgeleri & Yetkinlikler</p>
              </div>
            </div>

            {certList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certList.map((cert: any, idx: number) => (
                  <div
                    key={cert.id || idx}
                    className="p-4 bg-[#F8F7F4] dark:bg-slate-900/50 rounded-xl border border-stone-gray/60 dark:border-slate-700/60 hover:border-prestige-gold dark:hover:border-prestige-gold transition-colors flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-stone-gray/80 dark:border-slate-700/80 flex items-center justify-center text-prestige-gold shrink-0">
                      <span className="material-symbols-outlined text-xl">verified</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-legal-navy dark:text-slate-200 text-sm">{cert.title}</h4>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">{cert.issuer}</p>
                      {cert.date_obtained && (
                        <span className="text-[10px] text-stone-500 dark:text-slate-500 block mt-1 font-semibold">
                          {new Date(cert.date_obtained).toLocaleDateString('tr-TR', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic">
                Sertifika veya eğitim kaydı henüz eklenmemiştir.
              </p>
            )}
          </section>
        )}

        {/* CTA CARD */}
        <div className="bg-legal-navy text-white p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden border border-legal-navy">
          <div className="absolute top-0 right-0 w-80 h-80 bg-prestige-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest block">
                HUKUKİ DANIŞMANLIK & RANDEVU
              </span>
              <h2 className="font-display-lg text-2xl md:text-3xl font-bold">
                {fullName} ile İletişime Geçin
              </h2>
              <p className="text-stone-300 text-xs md:text-sm leading-relaxed">
                Hukuki uyuşmazlıklarınız ve danışmanlık talepleriniz için çalışma randevusu oluşturabilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full md:w-auto">
              <Link
                href="/iletisim"
                className="px-8 py-4 bg-prestige-gold text-legal-navy font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-white transition-colors shadow-lg whitespace-nowrap"
              >
                Randevu Alın
              </Link>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-opacity-90 transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
