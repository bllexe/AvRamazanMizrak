import { Controller, Get, Post, Body, Param, Query, Render, Req, Res, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private getDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private parseBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('safari')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    if (ua.includes('opera')) return 'Opera';
    return 'Other';
  }

  private parseOS(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('macintosh') || ua.includes('mac os')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    return 'Other';
  }

  private getSessionId(req: any, res: any): string {
    let sessionId = req.cookies?.['session_id'];
    if (!sessionId) {
      sessionId = 'sess-' + Math.random().toString(36).substring(2, 15);
      res.cookie('session_id', sessionId, { maxAge: 24 * 60 * 60 * 1000 * 30, httpOnly: true });
    }
    return sessionId;
  }

  private trackRequest(req: any, res: any, articleId?: string) {
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] as string || '';
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    
    this.appService.trackPageView({
      url: req.url,
      articleId,
      ip,
      userAgent,
      referer,
      deviceType: this.getDeviceType(userAgent),
      browser: this.parseBrowser(userAgent),
      os: this.parseOS(userAgent),
      sessionId: this.getSessionId(req, res)
    });
  }

  @Get()
  @Render('pages/home')
  async getHome(@Req() req: any, @Res() res: any) {
    this.trackRequest(req, res);
    return await this.appService.getHomeData();
  }

  @Get('hakkimda')
  @Render('pages/about')
  async getAbout(@Req() req: any, @Res() res: any) {
    this.trackRequest(req, res);
    return await this.appService.getAboutData();
  }

  @Get('makaleler')
  @Render('pages/blog')
  async getBlog(
    @Req() req: any,
    @Res() res: any,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('sortBy') sortBy?: string
  ) {
    this.trackRequest(req, res);
    return await this.appService.getBlogData({ search, category, page, sortBy });
  }

  @Get('makaleler/:slug')
  @Render('pages/blog-detail')
  async getBlogDetail(
    @Param('slug') slug: string,
    @Req() req: any,
    @Res() res: any
  ) {
    const data = await this.appService.getArticleDetail(slug);
    this.trackRequest(req, res, data.article.id);
    return data;
  }

  @Get('iletisim')
  @Render('pages/contact')
  async getContact(@Req() req: any, @Res() res: any) {
    this.trackRequest(req, res);
    return await this.appService.getContactData();
  }

  @Get('kaynaklar')
  @Render('pages/resources')
  async getResources(@Req() req: any, @Res() res: any) {
    this.trackRequest(req, res);
    return await this.appService.getResourcesData();
  }

  @Get('kaynaklar/:id/download')
  async downloadResource(
    @Param('id') id: string,
    @Res() res: any
  ) {
    const resource = await this.appService.incrementResourceDownload(id);
    return res.redirect(resource.file_url);
  }

  @Get('legal/:type')
  @Render('pages/legal')
  async getLegal(
    @Param('type') type: string,
    @Req() req: any,
    @Res() res: any
  ) {
    this.trackRequest(req, res);
    return await this.appService.getLegalDocument(type);
  }

  @Post('api/contact')
  async postContact(
    @Body() body: { name: string; email: string; phone?: string; subject: string; message: string }
  ) {
    await this.appService.submitContact(body);
    return { success: true, message: 'Mesajınız başarıyla iletildi.' };
  }

  @Post('api/analytics/pageview')
  async postPageView(
    @Req() req: any,
    @Res() res: any,
    @Body() body: { url: string; articleId?: string }
  ) {
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] as string || '';
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    await this.appService.trackPageView({
      url: body.url,
      articleId: body.articleId,
      ip,
      userAgent,
      referer,
      deviceType: this.getDeviceType(userAgent),
      browser: this.parseBrowser(userAgent),
      os: this.parseOS(userAgent),
      sessionId: this.getSessionId(req, res)
    });

    return { success: true };
  }
}
