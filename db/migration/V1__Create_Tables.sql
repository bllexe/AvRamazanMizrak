-- Enable uuid generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. ARTICLE CATEGORIES
CREATE TABLE article_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. ARTICLES (Makaleler)
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL, -- 150-character summary
  content TEXT NOT NULL, -- Rich HTML
  image_url TEXT, -- Cover image URL
  category_id UUID REFERENCES article_categories(id) ON DELETE SET NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  view_count INT DEFAULT 0,
  reading_time_minutes INT
);

CREATE INDEX idx_articles_slug ON articles (slug);
CREATE INDEX idx_articles_status ON articles (status);
CREATE INDEX idx_articles_published_at ON articles (published_at DESC);
CREATE INDEX idx_articles_view_count ON articles (view_count DESC);

-- 3. AUTHOR / PROFILE (Avukat Profili)
CREATE TABLE author_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL, -- "Avukat", "Kurumsal Hukuk Uzmanı"
  bar_number TEXT,
  experience_years INT,
  specializations TEXT, -- JSON array of specializations
  image_url TEXT,
  bio_short TEXT, -- Short bio
  bio_long TEXT, -- Detailed bio (rich HTML)
  email TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. CERTIFICATIONS (Sertifikalar / Eğitimler)
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT,
  date_obtained DATE,
  credential_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. CONTACT SUBMISSIONS (İletişim Formları)
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  file_url TEXT, -- Optional uploaded file attachment
  status TEXT DEFAULT 'new', -- 'new', 'read', 'archived'
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_submissions (status);
CREATE INDEX idx_contact_submitted_at ON contact_submissions (submitted_at DESC);

-- 6. LEGAL DOCUMENTS (Yasal Metinler)
CREATE TABLE legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL UNIQUE, -- 'kvkk', 'privacy', 'terms'
  content TEXT NOT NULL, -- Rich HTML
  last_updated TIMESTAMP DEFAULT NOW()
);

-- 7. RESOURCES (İndirilebilir Kaynaklar)
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL, -- Supabase Storage link or local link
  category TEXT NOT NULL, -- 'guide', 'template', 'document'
  file_size INT,
  download_count INT DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_resources_category ON resources (category);

-- 8. PAGE VIEWS (Ziyaretçi Takibi)
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  user_ip TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,
  session_id TEXT,
  viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_page_views_article_id ON page_views (article_id);
CREATE INDEX idx_page_views_viewed_at ON page_views (viewed_at DESC);

-- 9. SESSION ANALYTICS (Oturum İstatistikleri)
CREATE TABLE session_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_ip TEXT,
  country TEXT,
  device_type TEXT,
  browser TEXT,
  entry_page TEXT,
  exit_page TEXT,
  pages_viewed INT DEFAULT 1,
  total_duration_seconds INT DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- 10. SETTINGS (Site Ayarları)
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  type TEXT, -- 'string', 'json', 'boolean', 'number'
  updated_at TIMESTAMP DEFAULT NOW()
);
