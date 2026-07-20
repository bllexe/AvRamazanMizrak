import { NextResponse } from 'next/server';
import { updateResource, deleteResource, uploadFileToSupabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

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
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
    const content = (formData.get('content') as string) || '';
    const description = (formData.get('description') as string) || '';
    const file = formData.get('file') as File | null;

    let file_url = (formData.get('existing_file_url') as string) || '';
    let file_size = parseInt((formData.get('existing_file_size') as string) || '0', 10);

    // If new file is uploaded
    if (file && file.size > 0 && file.name !== 'undefined') {
      try {
        file_url = await uploadFileToSupabase(file, 'resources');
        file_size = file.size;
      } catch (uploadErr: any) {
        console.error('File upload failed', uploadErr);
        return NextResponse.json({ success: false, error: `Dosya yükleme hatası: ${uploadErr.message}` }, { status: 500 });
      }
    }

    const updates = {
      title,
      category,
      display_order,
      description,
      content: file_url ? '' : content,
      file_url,
      file_size,
    };

    const data = await updateResource(id, updates);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Update resource API error', error);
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
    await deleteResource(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete resource API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
