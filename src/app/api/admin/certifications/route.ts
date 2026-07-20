import { NextResponse } from 'next/server';
import { createCertification } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newCert = {
      title: body.title,
      issuer: body.issuer,
      date_obtained: body.date_obtained,
      display_order: parseInt(body.display_order || '0', 10),
    };

    const data = await createCertification(newCert);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Create certification API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
