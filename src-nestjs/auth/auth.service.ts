import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  async validateAndGetSession(email: string, pass: string): Promise<string | null> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });

        if (!error && data && data.session) {
          return data.session.access_token;
        }
      } catch (e) {
        console.error('Supabase authentication error', e);
      }
    }

    // Local fallback credential
    if (email === 'admin@avdanisman.com' && pass === 'adminpassword') {
      return 'local-admin-active';
    }

    return null;
  }
}
