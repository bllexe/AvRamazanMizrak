import React from 'react';
import { getCategories } from '@/lib/supabase';
import AdminArticleForm from '@/components/AdminArticleForm';

export const revalidate = 0; // Dynamic rendering

export default async function AdminArticleCreatePage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-stone-gray/40 shrink-0">
        <h2 className="font-headline-md text-2xl text-legal-navy font-bold">Yeni Makale Yaz</h2>
        <p className="text-sm text-on-surface-variant">
          Sitenizde yayınlanacak yeni bir hukuki yazı hazırlayın.
        </p>
      </header>

      {/* Form Content */}
      <div className="pb-16">
        <AdminArticleForm categories={categories} mode="create" />
      </div>
    </div>
  );
}
