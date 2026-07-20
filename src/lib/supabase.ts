import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Parse specializations string in author profile
function parseAuthorProfile(row: any) {
  if (!row) return row;
  const parsed = { ...row };
  if (typeof parsed.specializations === 'string') {
    try {
      parsed.specializations = JSON.parse(parsed.specializations);
    } catch (e) {
      parsed.specializations = [];
    }
  }
  if (!Array.isArray(parsed.specializations)) {
    parsed.specializations = [];
  }
  return parsed;
}

// Public queries
export async function getSettings() {
  if (!supabase) return {};
  const { data, error } = await supabase.from('settings').select('*');
  if (error) return {};
  const config: { [key: string]: string } = {};
  data.forEach((r: any) => {
    config[r.key] = r.value;
  });
  return config;
}

export async function getProfile() {
  if (!supabase) return null;
  const { data, error } = await supabase.from('author_profile').select('*');
  if (error || !data || data.length === 0) return null;
  return parseAuthorProfile(data[0]);
}

export async function getCertifications() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order', { ascending: true });
  return error ? [] : data || [];
}

export async function getCategories() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('article_categories')
    .select('*')
    .order('order_index', { ascending: true });
  return error ? [] : data || [];
}

export async function getArticles() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('articles')
    .select('*');
  return error ? [] : data || [];
}

export async function getLegalDocument(type: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('legal_documents')
    .select('*')
    .eq('type', type)
    .single();
  return error ? null : data || null;
}

export async function updateLegalDocument(type: string, content: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('legal_documents')
    .upsert({ type, content, last_updated: new Date() }, { onConflict: 'type' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getResources() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('display_order', { ascending: true });
  return error ? [] : data || [];
}

export async function submitContact(contact: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  if (!supabase) return null;
  const submission = {
    ...contact,
    phone: contact.phone || '',
    status: 'new',
    submitted_at: new Date(),
  };
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([submission])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function trackPageView(data: {
  url: string;
  articleId?: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  sessionId?: string;
}) {
  if (!supabase) return;
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
      viewed_at: new Date(),
    };
    await supabase.from('page_views').insert([pageView]);
  } catch (e) {
    console.error('Analytics pageview track failed', e);
  }
}

// Dashboard Queries
export async function getDashboardStats() {
  if (!supabase) {
    return {
      publishedCount: 0,
      newMessagesCount: 0,
      totalViews: 0,
      recentMessages: [],
      recentArticles: [],
      chartData: [],
    };
  }

  const { data: articles } = await supabase.from('articles').select('*');
  const { data: messages } = await supabase.from('contact_submissions').select('*');
  const { data: pageViews } = await supabase.from('page_views').select('*');
  const { data: categories } = await supabase.from('article_categories').select('*');

  const articlesArr = articles || [];
  const messagesArr = messages || [];
  const pageViewsArr = pageViews || [];
  const categoriesArr = categories || [];

  const publishedCount = articlesArr.filter((a: any) => a.status === 'published').length;
  const newMessagesCount = messagesArr.filter((m: any) => m.status === 'new').length;
  const totalViews = articlesArr.reduce((sum: number, art: any) => sum + (art.view_count || 0), 0);

  // Last 5 messages
  const recentMessages = [...messagesArr]
    .sort((a: any, b: any) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5);

  // Last 5 articles
  const recentArticles = [...articlesArr]
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((art: any) => {
      const cat = categoriesArr.find((c: any) => c.id === art.category_id);
      return {
        ...art,
        categoryName: cat ? cat.name : 'Genel',
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

  pageViewsArr.forEach((pv: any) => {
    const date = new Date(pv.viewed_at);
    const dayName = daysOfWeek[date.getDay()];
    if (dailyViews[dayName] !== undefined) {
      dailyViews[dayName]++;
    }
  });

  const chartData = Object.keys(dailyViews).map((key) => ({
    day: key,
    views: dailyViews[key],
  }));

  return {
    publishedCount,
    newMessagesCount,
    totalViews,
    recentMessages,
    recentArticles,
    chartData,
  };
}

// Categories CRUD
export async function createCategory(cat: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('article_categories').insert([cat]).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('article_categories').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  if (!supabase) return null;
  const { error } = await supabase.from('article_categories').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Resources CRUD
export async function createResource(res: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('resources').insert([res]).select().single();
  if (error) throw error;
  return data;
}

export async function updateResource(id: string, updates: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('resources').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteResource(id: string) {
  if (!supabase) return null;
  const { error } = await supabase.from('resources').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Articles CRUD
export async function createArticle(art: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('articles').insert([art]).select().single();
  if (error) throw error;
  return data;
}

export async function updateArticle(id: string, updates: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteArticle(id: string) {
  if (!supabase) return null;
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Messages CRUD
export async function getMessages() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });
  return error ? [] : data || [];
}

export async function updateMessageStatus(id: string, status: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('contact_submissions').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMessage(id: string) {
  if (!supabase) return null;
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Profile CRUD
export async function updateProfile(id: string, updates: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('author_profile').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Certifications CRUD
export async function createCertification(cert: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('certifications').insert([cert]).select().single();
  if (error) throw error;
  return data;
}

export async function updateCertification(id: string, updates: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('certifications').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCertification(id: string) {
  if (!supabase) return null;
  const { error } = await supabase.from('certifications').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Settings CRUD
export async function updateSettings(settingsMap: { [key: string]: string }) {
  if (!supabase) return false;
  const { data: rows, error: getErr } = await supabase.from('settings').select('*');
  if (getErr) throw getErr;

  for (const key of Object.keys(settingsMap)) {
    const row = rows?.find((r: any) => r.key === key);
    if (row) {
      await supabase.from('settings').update({ value: settingsMap[key] }).eq('id', row.id);
    } else {
      await supabase.from('settings').insert([{ key, value: settingsMap[key], type: 'string' }]);
    }
  }
  return true;
}

// Storage File Upload helper
export async function uploadFileToSupabase(file: File, bucketName: string = 'resources'): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  // Ensure the bucket exists or list it
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (buckets && !buckets.find((b) => b.id === bucketName)) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
      });
    }
  } catch (err) {
    console.error(`Failed to verify bucket: ${bucketName}`, err);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileExt = file.name.split('.').pop() || '';
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage upload error: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}


