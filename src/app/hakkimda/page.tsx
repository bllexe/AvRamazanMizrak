import React from 'react';
import Link from 'next/link';
import { getProfile, getCertifications } from '@/lib/supabase';

export const revalidate = 0; // Dynamic rendering

export default async function AboutPage() {
  const author = await getProfile();
  const certifications = await getCertifications();

  return (
    <div className="pt-20 flex-1">
      {/* Hero / Profile Header */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-subtle-pattern">
        <div className="max-w-container-max mx-auto px-gutter relative z-10">
          <div className="max-w-3xl">
            <span className="font-label-caps text-label-caps text-prestige-gold block mb-4">
              ÖZGEÇMİŞ & VİZYON
            </span>
            <h1 className="font-display-lg text-display-lg text-legal-navy mb-6">
              Güvenilir Hukuk Rehberiniz
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {author?.bio_short ||
                'Karmaşık hukuki süreçlerinizi stratejik bir bakış açısıyla yönetiyorum. Her dosyanın kendine özgü hikayesine ve ihtiyacına odaklanıyorum.'}
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Profile Section */}
      {author && (
        <section className="py-20 bg-white">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Panel (Sidebar Info) */}
              <div className="lg:col-span-4 space-y-8">
                <div className="w-full aspect-[4/5] bg-stone-gray overflow-hidden rounded-lg shadow-lg border border-stone-gray">
                  <img
                    src={author.image_url}
                    alt={author.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Key Credentials */}
                <div className="bg-[#F8F7F4] p-6 rounded-lg border border-stone-gray space-y-4">
                  <h4 className="font-headline-sm text-lg text-legal-navy border-b border-stone-gray/60 pb-2 font-bold">
                    Hukuki Kimlik
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Baro Sicil No:</span>
                      <span className="font-bold text-legal-navy">{author.bar_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Deneyim:</span>
                      <span className="font-bold text-legal-navy">{author.experience_years} Yıl +</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">E-Posta:</span>
                      <a
                        href={`mailto:${author.email}`}
                        className="font-semibold text-prestige-gold hover:underline"
                      >
                        {author.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Specialization Badges */}
                {author.specializations && author.specializations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-label-caps text-xs text-on-surface-variant tracking-wider uppercase">
                      Uzmanlık Alanları
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {author.specializations.map((spec: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-[#F8F7F4] border border-stone-gray text-legal-navy text-xs font-semibold rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel (Detailed Bio & Timeline) */}
              <div className="lg:col-span-8 space-y-12">
                <div className="space-y-6">
                  <h2 className="font-headline-md text-headline-md text-legal-navy font-bold">
                    {author.full_name}
                  </h2>
                  <div className="font-label-caps text-sm text-prestige-gold tracking-widest border-b border-stone-gray/40 pb-4">
                    {author.title} | Türkiye Barolar Birliği
                  </div>
                  <div
                    className="font-body-lg text-body-lg text-on-surface-variant space-y-6 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: author.bio_long }}
                  />
                </div>

                {/* Certifications & Educations */}
                {certifications && certifications.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="font-headline-sm text-headline-sm text-legal-navy border-b border-stone-gray pb-4 font-bold">
                      Sertifikalar & Eğitimler
                    </h3>
                    <div className="space-y-6">
                      {certifications.map((cert: any) => (
                        <div key={cert.id} className="flex gap-4 items-start group">
                          <div className="w-10 h-10 shrink-0 bg-[#F8F7F4] border border-stone-gray rounded flex items-center justify-center text-prestige-gold group-hover:border-prestige-gold transition-colors">
                            <span className="material-symbols-outlined">workspace_premium</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-legal-navy">{cert.title}</h4>
                            <p className="text-sm text-on-surface-variant">{cert.issuer}</p>
                            {cert.date_obtained && (
                              <span className="text-xs text-stone-gray-600 block mt-1">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-legal-navy py-16 text-center text-white">
        <div className="max-w-xl mx-auto px-gutter space-y-6">
          <h3 className="font-headline-md text-headline-md text-prestige-gold font-bold">
            Hukuki Yardıma mı İhtiyacınız Var?
          </h3>
          <p className="text-stone-gray opacity-80">
            Sorularınız veya randevu talepleriniz için bana ulaşabilirsiniz.
          </p>
          <Link
            href="/iletisim"
            className="inline-block px-10 py-4 bg-prestige-gold text-legal-navy font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm"
          >
            Bana Ulaşın
          </Link>
        </div>
      </section>
    </div>
  );
}
