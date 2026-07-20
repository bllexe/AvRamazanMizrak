import { NextResponse } from 'next/server';
import { createCategory } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

// Helper to slugify category names
function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i',
    'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
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

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body.slug ? slugify(body.slug) : slugify(body.name);

    const newCat = {
      name: body.name,
      slug,
      description: body.description || '',
      order_index: parseInt(body.order_index || '0', 10),
    };

    const data = await createCategory(newCat);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Create category API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
