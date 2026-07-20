import { NextResponse } from 'next/server';
import { updateCategory, deleteCategory } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;
    const body = await request.json();
    const slug = body.slug ? slugify(body.slug) : slugify(body.name);

    const updates = {
      name: body.name,
      slug,
      description: body.description || '',
      order_index: parseInt(body.order_index || '0', 10),
    };

    const data = await updateCategory(id, updates);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Update category API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete category API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
