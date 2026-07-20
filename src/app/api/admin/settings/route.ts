import { NextResponse } from 'next/server';
import { updateSettings, updateLegalDocument } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Update key-value settings
    await updateSettings({
      site_title: body.site_title,
      site_description: body.site_description,
      office_address: body.office_address,
    });

    // Update legal documents
    if (body.kvkk !== undefined) {
      await updateLegalDocument('kvkk', body.kvkk);
    }
    if (body.privacy !== undefined) {
      await updateLegalDocument('privacy', body.privacy);
    }
    if (body.terms !== undefined) {
      await updateLegalDocument('terms', body.terms);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update settings API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
