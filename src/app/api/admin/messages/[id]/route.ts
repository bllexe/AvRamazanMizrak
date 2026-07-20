import { NextResponse } from 'next/server';
import { updateMessageStatus, deleteMessage } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function PATCH(
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
    const status = body.status || 'read';

    const data = await updateMessageStatus(id, status);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Update message status API error', error);
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
    await deleteMessage(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete message API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
