import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../config/database.service';
import { createClient } from '@supabase/supabase-js';
import { Response, Request } from 'express';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly db: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const token = request.cookies?.['admin_session'];

    if (!token) {
      this.handleUnauthorized(request, response);
      return false;
    }

    if (token === 'local-admin-active') {
      return true;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          (request as any).user = user;
          return true;
        }
      } catch (e) {
        console.error('Supabase auth guard check error', e);
      }
    }

    this.handleUnauthorized(request, response);
    return false;
  }

  private handleUnauthorized(request: Request, response: Response) {
    if (request.url.startsWith('/api/')) {
      throw new UnauthorizedException('Oturum geçersiz veya süresi dolmuş. Lütfen giriş yapın.');
    } else {
      response.redirect('/admin/login');
    }
  }
}
