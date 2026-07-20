import { Controller, Get, Post, Body, Param, Req, Res, UseGuards, Render, Redirect, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('admin')
@UseGuards(SupabaseAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Render('admin/dashboard')
  async getDashboard() {
    return await this.adminService.getDashboardStats();
  }

  // --- Articles CRUD ---
  @Get('articles')
  @Render('admin/articles/list')
  async listArticles() {
    const articles = await this.adminService.getArticles();
    return { articles };
  }

  @Get('articles/create')
  @Render('admin/articles/create')
  async showCreateArticle() {
    const categories = await this.adminService.getCategories();
    return { categories };
  }

  @Post('articles/create')
  async createArticle(@Body() body: any, @Res() res: any) {
    await this.adminService.createArticle(body);
    return res.redirect('/admin/articles?toast=article_created');
  }

  @Get('articles/edit/:id')
  @Render('admin/articles/edit')
  async showEditArticle(@Param('id') id: string) {
    const articles = await this.adminService.getArticles();
    const article = articles.find(a => a.id === id);
    const categories = await this.adminService.getCategories();
    return { article, categories };
  }

  @Post('articles/edit/:id')
  async updateArticle(@Param('id') id: string, @Body() body: any, @Res() res: any) {
    await this.adminService.updateArticle(id, body);
    return res.redirect('/admin/articles?toast=article_updated');
  }

  @Post('articles/delete/:id')
  async deleteArticle(@Param('id') id: string, @Res() res: any) {
    await this.adminService.deleteArticle(id);
    return res.redirect('/admin/articles?toast=article_deleted');
  }

  // --- Categories CRUD ---
  @Get('categories')
  @Render('admin/categories')
  async listCategories() {
    const categories = await this.adminService.getCategories();
    return { categories };
  }

  @Post('categories/create')
  async createCategory(@Body() body: any, @Res() res: any) {
    await this.adminService.createCategory(body);
    return res.redirect('/admin/categories?toast=category_created');
  }

  @Post('categories/edit/:id')
  async updateCategory(@Param('id') id: string, @Body() body: any, @Res() res: any) {
    await this.adminService.updateCategory(id, body);
    return res.redirect('/admin/categories?toast=category_updated');
  }

  @Post('categories/delete/:id')
  async deleteCategory(@Param('id') id: string, @Res() res: any) {
    await this.adminService.deleteCategory(id);
    return res.redirect('/admin/categories?toast=category_deleted');
  }

  // --- Messages List ---
  @Get('messages')
  @Render('admin/messages')
  async listMessages() {
    const messages = await this.adminService.getMessages();
    return { messages };
  }

  @Post('messages/:id/read')
  async markMessageRead(@Param('id') id: string, @Res() res: any) {
    await this.adminService.updateMessageStatus(id, 'read');
    return res.redirect('/admin/messages?toast=message_read');
  }

  @Post('messages/delete/:id')
  async deleteMessage(@Param('id') id: string, @Res() res: any) {
    await this.adminService.deleteMessage(id);
    return res.redirect('/admin/messages?toast=message_deleted');
  }

  // --- Profile Settings ---
  @Get('profile')
  @Render('admin/profile')
  async showProfile() {
    const profile = await this.adminService.getProfile();
    const certifications = await this.adminService.getCertifications();
    return { profile, certifications };
  }

  @Post('profile')
  async updateProfile(@Body() body: any, @Res() res: any) {
    const profile = await this.adminService.getProfile();
    if (profile) {
      await this.adminService.updateProfile(profile.id, body);
    }
    return res.redirect('/admin/profile?toast=profile_updated');
  }

  // --- Certifications CRUD ---
  @Post('profile/certifications/create')
  async createCertification(@Body() body: any, @Res() res: any) {
    await this.adminService.createCertification(body);
    return res.redirect('/admin/profile?toast=profile_updated');
  }

  @Post('profile/certifications/edit/:id')
  async updateCertification(@Param('id') id: string, @Body() body: any, @Res() res: any) {
    await this.adminService.updateCertification(id, body);
    return res.redirect('/admin/profile?toast=profile_updated');
  }

  @Post('profile/certifications/delete/:id')
  async deleteCertification(@Param('id') id: string, @Res() res: any) {
    await this.adminService.deleteCertification(id);
    return res.redirect('/admin/profile?toast=profile_updated');
  }

  // --- General Settings ---
  @Get('settings')
  @Render('admin/settings')
  async showSettings() {
    const settings = await this.adminService.getSettings();
    const kvkk = await this.adminService.getLegalDocument('kvkk');
    const privacy = await this.adminService.getLegalDocument('privacy');
    const terms = await this.adminService.getLegalDocument('terms');
    return {
      settings,
      kvkk: kvkk?.content || '',
      privacy: privacy?.content || '',
      terms: terms?.content || ''
    };
  }

  @Post('settings')
  async updateSettings(@Body() body: any, @Res() res: any) {
    // Save standard settings
    await this.adminService.updateSettings({
      site_title: body.site_title,
      site_description: body.site_description,
      office_address: body.office_address
    });

    // Save legal documents
    if (body.kvkk !== undefined) {
      await this.adminService.updateLegalDocument('kvkk', body.kvkk);
    }
    if (body.privacy !== undefined) {
      await this.adminService.updateLegalDocument('privacy', body.privacy);
    }
    if (body.terms !== undefined) {
      await this.adminService.updateLegalDocument('terms', body.terms);
    }

    return res.redirect('/admin/settings?toast=settings_updated');
  }

  // --- Resources CRUD ---
  @Get('resources')
  @Render('admin/resources')
  async listResources() {
    const resources = await this.adminService.getResources();
    return { resources };
  }

  @Post('resources/create')
  @UseInterceptors(FileInterceptor('file'))
  async createResource(
    @Body() body: any,
    @UploadedFile() file: any,
    @Res() res: any
  ) {
    if (file) {
      const publicUrl = await this.adminService.uploadFile(file);
      body.file_url = publicUrl;
      body.file_size = file.size;
    } else {
      body.file_url = '';
      body.file_size = 0;
    }
    await this.adminService.createResource(body);
    return res.redirect('/admin/resources?toast=resource_created');
  }

  @Post('resources/edit/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateResource(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: any,
    @Res() res: any
  ) {
    if (file) {
      const publicUrl = await this.adminService.uploadFile(file);
      body.file_url = publicUrl;
      body.file_size = file.size;
    } else {
      body.file_url = body.existing_file_url || '';
      body.file_size = parseInt(body.existing_file_size || '0', 10);
    }
    await this.adminService.updateResource(id, body);
    return res.redirect('/admin/resources?toast=resource_updated');
  }

  @Post('resources/delete/:id')
  async deleteResource(@Param('id') id: string, @Res() res: any) {
    await this.adminService.deleteResource(id);
    return res.redirect('/admin/resources?toast=resource_deleted');
  }
}
