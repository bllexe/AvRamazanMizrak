import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await getMessages();
    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('List messages API error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
