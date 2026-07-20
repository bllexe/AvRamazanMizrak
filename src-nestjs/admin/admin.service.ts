import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../config/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  slugify(text: string): string {
    const trMap: { [key: string]: string } = {
      'ç': 'c', 'Ç': 'c',
      'ğ': 'g', 'Ğ': 'g',
      'ı': 'i', 'I': 'i',
      'İ': 'i',
      'ö': 'o', 'Ö': 'o',
      'ş': 's', 'Ş': 's',
      'ü': 'u', 'Ü': 'u'
    };
    
    let str = text;
    for (const key in trMap) {
      str = str.replace(new RegExp(key, 'g'), trMap[key]);
    }
    
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  async getDashboardStats() {
    const articles = await this.db.getTableData('articles');
    const messages = await this.db.getTableData('contact_submissions');
    const pageViews = await this.db.getTableData('page_views');

    const publishedCount = articles.filter(a => a.status === 'published').length;
    const newMessagesCount = messages.filter(m => m.status === 'new').length;
    const totalViews = articles.reduce((sum, art) => sum + (art.view_count || 0), 0);

    // Last 5 messages
    const recentMessages = [...messages]
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
      .slice(0, 5);

    // Last 5 articles
    const categories = await this.db.getTableData('article_categories');
    const recentArticles = [...articles]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(art => {
        const cat = categories.find(c => c.id === art.category_id);
        return {
          ...art,
          categoryName: cat ? cat.name : 'Genel'
        };
      });

    // Chart analytics (last 7 days pageviews)
    const dailyViews: { [key: string]: number } = {};
    const daysOfWeek = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      dailyViews[dayName] = 0;
    }

    pageViews.forEach(pv => {
      const date = new Date(pv.viewed_at);
      const dayName = daysOfWeek[date.getDay()];
      if (dailyViews[dayName] !== undefined) {
        dailyViews[dayName]++;
      }
    });

    const chartData = Object.keys(dailyViews).map(key => ({
      day: key,
      views: dailyViews[key]
    }));

    return {
      publishedCount,
      newMessagesCount,
      totalViews,
      recentMessages,
      recentArticles,
      chartData
    };
  }

  // Articles CRUD
  async getArticles() {
    const articles = await this.db.getTableData('articles');
    const categories = await this.db.getTableData('article_categories');
    return articles.map(art => {
      const cats = categories.filter(c => art.category_ids?.includes(c.id) || c.id === art.category_id);
      return {
        ...art,
        categoryName: cats.length > 0 ? cats.map(c => c.name).join(', ') : 'Genel',
        categories: cats
      };
    });
  }

  async createArticle(data: any) {
    const slug = data.slug ? this.slugify(data.slug) : this.slugify(data.title);
    const readingTime = Math.ceil((data.content || '').split(/\s+/).length / 200) || 5;

    let categoryIds: string[] = [];
    if (data.category_ids) {
      categoryIds = Array.isArray(data.category_ids) ? data.category_ids : [data.category_ids];
    }

    const newArticle = {
      title: data.title,
      slug,
      summary: data.summary || '',
      content: data.content,
      image_url: data.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5EfIBDVDq5Z453D902zh3KVwnykwh9jNhiQ45I9c06m6KRrU8fNQTqRCfnwgnkoMQLiFSb5ErHP8-1VFHqNUNhYnay-qYmED5gikj7wDelDJ2BIFieEbjqxU2Y-GqH_pepM7of5I5zKeS9cRata996YHYqiQkU2x5FYuAK9ZU-tlRNptkIncYKDVLjb4TDcBftF37k_7okkH-pVxtJtfCLoV-PRMjd1qfeeWCU7v3xlxpSRAxrrCBrrBZtSrMsKIEMXq6ZIezsABb',
      category_id: categoryIds[0] || null,
      category_ids: categoryIds,
      meta_description: data.meta_description || '',
      meta_keywords: data.meta_keywords || '',
      status: data.status || 'draft',
      published_at: data.status === 'published' ? new Date() : null,
      reading_time_minutes: readingTime
    };

    return await this.db.insertTableData('articles', newArticle);
  }

  async updateArticle(id: string, data: any) {
    let categoryIds: string[] = [];
    if (data.category_ids) {
      categoryIds = Array.isArray(data.category_ids) ? data.category_ids : [data.category_ids];
    }

    const updates: any = {
      title: data.title,
      summary: data.summary || '',
      content: data.content,
      category_id: categoryIds[0] || null,
      category_ids: categoryIds,
      meta_description: data.meta_description || '',
      meta_keywords: data.meta_keywords || '',
      status: data.status
    };

    if (data.image_url) {
      updates.image_url = data.image_url;
    }

    if (data.slug) {
      updates.slug = this.slugify(data.slug);
    }

    const current = await this.db.getTableDataById('articles', id);
    if (current && current.status !== 'published' && data.status === 'published') {
      updates.published_at = new Date();
    }

    updates.reading_time_minutes = Math.ceil((data.content || '').split(/\s+/).length / 200) || 5;

    return await this.db.updateTableData('articles', id, updates);
  }

  async deleteArticle(id: string) {
    return await this.db.deleteTableData('articles', id);
  }

  // Categories CRUD
  async getCategories() {
    const categories = await this.db.getTableData('article_categories');
    categories.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    return categories;
  }

  async createCategory(data: any) {
    const slug = data.slug ? this.slugify(data.slug) : this.slugify(data.name);
    const newCat = {
      name: data.name,
      slug,
      description: data.description || '',
      order_index: parseInt(data.order_index || '0', 10)
    };
    return await this.db.insertTableData('article_categories', newCat);
  }

  async updateCategory(id: string, data: any) {
    const updates = {
      name: data.name,
      slug: data.slug ? this.slugify(data.slug) : this.slugify(data.name),
      description: data.description || '',
      order_index: parseInt(data.order_index || '0', 10)
    };
    return await this.db.updateTableData('article_categories', id, updates);
  }

  async deleteCategory(id: string) {
    return await this.db.deleteTableData('article_categories', id);
  }

  // Messages
  async getMessages() {
    const messages = await this.db.getTableData('contact_submissions');
    messages.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    return messages;
  }

  async updateMessageStatus(id: string, status: string) {
    return await this.db.updateTableData('contact_submissions', id, { status });
  }

  async deleteMessage(id: string) {
    return await this.db.deleteTableData('contact_submissions', id);
  }

  // Profile
  async getProfile() {
    const profiles = await this.db.getTableData('author_profile');
    return profiles[0] || null;
  }

  async updateProfile(id: string, data: any) {
    const updates = {
      full_name: data.full_name,
      title: data.title,
      bar_number: data.bar_number,
      experience_years: parseInt(data.experience_years || '0', 10),
      specializations: typeof data.specializations === 'string' ? JSON.parse(data.specializations) : data.specializations,
      bio_short: data.bio_short,
      bio_long: data.bio_long,
      email: data.email,
      phone: data.phone,
      whatsapp_number: data.whatsapp_number,
      linkedin_url: data.linkedin_url,
      twitter_url: data.twitter_url,
      instagram_url: data.instagram_url
    };

    if (data.image_url) {
      (updates as any).image_url = data.image_url;
    }

    return await this.db.updateTableData('author_profile', id, updates);
  }

  // Settings
  async getSettings() {
    return await this.db.getSettings();
  }

  async updateSettings(settingsData: { [key: string]: string }) {
    const rows = await this.db.getTableData('settings');
    for (const key of Object.keys(settingsData)) {
      const row = rows.find(r => r.key === key);
      if (row) {
        await this.db.updateTableData('settings', row.id, { value: settingsData[key] });
      } else {
        await this.db.insertTableData('settings', { key, value: settingsData[key], type: 'string' });
      }
    }
    return true;
  }

  // Resources
  async getResources() {
    const resources = await this.db.getTableData('resources');
    resources.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return resources;
  }

  async uploadFile(file: any) {
    return await this.db.uploadFile(file);
  }

  async createResource(data: any) {
    const row = {
      title: data.title,
      description: data.description || '',
      file_url: data.file_url || '',
      category: data.category,
      file_size: parseInt(data.file_size || '0', 10),
      display_order: parseInt(data.display_order || '0', 10),
      download_count: 0,
      content: data.content || ''
    };
    return await this.db.insertTableData('resources', row);
  }

  async updateResource(id: string, data: any) {
    const updates = {
      title: data.title,
      description: data.description || '',
      file_url: data.file_url || '',
      category: data.category,
      file_size: parseInt(data.file_size || '0', 10),
      display_order: parseInt(data.display_order || '0', 10),
      content: data.content || ''
    };
    return await this.db.updateTableData('resources', id, updates);
  }

  async deleteResource(id: string) {
    return await this.db.deleteTableData('resources', id);
  }

  // Certifications
  async getCertifications() {
    const certifications = await this.db.getTableData('certifications');
    certifications.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return certifications;
  }

  async createCertification(data: any) {
    const row = {
      title: data.title,
      issuer: data.issuer,
      date_obtained: data.date_obtained,
      display_order: parseInt(data.display_order || '0', 10)
    };
    return await this.db.insertTableData('certifications', row);
  }

  async updateCertification(id: string, data: any) {
    const updates = {
      title: data.title,
      issuer: data.issuer,
      date_obtained: data.date_obtained,
      display_order: parseInt(data.display_order || '0', 10)
    };
    return await this.db.updateTableData('certifications', id, updates);
  }

  async deleteCertification(id: string) {
    return await this.db.deleteTableData('certifications', id);
  }

  // Legal Documents
  async getLegalDocument(type: string) {
    return await this.db.getLegalDocument(type);
  }

  async updateLegalDocument(type: string, content: string) {
    return await this.db.updateLegalDocument(type, content);
  }
}
