import { NextResponse } from 'next/server';
import { createResource, uploadFileToSupabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
    const content = (formData.get('content') as string) || '';
    const description = (formData.get('description') as string) || '';
    const file = formData.get('file') as File | null;

    let file_url = '';
    let file_size = 0;

    // Check if there is a file uploaded
    if (file && file.size > 0 && file.name !== 'undefined') {
      try {
        file_url = await uploadFileToSupabase(file, 'resources');
        file_size = file.size;
      } catch (uploadErr: any) {
        console.error('File upload failed', uploadErr);
        return NextResponse.json({ success: false, error: `Dosya yükleme hatası: ${uploadErr.message}` }, { status: 500 });
      }
    }

    const newRes = {
      title,
      category,
      display_order,
      description,
      content: file_url ? '' : content, // Empty content if it is a downloadable file
      file_url,
      file_size,
      download_count: 0,
    };

    const data = await createResource(newRes);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Create resource API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
