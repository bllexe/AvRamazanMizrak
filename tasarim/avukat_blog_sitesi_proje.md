# 📝 Avukat Blog Sitesi - Tam Proje Prompt

## 📋 PROJE ÖZETI

Tek avukat tarafından yönetilen, makale/blog odaklı profesyonel web sitesi. Minimum yönetim paneli ile maksimum işlevsellik sağlayan dinamik uygulamayı inşa et.

---

## 🔧 TEKNOLOJI STACK

```
Backend:        Nest.js (Node.js full-stack monolith)
Frontend:       EJS templates + React components (admin)
Database:       Supabase (PostgreSQL)
Storage:        Supabase Storage (resimler, PDF'ler)
Authentication: Supabase Auth (JWT)(supabase auth sistemi ile)
Deployment:     GitHub → Vercel
CSS Framework:  Tailwind CSS
Rich Text:      Tiptap Editor
Grafik:         Recharts
Analytics:      Custom (Supabase)
```

---

## 🎯 GEREKSINIMLER

### A. KULLANICI (Public Website)

#### 1. Anasayfa
- [ ] Hero section (avukat foto, unvan, kısa tanıtım)
- [ ] "Hakkımda" bölümü (kart formatında)
- [ ] Son 4 makale preview (grid layout)
- [ ] "Makalelerim Oku" CTA
- [ ] İletişim formu (modal/inline)
- [ ] WhatsApp floating icon
- [ ] Footer (links, contact info)

#### 2. Profil / Hakkımda Sayfası
- [ ] Profesyonel profil görseli
- [ ] Ad-Soyad ve unvan
- [ ] Baroya kayıt numarası
- [ ] Deneyim yılı ve uzmanlık alanları (Örnek: "10 yıllık kurumsal hukuk avukatı")
- [ ] Detaylı biyografi (rich text)
- [ ] Sertifikalar / Eğitimler (liste)
- [ ] Sosyal medya linkleri (LinkedIn, Twitter, Instagram)
- [ ] İletişim bilgileri

#### 3. Blog / Makaleler Bölümü
- [ ] Makale listesi (modern grid + list view toggle)
  - [ ] Sayfalandırma (8-12 makale/sayfa)
  - [ ] Makale arama (başlık, içerik)
  - [ ] Filtreleme (kategori, tarih aralığı)
  - [ ] Sıralama (En yeni, En eski, En çok okunan)
- [ ] Her makale kartında:
  - [ ] Başlık
  - [ ] Kapak görsel
  - [ ] Kategori etiketi
  - [ ] Yayın tarihi
  - [ ] Okuma süresi ("5 min okuma")
  - [ ] Kısa özet (ilk 150 karakter)
- [ ] Makale detay sayfası:
  - [ ] Başlık
  - [ ] Yayın tarihi
  - [ ] Okuma süresi
  - [ ] Kapak görseli (full width)
  - [ ] Rich text içerik
  - [ ] Sosyal share buttons (WhatsApp, LinkedIn, Twitter, Facebook, Copy Link)
  - [ ] "Kategori" etiketi
  - [ ] İlgili makaleler (3 tane, alt bölümde)
  - [ ] Yazar profil kartı (makale altında)
- [ ] Kategori sayfası (optional)
  - [ ] Kategori filtreleme
  - [ ] Kategori başlığı ve açıklaması

#### 4. İletişim Sayfası
- [ ] İletişim formu
  ```
  - Ad-Soyad
  - Email
  - Telefon
  - Konu (dropdown: Danışmanlık, İş Ortaklığı, Diğer)
  - Mesaj
  - Dosya eki (opsiyonel)
  - KVKK onay checkboxu
  - Gönder butonu
  ```
- [ ] Form validasyonu (client + server)
- [ ] Başarılı gönderim mesajı
- [ ] İletişim bilgileri kartı
  - [ ] Email
  - [ ] Telefon
  - [ ] WhatsApp
  - [ ] Ofis adresi (opsiyonel)
  - [ ] Çalışma saatleri (opsiyonel)
- [ ] Harita (Google Maps - opsiyonel)

#### 5. Yasal Metinler
- [ ] KVKK Aydınlatma Metni (dinamik, PDF indirme)
- [ ] Gizlilik Politikası (dinamik, PDF indirme)
- [ ] Kullanım Şartları (dinamik, PDF indirme)

#### 6. Kaynaklar / İndirmeler
- [ ] Ücretsiz rehber/e-book'lar (PDF)
- [ ] İletişim şablonları
- [ ] Bilgilendirme dosyaları
- [ ] İndirme sayacı
- [ ] Basit kategori listesi

---

### B. ADMIN PANELİ (Basitleştirilmiş)

#### Giriş Sistemi
- [ ] Admin login (email + şifre)
- [ ] JWT authentication (Supabase Auth)
- [ ] Session yönetimi
- [ ] Şifre sıfırlama (email ile)

#### 1. Dashboard (Ana Sayfa)
- [ ] KPI Cards:
  - [ ] Bu ay toplam ziyaretçi
  - [ ] Bugünkü ziyaretçiler
  - [ ] Beklemede olan mesajlar
  - [ ] En çok okunan makale
- [ ] Grafikler:
  - [ ] 30 günlük ziyaretçi trend (Line Chart)
  - [ ] En çok okunan makaleler (Bar Chart)
  - [ ] Trafik kaynakları (Pie Chart)

#### 2. Makale Yönetimi (Ana İş Akışı)
- [ ] Makale listesi tablosu
  - [ ] Başlık
  - [ ] Kategori
  - [ ] Yayın tarihi
  - [ ] Durum (Yayında/Taslak/Arşiv)
  - [ ] Görüntülemeler
  - [ ] Düzenle / Sil butonları
  - [ ] Arama + Filtreleme
  - [ ] Sayfalandırma
- [ ] Makale oluştur / Düzenle
  - [ ] Başlık
  - [ ] Slug (otomatik oluştur + manual düzenleme)
  - [ ] Kategori (dropdown - 5-8 kategori)
  - [ ] Makale kapak görseli (upload)
  - [ ] Rich text editor (Tiptap)
    - [ ] Başlıklar (H1-H3)
    - [ ] Paragraph, Lists, Blockquote
    - [ ] Link, Image, Video embed
    - [ ] Code block (syntax highlighting)
  - [ ] Makale özeti (manual - 150 karakter)
  - [ ] Okuma süresi (otomatik hesapla)
  - [ ] Meta açıklaması (SEO)
  - [ ] Meta anahtar kelimeleri
  - [ ] Yayınla / Taslak olarak kaydet
  - [ ] Yayınlama tarihi seçimi (şimdi veya planlı)
  - [ ] Kategori ekle/düzenleme (admin içinden quick add)
- [ ] Makale silme (soft delete, restore seçeneği)

#### 3. Profil Yönetimi (Hakkımda)
- [ ] Tek form:
  - [ ] Ad-Soyad
  - [ ] Ünvan / Mevkii
  - [ ] Baroya kayıt numarası
  - [ ] Deneyim yılı
  - [ ] Uzmanlık alanları (tag input)
  - [ ] Profil görseli (upload)
  - [ ] Kısa biyografi (rich text)
  - [ ] Detaylı biyografi (rich text)
  - [ ] Email
  - [ ] Telefon
  - [ ] WhatsApp numarası
  - [ ] LinkedIn URL
  - [ ] Twitter URL
  - [ ] Instagram URL
  - [ ] Sertifikalar / Eğitimler (repeater field)
    - [ ] Başlık
    - [ ] İssuer
    - [ ] Tarih

#### 4. İletişim Formu Yönetimi
- [ ] Gelen mesajlar listesi
  - [ ] Tablo: Ad, Email, Konu, Tarih, Durum (Yeni/Okundu/Yanıtlandı)
  - [ ] Arama (ad, email'e)
  - [ ] Filtreleme (durum)
  - [ ] Sayfalandırma
- [ ] Mesaj detay view
  - [ ] Tam içerik
  - [ ] Gönderici bilgileri
  - [ ] Gönderim tarihi
  - [ ] Durum değiştir
  - [ ] Hızlı yanıt gönder (email template)
  - [ ] Sil butonu
- [ ] Toplu işlemler
  - [ ] Seçili mesajları sil
  - [ ] Durum değiştir

#### 5. Yasal Metinler Yönetimi
- [ ] 3 ayrı sayfa (KVKK, Gizlilik, Şartlar):
  - [ ] Rich text editor
  - [ ] Düşen/kaldırılan değişiklikleri göster
  - [ ] Güncelleme tarihi otomatik
  - [ ] PDF oluştur / İndir

#### 6. Kaynaklar / İndirmeler Yönetimi
- [ ] Dosya listesi
  - [ ] Dosya adı
  - [ ] Kategori
  - [ ] Upload tarihi
  - [ ] İndirme sayacı
  - [ ] Sil butonu
- [ ] Dosya upload
  - [ ] Başlık
  - [ ] Kategori (dropdown)
  - [ ] Açıklama (opsiyonel)
  - [ ] PDF/Dosya upload (Supabase)
  - [ ] Sıra düzeni (drag-drop)
- [ ] Kategori yönetimi (inline)

#### 7. Analytics (Basit)
- [ ] Özet istatistikler
  - [ ] Bugün/Hafta/Ay ziyaretçiler
  - [ ] Tarih aralığı seçimi
  - [ ] Export to CSV
- [ ] En çok okunan makaleler (detaylı)
  - [ ] Makale adı
  - [ ] Toplam görüntüleme
  - [ ] Bugünkü görüntüleme
  - [ ] Ortalama okuma süresi
  - [ ] Bounce rate
- [ ] Trafik kaynakları
  - [ ] Direkt
  - [ ] Search (Google, Bing)
  - [ ] Sosyal medya
  - [ ] Referrer
- [ ] Cihaz özeti
  - [ ] Desktop, Mobile, Tablet
  - [ ] Top browsers

#### 8. Ayarlar
- [ ] Site başlığı
- [ ] Site açıklaması
- [ ] Logo/Favicon
- [ ] Sosyal medya URLs
- [ ] Email ayarları
  - [ ] SMTP host
  - [ ] SMTP port
  - [ ] Gönderici email
- [ ] WhatsApp numarası
- [ ] Google Analytics ID (opsiyonel)
- [ ] Cache temizle
- [ ] Backup yönetimi (Supabase)

---

## 📊 DATABASE SCHEMA

### Supabase PostgreSQL Tables

```sql
-- 1. ARTICLES (Makaleler - Ana içerik)
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL, -- 150 karakterlik özet
  content TEXT NOT NULL, -- Rich HTML
  image_url TEXT, -- Kapak görseli
  category_id UUID REFERENCES article_categories(id),
  meta_description TEXT,
  meta_keywords TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  view_count INT DEFAULT 0,
  reading_time_minutes INT, -- Otomatik hesapla
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at DESC),
  INDEX idx_view_count (view_count DESC)
);

CREATE TABLE article_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. AUTHOR / ABOUT (Avukat Profili - Tek kayıt)
CREATE TABLE author_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL, -- "Avukat", "Kurumsal Hukuk Uzmanı"
  bar_number TEXT,
  experience_years INT,
  specializations TEXT, -- JSON array
  image_url TEXT,
  bio_short TEXT, -- Kısa biyografi
  bio_long TEXT, -- Detaylı biyografi (rich HTML)
  email TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. CERTIFICATIONS (Sertifikalar/Eğitimler)
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT,
  date_obtained DATE,
  credential_url TEXT, -- Link to credential
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. CONTACT (İletişim Formu)
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  file_url TEXT, -- Upload edilen dosya (opsiyonel)
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  submitted_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at DESC)
);

-- 5. LEGAL (Yasal Metinler)
CREATE TABLE legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL UNIQUE, -- 'kvkk', 'privacy', 'terms'
  content TEXT NOT NULL, -- Rich HTML
  last_updated TIMESTAMP DEFAULT NOW()
);

-- 6. RESOURCES / DOWNLOADS
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL, -- Supabase Storage
  category TEXT NOT NULL, -- 'guide', 'template', 'document'
  file_size INT,
  download_count INT DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_category (category)
);

-- 7. ANALYTICS (Ziyaretçi Tracking)
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  article_id UUID REFERENCES articles(id),
  user_ip TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,
  session_id TEXT,
  viewed_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_article_id (article_id),
  INDEX idx_viewed_at (viewed_at DESC)
);

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
  total_duration_seconds INT,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- 8. SETTINGS (Site Ayarları)
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  type TEXT, -- 'string', 'json', 'boolean', 'number'
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API ENDPOINTS

### Public Endpoints

#### Articles
```
GET    /api/articles              → (Published articles, paginated, filtered)
GET    /api/articles/:slug        → (Article detail, increment view count)
GET    /api/articles/category/:id → (Articles by category)
GET    /api/categories            → (All article categories)
```

#### Author
```
GET    /api/author                → (Author profile)
```

#### Contact
```
POST   /api/contact               → (Submit form, with file upload)
GET    /api/contact/success       → (Success page message)
```

#### Legal
```
GET    /api/legal/:type           → (KVKK, Privacy, Terms - type: kvkk, privacy, terms)
GET    /api/legal/:type/pdf       → (Download as PDF)
```

#### Resources
```
GET    /api/resources             → (All downloadable resources)
GET    /api/resources/category/:cat → (Resources by category)
GET    /api/resources/:id/download → (Download & increment counter)
```

#### Analytics (Client-side)
```
POST   /api/analytics/pageview    → (Track page view)
POST   /api/analytics/session     → (Track session)
```

### Admin Endpoints (Protected with JWT)

#### Dashboard
```
GET    /api/admin/dashboard       → (KPI cards, graphs)
```

#### Articles
```
GET    /api/admin/articles              → (All articles with filters)
GET    /api/admin/articles/:id          → (Article detail)
POST   /api/admin/articles              → (Create article)
PUT    /api/admin/articles/:id          → (Update article)
DELETE /api/admin/articles/:id          → (Soft delete article)
POST   /api/admin/articles/:id/restore  → (Restore deleted article)
POST   /api/admin/articles/image/upload → (Upload article image)
```

#### Categories
```
GET    /api/admin/categories            → (All categories)
POST   /api/admin/categories            → (Create category)
PUT    /api/admin/categories/:id        → (Update category)
DELETE /api/admin/categories/:id        → (Delete category)
```

#### Author
```
GET    /api/admin/author                → (Author profile)
PUT    /api/admin/author                → (Update author profile)
POST   /api/admin/author/image/upload   → (Upload author image)
```

#### Certifications
```
GET    /api/admin/certifications         → (All certifications)
POST   /api/admin/certifications         → (Add certification)
PUT    /api/admin/certifications/:id     → (Update certification)
DELETE /api/admin/certifications/:id     → (Delete certification)
```

#### Contact
```
GET    /api/admin/contact                → (All contact submissions)
GET    /api/admin/contact/:id            → (Contact detail)
PUT    /api/admin/contact/:id            → (Update status)
DELETE /api/admin/contact/:id            → (Delete submission)
POST   /api/admin/contact/:id/reply      → (Send reply email)
```

#### Legal
```
GET    /api/admin/legal/:type            → (Get legal document)
PUT    /api/admin/legal/:type            → (Update legal document)
```

#### Resources
```
GET    /api/admin/resources              → (All resources)
POST   /api/admin/resources              → (Upload resource)
PUT    /api/admin/resources/:id          → (Update resource)
DELETE /api/admin/resources/:id          → (Delete resource)
```

#### Analytics
```
GET    /api/admin/analytics/summary      → (Daily/weekly/monthly summary)
GET    /api/admin/analytics/articles     → (Article performance)
GET    /api/admin/analytics/traffic      → (Traffic sources)
GET    /api/admin/analytics/devices      → (Device stats)
GET    /api/admin/analytics/export       → (Export as CSV)
```

#### Settings
```
GET    /api/admin/settings               → (All settings)
PUT    /api/admin/settings/:key          → (Update setting)
```

#### Auth
```
POST   /api/auth/login                   → (Login)
POST   /api/auth/logout                  → (Logout)
POST   /api/auth/refresh                 → (Refresh token)
POST   /api/auth/forgot-password         → (Request password reset)
POST   /api/auth/reset-password          → (Reset password with token)
```

---

## 📁 PROJE YAPISI

```
avukat-blog-sitesi/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   │
│   ├── articles/
│   │   ├── articles.module.ts
│   │   ├── articles.service.ts
│   │   ├── articles.controller.ts
│   │   ├── dto/
│   │   │   ├── create-article.dto.ts
│   │   │   └── update-article.dto.ts
│   │   └── entities/
│   │       └── article.entity.ts
│   │
│   ├── categories/
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   ├── categories.controller.ts
│   │   └── dto/
│   │       ├── create-category.dto.ts
│   │       └── update-category.dto.ts
│   │
│   ├── author/
│   │   ├── author.module.ts
│   │   ├── author.service.ts
│   │   ├── author.controller.ts
│   │   └── dto/
│   │       └── update-author.dto.ts
│   │
│   ├── certifications/
│   │   ├── certifications.module.ts
│   │   ├── certifications.service.ts
│   │   ├── certifications.controller.ts
│   │   └── dto/
│   │       ├── create-cert.dto.ts
│   │       └── update-cert.dto.ts
│   │
│   ├── contact/
│   │   ├── contact.module.ts
│   │   ├── contact.service.ts
│   │   ├── contact.controller.ts
│   │   └── dto/
│   │       └── create-contact.dto.ts
│   │
│   ├── legal/
│   │   ├── legal.module.ts
│   │   ├── legal.service.ts
│   │   ├── legal.controller.ts
│   │   └── dto/
│   │       └── update-legal.dto.ts
│   │
│   ├── resources/
│   │   ├── resources.module.ts
│   │   ├── resources.service.ts
│   │   ├── resources.controller.ts
│   │   └── dto/
│   │       └── create-resource.dto.ts
│   │
│   ├── analytics/
│   │   ├── analytics.module.ts
│   │   ├── analytics.service.ts
│   │   ├── analytics.controller.ts
│   │   └── analytics.middleware.ts
│   │
│   ├── settings/
│   │   ├── settings.module.ts
│   │   ├── settings.service.ts
│   │   └── settings.controller.ts
│   │
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── decorators/
│   │       └── public.decorator.ts
│   │
│   └── config/
│       ├── database.config.ts
│       ├── supabase.config.ts
│       └── env.validation.ts
│
├── public/
│   └── uploads/
│
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── pages/
│   │   ├── home.ejs
│   │   ├── about.ejs
│   │   ├── blog.ejs
│   │   ├── blog-detail.ejs
│   │   ├── contact.ejs
│   │   ├── resources.ejs
│   │   ├── legal.ejs
│   │   └── 404.ejs
│   │
│   └── admin/
│       ├── layout.ejs
│       ├── login.ejs
│       ├── dashboard.ejs
│       ├── articles/
│       │   ├── list.ejs
│       │   ├── create.ejs
│       │   └── edit.ejs
│       ├── categories.ejs
│       ├── author.ejs
│       ├── certifications.ejs
│       ├── contact/
│       │   ├── list.ejs
│       │   └── detail.ejs
│       ├── legal.ejs
│       ├── resources.ejs
│       ├── analytics.ejs
│       └── settings.ejs
│
├── .env.example
├── .env.local
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── nest-cli.json
├── tailwind.config.js
└── README.md
```

---

## 🚀 GELIŞTIRME AKIŞI

### 1. Setup
```bash
npm install -g @nestjs/cli

git clone <repo>
cd avukat-blog-sitesi

npm install

cp .env.example .env.local

# Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-secret

npm run migrate

npm run dev
```

### 2. Local Testing
```
Frontend: http://localhost:3000
Admin:    http://localhost:3000/admin
API:      http://localhost:3000/api
```

### 3. Deployment
```bash
git add .
git commit -m "feature: blog"
git push origin main

# Auto-deploy to Vercel
```

---

## 🔐 ORTAM VARIYABLARI

```env
# Database
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=xxxxx
SUPABASE_SERVICE_KEY=xxxxx

# Auth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=3000

# Email (İletişim Formu Yanıtları)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Storage
SUPABASE_STORAGE_BUCKET=files
MAX_FILE_SIZE=10485760  # 10MB

# Analytics
ENABLE_ANALYTICS=true

# Site Config
SITE_TITLE="Avukat Adı - Blog"
SITE_DESCRIPTION="Kurumsal ve medeni hukuk konularında yazılar"
WHATSAPP_NUMBER=+905XXXXXXXXX
```

---

## 📦 KRİTİK NPM PAKETLER

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/jwt": "^12.0.0",
    "@nestjs/passport": "^10.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "ejs": "^3.1.9",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.0",
    "html-to-text": "^9.0.5"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "typescript": "^5.1.0",
    "jest": "^29.5.0"
  }
}
```

---

## 🎨 DİZAYN NOTLARI

- **Renk Şeması:** Modern + Professional (Blue + Accent)
- **Tipografi:** Sans-serif (Inter, Poppins)
- **Layout:** Mobile-first, clean & minimal
- **Blog UI:** Medium/Dev.to tarzı
- **Admin:** Basit, okunabilir dashboard
- **Erişilebilirlik:** WCAG 2.1 AA

---

## ✅ MVP KONTROL LİSTESİ

### Phase 1 (Core)
- [ ] Supabase setup + migrations
- [ ] Auth system (JWT, login/logout)
- [ ] Article CRUD (create/read/update/delete)
- [ ] Article list + detail pages
- [ ] Author profile page
- [ ] Contact form (submit + admin list)
- [ ] Basic dashboard

### Phase 2 (Enhancement)
- [ ] Article categories + filtering
- [ ] Search functionality
- [ ] Social sharing buttons
- [ ] Analytics tracking
- [ ] Legal documents
- [ ] Resources download
- [ ] SEO optimization

### Phase 3 (Polish)
- [ ] Email notifications
- [ ] Article scheduling
- [ ] Comment system (opsiyonel)
- [ ] Newsletter signup (opsiyonel)
- [ ] Related articles
- [ ] Reading time estimation

---

## 🔑 TEMEL FARKLAR (Hukuk Ofisi → Blog Sitesi)

| Özellik | Hukuk Ofisi | Blog Sitesi |
|---------|-------------|-----------|
| İçerik Odağı | Hizmetler (Services) | Makaleler (Articles) |
| Profil | Firma bilgisi | Tek avukat profili |
| Admin Modülleri | 9+ (Kompleks) | 8 (Basit) |
| Hizmet Kategorileri | Dinamik, Çok sayıda | Statik, 5-8 kategori |
| İletişim Amaçları | Müşteri talebi | Okuyucu, İş Ortaklığı |
| Blog Fokus | İkincil | Birincil |
| Analytics | Detaylı | Temel |
| Yönetim Süresi | 2-3 saat/hafta | 1-2 saat/hafta |

---

## 💡 İDEAL KULLANIM SENARYOSU

1. **Haftada 1-2 makale yazılır** (Admin panelinden 15 dakika)
2. **Gelen mesajlar kontrol edilir** (Günde 1-2 kez)
3. **Analytics sekmesi haftalık izlenir** (Haftanın sonunda)
4. **Profil / Sertifikalar yılda 1-2 kez güncellenir**
5. **Yasal metinler yılda kontrol edilir**

---

## 🚨 OPTIMIZASYON NOTLARI

1. **Yazma Ağırlıklı İş:** Tek avukat için yazı yazma en önemli görev
   - Rich editor basit ama güçlü olmalı
   - Taslak otomatik kaydedilmeli
   - Planlı yayımlama özelliği olmalı

2. **Minimal Yönetim:** Admin paneli sadece gerekli alanları içermeli
   - Dashboard basit KPI'lar göstermeli
   - Hızlı erişim (sidebar navigation)

3. **Okuyucu Odaklı:** Public site yazıları ön plana koysun
   - Beautiful article presentation
   - Easy navigation
   - Social sharing
   - Related articles

4. **SEO Hazır:** Blog tarafından SEO hedeflenebilir
   - Meta tags tüm makalelerde
   - Sitemap.xml otomatik
   - Canonical URLs
   - Schema markup

---

## 📞 DESTEK VE BAKIMI

- **Hosting:** Vercel (otomatik scaling, 0 yönetim)
- **Database:** Supabase (otomatik backup)
- **Storage:** Supabase Storage (güvenli dosya depolama)
- **Email:** Gmail SMTP (ücresiz)
- **Analytics:** Custom + Google Analytics (opsiyonel)

Bu yapı tek avukat tarafından **rahatlıkla yönetilebilir** ve **profesyonel görünebilir**.
