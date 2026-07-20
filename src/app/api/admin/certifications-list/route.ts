import { NextResponse } from 'next/server';
import { getCertifications } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const certifications = await getCertifications();
    return NextResponse.json({ certifications });
  } catch (error: any) {
    console.error('List certifications API error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
