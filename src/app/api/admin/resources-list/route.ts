import { NextResponse } from 'next/server';
import { getResources } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resources = await getResources();
    return NextResponse.json({ resources });
  } catch (error: any) {
    console.error('List resources API error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
