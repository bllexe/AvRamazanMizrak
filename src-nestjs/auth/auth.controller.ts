import { Controller, Get, Post, Body, Req, Res, Render } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('admin/login')
  @Render('admin/login')
  getLogin() {
    return { error: null };
  }

  @Post('admin/login')
  async login(
    @Body() body: any,
    @Res() res: any
  ) {
    const { email, password } = body;
    const sessionToken = await this.authService.validateAndGetSession(email, password);

    if (sessionToken) {
      res.cookie('admin_session', sessionToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });
      return res.redirect('/admin');
    }

    return res.render('admin/login', { error: 'E-posta veya şifre hatalı.' });
  }

  @Get('admin/logout')
  logout(@Res() res: any) {
    res.clearCookie('admin_session');
    return res.redirect('/admin/login');
  }
}
