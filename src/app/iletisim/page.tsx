import React from 'react';
import { getProfile, getSettings } from '@/lib/supabase';
import ContactForm from '@/components/ContactForm';

export const revalidate = 0; // Dynamic rendering

export default async function ContactPage() {
  const author = await getProfile();
  const settings = await getSettings();

  const defaultAddress = 'Fabrika Mah. Elazığ Cad. 777. Sk. No:189, Granada Plaza Kat:3 No:17 Yenişehir / DİYARBAKIR';

  const waNumber = (author?.whatsapp_number || settings?.whatsapp_number || '').replace(/[^0-9]/g, '');

  return (
    <div className="pt-24 pb-20 bg-[#F8F7F4] dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-800 border-b border-stone-gray/60 dark:border-slate-700/60 py-12 transition-colors duration-300">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="max-w-3xl">
            <span className="font-label-caps text-xs text-prestige-gold block mb-2 font-bold tracking-widest uppercase">
              İLETİŞİM VE RANDEVU
            </span>
            <h1 className="font-display-lg text-3xl md:text-4xl text-legal-navy dark:text-slate-100 mb-4 font-bold transition-colors">
              Hukuki Süreçlerinizde Güvenilir Rehberiniz
            </h1>
            <p className="font-body-lg text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed transition-colors">
              Sorularınız, randevu talepleriniz veya hukuki danışmanlık ihtiyaçlarınız için aşağıdaki kanallar, harita konumu veya iletişim formu üzerinden doğrudan ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Content Section */}
      <section className="py-12">
        <div className="max-w-container-max mx-auto px-gutter space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Office Info & Direct Channels */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-stone-gray/70 dark:border-slate-700/70 shadow-md space-y-8 transition-colors duration-300">
                <h2 className="font-headline-md text-2xl text-legal-navy dark:text-slate-100 font-bold border-b border-stone-gray/40 dark:border-slate-700/40 pb-4 transition-colors">
                  İletişim Bilgileri
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4 group items-start">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#F8F7F4] dark:bg-slate-900/50 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl group-hover:border-prestige-gold group-hover:bg-prestige-gold group-hover:text-white text-prestige-gold transition-all">
                      <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div>
                      <p className="font-label-caps text-[11px] text-on-surface-variant dark:text-slate-400 mb-1 font-bold uppercase tracking-wider transition-colors">
                        OFİS ADRESİ
                      </p>
                      <p className="font-body-md text-sm text-legal-navy dark:text-slate-200 font-medium leading-relaxed transition-colors">
                        {defaultAddress}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4 group items-start">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#F8F7F4] dark:bg-slate-900/50 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl group-hover:border-prestige-gold group-hover:bg-prestige-gold group-hover:text-white text-prestige-gold transition-all">
                      <span className="material-symbols-outlined text-2xl">call</span>
                    </div>
                    <div>
                      <p className="font-label-caps text-[11px] text-on-surface-variant dark:text-slate-400 mb-1 font-bold uppercase tracking-wider transition-colors">
                        TELEFON
                      </p>
                      <a
                        href={`tel:${author?.phone || settings?.phone || ''}`}
                        className="font-body-md text-sm text-legal-navy dark:text-slate-200 font-bold hover:text-prestige-gold transition-colors block"
                      >
                        {author?.phone || settings?.phone || '+90 (412) 000 00 00'}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 group items-start">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#F8F7F4] dark:bg-slate-900/50 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl group-hover:border-prestige-gold group-hover:bg-prestige-gold group-hover:text-white text-prestige-gold transition-all">
                      <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <div>
                      <p className="font-label-caps text-[11px] text-on-surface-variant dark:text-slate-400 mb-1 font-bold uppercase tracking-wider transition-colors">
                        E-POSTA
                      </p>
                      <a
                        href={`mailto:${author?.email || settings?.email || ''}`}
                        className="font-body-md text-sm text-legal-navy dark:text-slate-200 font-bold hover:text-prestige-gold transition-colors block"
                      >
                        {author?.email || settings?.email || ''}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Action Box */}
              {waNumber && (
                <div className="p-8 bg-legal-navy rounded-2xl text-white relative overflow-hidden shadow-xl border border-legal-navy">
                  <div className="relative z-10 space-y-4">
                    <span className="px-3 py-1 bg-prestige-gold/20 text-prestige-gold border border-prestige-gold/40 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">
                      Anlık İletişim Hattı
                    </span>
                    <h3 className="font-headline-sm text-xl font-bold">WhatsApp İle Hızlı Ulaşın</h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Sorularınız ve randevu talepleriniz için doğrudan WhatsApp hattımızdan mesaj iletebilirsiniz.
                    </p>
                    <a
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-lg"
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="material-symbols-outlined text-lg">chat</span>
                      WhatsApp İle Mesaj Gönder
                    </a>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-prestige-gold opacity-10 rounded-full blur-3xl" />
                </div>
              )}
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>

          {/* Interactive Google Map Section */}
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-stone-gray/70 dark:border-slate-700/70 shadow-md space-y-4 transition-colors duration-300">
            <div className="flex items-center gap-3 border-b border-stone-gray/40 dark:border-slate-700/40 pb-4">
              <span className="material-symbols-outlined text-prestige-gold text-3xl">map</span>
              <div>
                <h3 className="font-headline-md text-xl text-legal-navy dark:text-slate-100 font-bold transition-colors">Ofis Konumu</h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 transition-colors">
                  Diyarbakır Yenişehir Ofis Adresi — Granada Plaza
                </p>
              </div>
            </div>

            <div className="w-full h-[450px] rounded-xl overflow-hidden border border-stone-gray/60 dark:border-slate-700/60 shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d461.34187842224367!2d40.179801316204774!3d37.96248620780229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDU3JzQ1LjciTiA0MMKwMTAnNDcuMSJF!5e0!3m2!1str!2str!4v1784575285162!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ofis Konumu - Av. Ramazan Mızrak"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
