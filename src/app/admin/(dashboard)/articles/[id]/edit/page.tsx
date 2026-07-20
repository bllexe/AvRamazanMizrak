import React from 'react';
import { notFound } from 'next/navigation';
import { getCategories, getArticles } from '@/lib/supabase';
import AdminArticleForm from '@/components/AdminArticleForm';

export const revalidate = 0; // Dynamic rendering

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function AdminArticleEditPage({ params }: EditPageProps) {
  const categories = await getCategories();
  const rawArticles = await getArticles();
  const article = rawArticles.find((a: any) => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-stone-gray/40 dark:border-slate-700/40 shrink-0">
        <h2 className="font-headline-md text-2xl text-legal-navy dark:text-slate-100 font-bold">Makaleyi Düzenle</h2>
        <p className="text-sm text-on-surface-variant dark:text-slate-400">
          Mevcut makalenizin içeriğini güncelleyin.
        </p>
      </header>

      {/* Form Content */}
      <div className="pb-16">
        <AdminArticleForm categories={categories} initialData={article} mode="edit" />
      </div>
    </div>
  );
}
