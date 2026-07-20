import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './config/database.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {}

  async getHomeData() {
    const settings = await this.db.getSettings();
    const profiles = await this.db.getTableData('author_profile');
    const author = profiles[0] || null;
    
    let articles = await this.db.getTableData('articles');
    articles = articles
      .filter(a => a.status === 'published')
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 4);

    const categories = await this.db.getTableData('article_categories');
    
    const articlesWithCategories = articles.map(art => {
      const cats = categories.filter(c => art.category_ids?.includes(c.id) || c.id === art.category_id);
      return {
        ...art,
        category: cats.length > 0 ? cats[0].name : 'Genel',
        categories: cats
      };
    });

    return {
      settings,
      author,
      articles: articlesWithCategories
    };
  }

  async getAboutData() {
    const settings = await this.db.getSettings();
    const profiles = await this.db.getTableData('author_profile');
    const author = profiles[0] || null;
    const certifications = await this.db.getTableData('certifications');
    
    // Sort certifications by display_order
    certifications.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    return {
      settings,
      author,
      certifications
    };
  }

  async getBlogData(query: { search?: string; category?: string; page?: string; sortBy?: string }) {
    const settings = await this.db.getSettings();
    const categories = await this.db.getTableData('article_categories');
    
    const profiles = await this.db.getTableData('author_profile');
    const author = profiles[0] || null;

    let articles = await this.db.getTableData('articles');
    articles = articles.filter(a => a.status === 'published');

    // Search filter
    if (query.search) {
      const s = query.search.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(s) || 
        a.summary.toLowerCase().includes(s) || 
        a.content.toLowerCase().includes(s)
      );
    }

    // Category filter
    let activeCategory = null;
    if (query.category && query.category !== 'all') {
      const cat = categories.find(c => c.slug === query.category || c.id === query.category);
      if (cat) {
        activeCategory = cat;
        articles = articles.filter(a => 
          a.category_id === cat.id || 
          (a.category_ids && a.category_ids.includes(cat.id))
        );
      }
    }

    // Sorting
    const sort = query.sortBy || 'newest';
    if (sort === 'newest') {
      articles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    } else if (sort === 'oldest') {
      articles.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
    } else if (sort === 'popular') {
      articles.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }

    // Pagination
    const pageNum = parseInt(query.page || '1', 10);
    const limit = 6;
    const offset = (pageNum - 1) * limit;
    const totalCount = articles.length;
    const paginatedArticles = articles.slice(offset, offset + limit);
    const totalPages = Math.ceil(totalCount / limit);

    const articlesWithCategories = paginatedArticles.map(art => {
      const cats = categories.filter(c => art.category_ids?.includes(c.id) || c.id === art.category_id);
      return {
        ...art,
        category: cats.length > 0 ? cats[0].name : 'Genel',
        categories: cats
      };
    });

    return {
      settings,
      author,
      articles: articlesWithCategories,
      categories,
      activeCategory,
      search: query.search || '',
      sortBy: sort,
      page: pageNum,
      totalPages,
      totalCount
    };
  }

  async getArticleDetail(slug: string) {
    const settings = await this.db.getSettings();
    const articles = await this.db.getTableData('articles');
    const article = articles.find(a => a.slug === slug && a.status === 'published');

    if (!article) {
      throw new NotFoundException('Makale bulunamadı');
    }

    // Increment view count
    article.view_count = (article.view_count || 0) + 1;
    await this.db.updateTableData('articles', article.id, { view_count: article.view_count });

    const categories = await this.db.getTableData('article_categories');
    const articleCats = categories.filter(c => article.category_ids?.includes(c.id) || c.id === article.category_id);

    const profiles = await this.db.getTableData('author_profile');
    const author = profiles[0] || null;

    // Get 3 related articles (sharing at least one category, excluding current article)
    const currentCategoryIds = article.category_ids || (article.category_id ? [article.category_id] : []);
    const related = articles
      .filter(a => {
        if (a.id === article.id || a.status !== 'published') return false;
        const otherCategoryIds = a.category_ids || (a.category_id ? [a.category_id] : []);
        return currentCategoryIds.some((id: string) => otherCategoryIds.includes(id));
      })
      .slice(0, 3);
    
    const relatedWithCategories = related.map(r => {
      const cats = categories.filter(c => r.category_ids?.includes(c.id) || c.id === r.category_id);
      return {
        ...r,
        category: cats.length > 0 ? cats[0].name : 'Genel',
        categories: cats
      };
    });

    return {
      settings,
      article: {
        ...article,
        category: articleCats.length > 0 ? articleCats[0].name : 'Genel',
        categories: articleCats
      },
      author,
      relatedArticles: relatedWithCategories
    };
  }

  async getContactData() {
    const settings = await this.db.getSettings();
    const profiles = await this.db.getTableData('author_profile');
    const author = profiles[0] || null;
    return { settings, author };
  }

  async submitContact(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    const submission = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject,
      message: data.message,
      status: 'new',
      submitted_at: new Date()
    };
    return await this.db.insertTableData('contact_submissions', submission);
  }

  async getLegalDocument(type: string) {
    const settings = await this.db.getSettings();
    const document = await this.db.getLegalDocument(type);
    
    if (!document) {
      throw new NotFoundException('Yasal belge bulunamadı');
    }

    const profiles = await this.db.getTableData('author_profile');
    const author = profiles[0] || null;

    return {
      settings,
      author,
      document
    };
  }

  async getResourcesData() {
    const settings = await this.db.getSettings();
    const resources = await this.db.getTableData('resources');
    
    // Sort resources by display_order
    resources.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    const profiles = await this.db.getTableData('author_profile');
    const author = profiles[0] || null;

    return {
      settings,
      author,
      resources
    };
  }

  async incrementResourceDownload(id: string) {
    const resource = await this.db.getTableDataById('resources', id);
    if (!resource) {
      throw new NotFoundException('Dosya bulunamadı');
    }
    const download_count = (resource.download_count || 0) + 1;
    await this.db.updateTableData('resources', id, { download_count });
    return resource;
  }

  async trackPageView(data: { url: string; articleId?: string; ip?: string; userAgent?: string; referer?: string; deviceType?: string; browser?: string; os?: string; sessionId?: string }) {
    try {
      const pageView = {
        page_url: data.url,
        article_id: data.articleId || null,
        user_ip: data.ip || '127.0.0.1',
        user_agent: data.userAgent || '',
        referer: data.referer || '',
        device_type: data.deviceType || 'desktop',
        browser: data.browser || 'unknown',
        os: data.os || 'unknown',
        session_id: data.sessionId || 'session-unknown',
        viewed_at: new Date()
      };
      await this.db.insertTableData('page_views', pageView);
    } catch (e) {
      // Don't crash request if analytics tracking fails
      console.error('Analytics pageview track failed', e);
    }
  }
}
