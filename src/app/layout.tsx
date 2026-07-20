import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { getSettings, getProfile } from '@/lib/supabase';
import LayoutWrapper from '@/components/LayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.site_title || 'Avukat Ramazan Mızrak - Blog',
    description: settings.site_description || 'Hukuki makaleler ve güncel analizler',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const profile = await getProfile();
  const siteTitle = settings.site_title || 'Av. Ramazan Mızrak';

  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <LayoutWrapper siteTitle={siteTitle} author={profile}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
