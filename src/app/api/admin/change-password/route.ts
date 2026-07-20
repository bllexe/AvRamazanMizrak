import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
  }

  if (token === 'local-admin-active') {
    return NextResponse.json(
      { error: 'Yerel geliştirici hesabı (admin@avdanisman.com) şifresi kod üzerinde sabittir, değiştirilemez.' },
      { status: 400 }
    );
  }

  try {
    const { password } = await request.json();
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase ayarları eksik.' }, { status: 500 });
    }

    // Initialize Supabase Client with Service Role Key
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 1. Get user details from the session token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Oturum doğrulanamadı: ' + (userError?.message || 'Kullanıcı bulunamadı.') }, { status: 401 });
    }

    // 2. Use Admin API to update the password for this specific user
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: password,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Change password API error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
