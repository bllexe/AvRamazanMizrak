import React from 'react';
import { getSettings, getLegalDocument } from '@/lib/supabase';
import AdminSettingsForm from '@/components/AdminSettingsForm';
import AdminPasswordForm from '@/components/AdminPasswordForm';

export const revalidate = 0; // Dynamic rendering

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const kvkkDoc = await getLegalDocument('kvkk');
  const privacyDoc = await getLegalDocument('privacy');
  const termsDoc = await getLegalDocument('terms');

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-stone-gray/40 dark:border-slate-700/40 shrink-0">
        <h2 className="font-headline-md text-2xl text-legal-navy dark:text-slate-100 font-bold">Genel Site Ayarları</h2>
        <p className="text-sm text-on-surface-variant dark:text-slate-400">
          Web sitenizin genel başlık, açıklama, adres, hukuki belgelerini ve yönetici şifrenizi düzenleyin.
        </p>
      </header>

      {/* Form Area */}
      <div className="space-y-8 pb-16">
        <AdminSettingsForm
          initialSettings={settings}
          initialKvkk={kvkkDoc?.content || ''}
          initialPrivacy={privacyDoc?.content || ''}
          initialTerms={termsDoc?.content || ''}
        />

        <AdminPasswordForm />
      </div>
    </div>
  );
}
