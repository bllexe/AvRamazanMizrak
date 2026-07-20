import React from 'react';
import { getProfile, getSettings } from '@/lib/supabase';
import ContactForm from '@/components/ContactForm';

export const revalidate = 0; // Dynamic rendering

export default async function ContactPage() {
  const author = await getProfile();
  const settings = await getSettings();

  const waNumber = (author?.whatsapp_number || settings?.whatsapp_number || '').replace(/[^0-9]/g, '');

  return (
    <div className="pt-20 flex-1">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-subtle-pattern">
        <div className="max-w-container-max mx-auto px-gutter relative z-10">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-prestige-gold block mb-4">
              BİZE ULAŞIN
            </span>
            <h1 className="font-display-lg text-display-lg text-legal-navy mb-6 font-bold">
              Hukuki Süreçlerinizde Güvenilir Rehberiniz
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Sorularınız, randevu talepleriniz veya hukuki danışmanlık ihtiyaçlarınız için aşağıdaki kanallar veya form üzerinden benimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
        {/* Background office visual detail */}
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block opacity-10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdFMptAbNELibo1aqWndICShCQWU2NEf1FJGgyM7yTzC6SZNLPhdvm0zS1SU-l5hsM242AZ-WCF972rbnsZJlMTuLG1VId6gLiNgq5PJmgPSZY9y6zcB-R72OFotu4OM0aW39WL4FCwOoZF036H-OLbF8D6gp0ccokSMYSWyw2QA5lcST344qgUwhn5Tuo4edtOyRQCdaH-3L1Mt80SfBNMyXBCT8dalcIX5vj0KpUr1gaXrq3-KlysiNe7xETr2DEN7y9bmJp7H4P')`,
            }}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Information */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h2 className="font-headline-md text-headline-md text-legal-navy mb-8 font-bold">
                  İletişim Bilgileri
                </h2>
                <div className="space-y-8">
                  {/* Address */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-stone-gray rounded-lg group-hover:border-prestige-gold transition-colors">
                      <span className="material-symbols-outlined text-prestige-gold">location_on</span>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 font-bold text-xs">
                        ADRES
                      </p>
                      <p className="font-body-md text-body-md text-legal-navy">
                        {settings?.office_address ||
                          author?.office_address ||
                          'Levent Mah. Yasemin Sokak, No:12/4 Beşiktaş, İstanbul'}
                      </p>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-stone-gray rounded-lg group-hover:border-prestige-gold transition-colors">
                      <span className="material-symbols-outlined text-prestige-gold">call</span>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 font-bold text-xs">
                        TELEFON
                      </p>
                      <p className="font-body-md text-body-md text-legal-navy">
                        {author?.phone || '+90 (212) 555 01 01'}
                      </p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-stone-gray rounded-lg group-hover:border-prestige-gold transition-colors">
                      <span className="material-symbols-outlined text-prestige-gold">mail</span>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 font-bold text-xs">
                        E-POSTA
                      </p>
                      <p className="font-body-md text-body-md text-legal-navy">
                        {author?.email || 'iletisim@avdanisman.com'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Action */}
              {waNumber && (
                <div className="p-8 bg-legal-navy rounded-xl text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="font-headline-sm text-headline-sm mb-4 font-bold">Hızlı İletişim</h3>
                    <p className="font-body-md text-body-md opacity-80 mb-6">
                      WhatsApp üzerinden anlık bilgi alabilir veya hızlıca randevu oluşturabilirsiniz.
                    </p>
                    <a
                      className="inline-flex items-center gap-2 bg-prestige-gold text-legal-navy px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-xl"
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        chat
                      </span>
                      WhatsApp ile Mesaj Gönder
                    </a>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-prestige-gold opacity-10 rounded-full blur-3xl" />
                </div>
              )}
            </div>

            {/* Right: Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
