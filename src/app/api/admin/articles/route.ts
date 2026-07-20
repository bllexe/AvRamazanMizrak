import { NextResponse } from 'next/server';
import { createArticle } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i',
    'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  };

  let str = text;
  for (const key in trMap) {
    str = str.replace(new RegExp(key, 'g'), trMap[key]);
  }

  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const cleanText = text.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const noOfWords = cleanText.split(/\s+/).filter(Boolean).length;
  return Math.ceil(noOfWords / wordsPerMinute) || 1;
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const title = body.title;
    const content = body.content;
    const summary = body.summary;
    const status = body.status || 'draft';
    const category_ids = body.category_ids || [];
    const meta_description = body.meta_description || '';
    const meta_keywords = body.meta_keywords || '';

    const slug = slugify(title);
    const reading_time_minutes = calculateReadingTime(content);

    const newArticle = {
      title,
      slug,
      summary,
      content,
      status,
      category_ids,
      category_id: category_ids[0] || null, // Fallback for single category_id structures
      meta_description,
      meta_keywords,
      view_count: 0,
      reading_time_minutes,
      created_at: new Date(),
      updated_at: new Date(),
      published_at: status === 'published' ? new Date() : null,
    };

    const data = await createArticle(newArticle);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Create article API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
