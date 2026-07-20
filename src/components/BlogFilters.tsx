'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogFiltersProps {
  categories: Category[];
}

export default function BlogFilters({ categories }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSortBy = searchParams.get('sortBy') || 'newest';

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const updateParams = (updates: { [key: string]: string | null }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(updates).forEach((key) => {
      const val = updates[key];
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    // Reset page on filter change
    params.set('page', '1');
    router.push(`/makaleler?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter flex flex-col lg:flex-row justify-between gap-6 items-center">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start w-full lg:w-auto">
        <button
          onClick={() => updateParams({ category: null })}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
            currentCategory === 'all'
              ? 'bg-legal-navy text-white border-legal-navy'
              : 'bg-[#F8F7F4] border-stone-gray text-legal-navy hover:border-prestige-gold'
          }`}
        >
          TÜMÜ
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParams({ category: cat.slug })}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
              currentCategory === cat.slug
                ? 'bg-legal-navy text-white border-legal-navy'
                : 'bg-[#F8F7F4] border-stone-gray text-legal-navy hover:border-prestige-gold'
            }`}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
          <input
            type="text"
            placeholder="Makale ara..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F4] border border-stone-gray rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm"
          />
          <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
            search
          </span>
        </form>
        <select
          value={currentSortBy}
          onChange={(e) => updateParams({ sortBy: e.target.value })}
          className="bg-[#F8F7F4] border border-stone-gray rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-prestige-gold outline-none"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="popular">En Popüler</option>
        </select>
      </div>
    </div>
  );
}
