import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database connection missing' }, { status: 500 });
  }

  try {
    const id = params.id;
    const { data: resource, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const updatedCount = (resource.download_count || 0) + 1;
    await supabase
      .from('resources')
      .update({ download_count: updatedCount })
      .eq('id', id);

    if (resource.file_url) {
      // Redirect to download file
      return NextResponse.redirect(new URL(resource.file_url, request.url));
    }

    return NextResponse.json({ success: true, download_count: updatedCount });
  } catch (error: any) {
    console.error('Resource download track error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
