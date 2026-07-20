import { NextResponse } from 'next/server';
import { getArticles, getCategories } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articles = await getArticles();
    const categories = await getCategories();

    // Map categories to each article
    const mappedArticles = articles.map((art: any) => {
      const artCatIds = Array.isArray(art.category_ids)
        ? art.category_ids
        : art.category_id
        ? [art.category_id]
        : [];

      const artCats = categories.filter((c: any) => artCatIds.includes(c.id));

      return {
        ...art,
        categories: artCats,
      };
    });

    return NextResponse.json({ articles: mappedArticles, categories });
  } catch (error: any) {
    console.error('List articles API error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
