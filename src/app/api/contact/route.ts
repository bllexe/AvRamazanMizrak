import { NextResponse } from 'next/server';
import { submitContact } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await submitContact({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
    });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Contact submission API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
