'use client';

import React from 'react';

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Bağlantı kopyalandı!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Bağlantı kopyalanamadı.');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-6 py-3 bg-legal-navy dark:bg-prestige-gold hover:bg-opacity-90 dark:hover:bg-opacity-90 text-white dark:text-legal-navy transition-all rounded-lg flex items-center gap-2 font-bold text-sm"
      title="Makaleyi Paylaş"
    >
      <span className="material-symbols-outlined text-[20px]">share</span>
      Paylaş
    </button>
  );
}
