import React from 'react';
import { Metadata } from 'next';
import { getProfile, getCertifications } from '@/lib/supabase';
import AboutCardsView from '@/components/AboutCardsView';

export const revalidate = 0; // Dynamic rendering

export const metadata: Metadata = {
  title: 'Hakkımda | Avukat Ramazan Mızrak',
  description:
    'Avukat Ramazan Mızrak özgeçmişi, hukuki vizyonu, uzmanlık alanları, eğitim geçmişi ve sertifikaları hakkında detaylı bilgi edinin.',
};

export default async function AboutPage() {
  const author = await getProfile();
  const certifications = await getCertifications();

  return <AboutCardsView author={author} certifications={certifications} />;
}

