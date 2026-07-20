import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    let sessionToken = null;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.session) {
          sessionToken = data.session.access_token;
        }
      } catch (e) {
        console.error('Supabase authentication error', e);
      }
    }

    // Local fallback check
    if (!sessionToken && email === 'admin@avdanisman.com' && password === 'adminpassword') {
      sessionToken = 'local-admin-active';
    }

    if (sessionToken) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'E-posta veya şifre hatalı' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
