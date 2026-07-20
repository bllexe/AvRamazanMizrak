import { NextResponse } from 'next/server';
import { updateCertification, deleteCertification } from '@/lib/supabase';
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
    const body = await request.json();

    const updates = {
      title: body.title,
      issuer: body.issuer,
      date_obtained: body.date_obtained,
      display_order: parseInt(body.display_order || '0', 10),
    };

    const data = await updateCertification(id, updates);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Update certification API error', error);
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
    await deleteCertification(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete certification API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
