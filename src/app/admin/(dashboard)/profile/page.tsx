import React from 'react';
import { getProfile, getCertifications } from '@/lib/supabase';
import AdminProfileForm from '@/components/AdminProfileForm';

export const revalidate = 0; // Dynamic rendering

export default async function AdminProfilePage() {
  const profile = await getProfile();
  const certifications = await getCertifications();

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-stone-gray/40 shrink-0">
        <h2 className="font-headline-md text-2xl text-legal-navy font-bold">
          Avukat Profilini Yönet
        </h2>
        <p className="text-sm text-on-surface-variant">
          Sitenin hakkımda ve anasayfa bölümlerindeki yazar ve sertifika bilgilerini düzenleyin.
        </p>
      </header>

      {/* Form Content */}
      <div className="pb-16">
        <AdminProfileForm initialProfile={profile} initialCertifications={certifications} />
      </div>
    </div>
  );
}
