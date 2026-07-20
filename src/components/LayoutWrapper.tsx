'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
  siteTitle: string;
  author: any;
}

export default function LayoutWrapper({
  children,
  siteTitle,
  author,
}: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1 flex flex-col min-h-screen bg-surface-container-lowest">{children}</main>;
  }

  return (
    <div className="pt-20 flex-1 flex flex-col min-h-screen">
      <Header siteTitle={siteTitle} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer siteTitle={siteTitle} author={author} />
    </div>
  );
}
