import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private supabase: SupabaseClient | null = null;
  private localDbPath = path.join(process.cwd(), 'data', 'local_db.json');
  private isLocalMode = false;

  async onModuleInit() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.logger.log('Successfully connected to Supabase Database');
      } catch (error) {
        this.logger.error('Failed to initialize Supabase. Falling back to local mode.', error);
        this.enableLocalMode();
      }
    } else {
      this.logger.warn('Supabase credentials missing in .env. Falling back to local mode.');
      this.enableLocalMode();
    }
  }

  private enableLocalMode() {
    this.isLocalMode = true;
    const dir = path.dirname(this.localDbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.localDbPath)) {
      this.initializeSeedData();
    } else {
      this.logger.log(`Using existing local database: ${this.localDbPath}`);
    }
  }

  private initializeSeedData() {
    this.logger.log('Initializing local database with seed data...');
    const categories = [
      { id: 'cat-1', name: 'Şirketler Hukuku', slug: 'sirketler-hukuku', description: 'Şirket kuruluşları ve ticari davalar', order_index: 0, created_at: new Date() },
      { id: 'cat-2', name: 'Ceza Hukuku', slug: 'ceza-hukuku', description: 'Ağır ceza ve bilişim suçları', order_index: 1, created_at: new Date() },
      { id: 'cat-3', name: 'Medeni Hukuk', slug: 'medeni-hukuku', description: 'Aile, miras ve mülkiyet hukuku', order_index: 2, created_at: new Date() },
      { id: 'cat-4', name: 'İş Hukuku', slug: 'is-hukuku', description: 'İşçi işveren ilişkileri ve davaları', order_index: 3, created_at: new Date() },
      { id: 'cat-5', name: 'KVKK', slug: 'kvkk', description: 'Kişisel verilerin korunması kanunu', order_index: 4, created_at: new Date() }
    ];

    const articles = [
      {
        id: 'art-1',
        title: 'Yeni Türk Ticaret Kanunu Kapsamında Şirket Kuruluşları',
        slug: 'yeni-turk-ticaret-kanunu-kapsaminda-sirket-kuruluslari',
        summary: '2024 yılında yürürlüğe giren yeni düzenlemelerle birlikte anonim ve limited şirketlerin kuruluş aşamasındaki sermaye gereklilikleri.',
        content: `<h2>Yeni TTK Kapsamında Yapılan Değişiklikler</h2>
        <p>2024 yılı itibarıyla Türk Ticaret Kanunu'nda şirket kuruluşu süreçlerinde önemli güncellemeler yapılmıştır. Özellikle asgari sermaye tutarlarının artırılması, kurumsal ve ticari hayatın güvenliğini sağlama yolunda atılmış büyük bir adımdır.</p>
        <blockquote>"Şirketlerin finansal sürdürülebilirliği açısından, başlangıç sermayelerinin günümüz ekonomik koşullarına uyarlanması elzemdi."</blockquote>
        <h3>Asgari Sermaye Tutarları</h3>
        <p>Yeni düzenlemeye göre limited şirketler için asgari sermaye 50.000 TL'ye, anonim şirketler için ise 250.000 TL'ye çıkarılmıştır. Bu tutarların nakdi kısımlarının tescilden önce ödenmesi usulleri de kolaylaştırılmıştır.</p>
        <p>Ayrıca dijital tescil ve MERSİS entegrasyonu sayesinde kuruluş işlemleri artık çok daha hızlı ve şeffaf bir şekilde tamamlanabilmektedir. Hukuki riskleri minimize etmek için bir uzmana danışmanız tavsiye edilir.</p>`,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5EfIBDVDq5Z453D902zh3KVwnykwh9jNhiQ45I9c06m6KRrU8fNQTqRCfnwgnkoMQLiFSb5ErHP8-1VFHqNUNhYnay-qYmED5gikj7wDelDJ2BIFieEbjqxU2Y-GqH_pepM7of5I5zKeS9cRata996YHYqiQkU2x5FYuAK9ZU-tlRNptkIncYKDVLjb4TDcBftF37k_7okkH-pVxtJtfCLoV-PRMjd1qfeeWCU7v3xlxpSRAxrrCBrrBZtSrMsKIEMXq6ZIezsABb',
        category_id: 'cat-1',
        meta_description: 'Yeni TTK limited ve anonim şirket kuruluş sermayesi ve dijital tescil işlemleri rehberi.',
        meta_keywords: 'şirket kurmak, ttk 2024, asgari sermaye, anonim şirket, limited şirket',
        status: 'published',
        published_at: new Date('2024-03-15T10:00:00Z'),
        created_at: new Date('2024-03-15T10:00:00Z'),
        updated_at: new Date('2024-03-15T10:00:00Z'),
        view_count: 1240,
        reading_time_minutes: 8
      },
      {
        id: 'art-2',
        title: 'Bilişim Suçlarında Dijital Delillerin Toplanması ve Geçerliliği',
        slug: 'bilisim-suclarinda-dijital-delillerin-toplanmasi-ve-gecerliligi',
        summary: 'Yargıtay\'ın güncel içtihatları ışığında, sosyal medya üzerinden işlenen suçlarda ekran görüntülerinin ve log kayıtlarının mahkemelerce delil olarak kabul edilme şartları.',
        content: `<h2>Dijital Delillerin Hukuki Niteliği</h2>
        <p>Bilişim suçlarının soruşturulmasında en kritik aşama, dijital verilerin bütünlüğünün korunarak delil olarak sunulmasıdır. Usulüne uygun toplanmayan dijital veriler, mahkeme aşamasında geçersiz sayılabilmektedir.</p>
        <h3>Yargıtay İçtihatları ve Ekran Görüntüleri</h3>
        <p>Yargıtay kararlarına göre sadece ekran görüntüsü (screenshot) sunmak çoğu zaman yeterli olmamakta, bu verilerin sunucu kayıtları (loglar) ve hash değerleriyle desteklenmesi gerekmektedir. Aksi halde delil üzerinde oynama yapıldığı iddiası dosyayı zedeleyebilir.</p>`,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByXbfAbi1wJm-zGl0GlC4MeEkI1OMNbfST2USRfUED1FSLdjp--g4spPFHldQzb5b5GaMVhrvg0JS_D8SBG_voHbAkkQzJUjWnQFTXAF-_xb0gsEsl28Rra05wDR8Isn390N2TxBfVDSlHNLU6dzZZgfeXD6wW9a_XJXl9i02DeB6qDjp5eOLZvM-b9-BMZ47-tHkcNyTFRiyy05u4dzaOXfC7aZ_z2c5dnXF74wsGyHrZ9uo7HUPBuxdpUb0WpAQg3bbWHRLk-0I1',
        category_id: 'cat-2',
        meta_description: 'Sosyal medya suçlarında ve bilişim hukuku davalarında dijital delil toplama esasları.',
        meta_keywords: 'dijital delil, log kaydı, whatsapp delil, bilişim suçları',
        status: 'published',
        published_at: new Date('2024-03-10T11:30:00Z'),
        created_at: new Date('2024-03-10T11:30:00Z'),
        updated_at: new Date('2024-03-10T11:30:00Z'),
        view_count: 892,
        reading_time_minutes: 12
      },
      {
        id: 'art-3',
        title: 'Miras Hukukunda Saklı Paylı Mirasçıların Hakları',
        slug: 'miras-hukukunda-sakli-payli-mirascilarin-haklari',
        summary: 'Vasiyetname düzenlenirken dikkat edilmesi gereken saklı pay oranları ve tenkis davası açma süreçleri hakkında kapsamlı bir rehber.',
        content: `<h2>Saklı Pay Nedir?</h2>
        <p>Mirasbırakanın vasiyetname ile dilediği gibi tasarruf edemediği, mirasçıların kanunen korunan payına saklı pay denir. Saklı paylı mirasçılar; altsoy (çocuklar, torunlar), ana-baba ve sağ kalan eştir.</p>
        <h3>Tenkis Davası</h3>
        <p>Saklı payları ihlal edilen mirasçılar, mirasbırakanın ölümünden sonra tenkis davası açarak yasal haklarını talep edebilirler. Bu davada süre sınırları ve hesaplama yöntemleri son derece detaylıdır.</p>`,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSfBOwK7Q7Ode-O577FWgo2t0dlfcvdeQS120ezKCQ-XT6vEMAj3IrgeY-dB9daVNoN0IW1n1-JWtXmTgZ0LE5yvr0XbjmqrKo62FTOjaU4VkXx1hAPBH5uPR-tkXXKyqGWNn4Hv_cYDQ23DsUW62OGK9RgFmkSqdU79maHOOWVIaBlMsP52iYHo5mwMTYyCNHGDMp3dnYYcPxt-Uo3-IzfViuWTFirR1qt6h3WjV4ExPr4tlu5LOVupceZzfHNE3BEHrAG1RUgeMO',
        category_id: 'cat-3',
        meta_description: 'Miras taksiminde saklı pay hesapları, tenkis davası şartları ve mirasçı hakları.',
        meta_keywords: 'saklı pay, miras hakkı, tenkis davası, vasiyetname',
        status: 'published',
        published_at: new Date('2024-03-05T09:00:00Z'),
        created_at: new Date('2024-03-05T09:00:00Z'),
        updated_at: new Date('2024-03-05T09:00:00Z'),
        view_count: 3120,
        reading_time_minutes: 6
      },
      {
        id: 'art-4',
        title: 'Uzaktan Çalışma Modelinde İş Sağlığı ve Güvenliği',
        slug: 'uzaktan-calisma-modelinde-is-sagligi-ve-guvenligi',
        summary: 'Pandemi sonrası kalıcı hale gelen uzaktan çalışma düzeninde işverenlerin sorumlulukları ve çalışan haklarının hukuki sınırları.',
        content: `<h2>Uzaktan Çalışmada İşverenin Sorumluluğu</h2>
        <p>Uzaktan veya hibrit çalışma modelleri, iş sağlığı ve güvenliği (İSG) mevzuatı açısından yeni soru işaretleri doğurmuştur. İşçinin evinde geçirdiği kazaların iş kazası sayılıp sayılmayacağı tartışmalıdır.</p>
        <h3>İSG Eğitimleri ve Ekipman</h3>
        <p>İşverenler, uzaktan çalışan işçilerine de gerekli İSG eğitimlerini vermek ve ergonomik çalışma ortamını sağlamakla yükümlüdür. İş kazası risklerini azaltmak için iş sözleşmelerine özel maddeler eklenmelidir.</p>`,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARH_iuaH5hN9SQz5fUkYF4P57Xs_Rm2BEok3LFdk8Vj35UtAfCcPshFo5EV12Xh-c06HRjL26neJG8gmF35bFTavirygcPuyiomjgogx1GrILek2iWFeWK8T34USDVaSZssgH815-3ljflsNzKh_pMGGY6M-CEzuBwu5sts2hTABe_nXV1Kl4qy0hVG9nUnTDKKUdasul10pDB5yrNgiU05E1mkOBMODbnHiJ9H-AAeSnUH5iSCt4cHWrxvRuvLEekw8nrFjnft-M0',
        category_id: 'cat-4',
        meta_description: 'Evden ve uzaktan çalışmada iş kazaları, İSG sorumlulukları ve yasal sınırlar.',
        meta_keywords: 'uzaktan çalışma, iş kazası, İSG, evden çalışma hakları',
        status: 'published',
        published_at: new Date('2024-03-01T15:00:00Z'),
        created_at: new Date('2024-03-01T15:00:00Z'),
        updated_at: new Date('2024-03-01T15:00:00Z'),
        view_count: 512,
        reading_time_minutes: 10
      }
    ];

    const author_profile = {
      id: 'author-1',
      full_name: 'Selim Aras Danışman',
      title: 'Kıdemli Hukuk Danışmanı / Avukat',
      bar_number: '42159',
      experience_years: 15,
      specializations: ['Şirketler Hukuku', 'Ceza Hukuku', 'Medeni Hukuk', 'Bilişim Hukuku'],
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChVl5a454Jk0TPnA_w0bwK3LmPRaBTtVLQl5CrAxQ2CqmAKCvAJce-bBGEANefScxYruSov0GX7GI_VB_wZHnaghktSmQRHht5me-2jfYdg0ufTHpc2ks4Vd6JCod9gooVFGNn9y6GwLFQZ5v3mLCnqfBxRgBHM16AU0vOy9W56stP-y8RT0Gkzxb_S92s-A2Xi7M8tNt8ARWFkytoEAUnewr8MZ8UlCOEeM4YV0DYY5telyR7Glf_6I-nGU4pOxTIfaSUAe2LsqJP',
      bio_short: 'Karmaşık hukuki süreçlerinizi stratejik bir bakış açısıyla yönetiyoruz. 10 yılı aşkın tecrübe ile her vakada mutlak titizlik ve şeffaflık önceliğimizdir.',
      bio_long: '<p>Hukuk kariyerime, adaletin sadece bir kavram değil, toplumsal bir denge unsuru olduğu bilinciyle başladım. Yirmi yılı aşkın süredir, karmaşık hukuki süreçleri müvekkillerim için şeffaf, güvenilir ve stratejik bir düzleme taşıyorum.</p><p>Modern hukukun dinamiklerini, geleneksel etik değerlerle harmanlayarak, her dosyanın kendine özgü hikayesine ve ihtiyacına odaklanıyorum. Uzmanlık alanlarımda edindiğim derin tecrübe, sadece dava kazanmak değil, sürdürülebilir hukuki çözümler üretmek üzerine kuruludur.</p>',
      email: 'iletisim@avdanisman.com',
      phone: '+90 (212) 555 01 01',
      whatsapp_number: '+905550000000',
      linkedin_url: 'https://linkedin.com/in/av-selim-aras',
      twitter_url: 'https://twitter.com/av-selim-aras',
      instagram_url: 'https://instagram.com/av-selim-aras',
      created_at: new Date(),
      updated_at: new Date()
    };

    const certifications = [
      { id: 'cert-1', title: 'Tahkim ve Arabuluculuk Sertifikası', issuer: 'Türkiye Barolar Birliği', date_obtained: '2018-05-10', display_order: 0, created_at: new Date() },
      { id: 'cert-2', title: 'KVKK Uzmanlık Eğitimi', issuer: 'Kişisel Verileri Koruma Kurumu', date_obtained: '2020-11-15', display_order: 1, created_at: new Date() },
      { id: 'cert-3', title: 'Uluslararası Barolar Birliği (IBA) Üyeliği', issuer: 'International Bar Association', date_obtained: '2021-03-01', display_order: 2, created_at: new Date() }
    ];

    const legal_documents = [
      { type: 'kvkk', content: '<h2>KVKK Aydınlatma Metni</h2><p>Bu metin, kişisel verilerinizin işlenmesi hususunda sizleri bilgilendirmek amacıyla hazırlanmıştır. Sitemiz üzerindeki iletişim formunu doldurduğunuzda adınız, e-postanız ve mesajınız veri güvenliği kurallarına uygun şekilde saklanır.</p>', last_updated: new Date() },
      { type: 'privacy', content: '<h2>Gizlilik Politikası</h2><p>Kişisel gizliliğiniz bizim için önemlidir. Bu web sitesinde çerezler kullanıcı deneyimini iyileştirmek amacıyla kullanılmaktadır.</p>', last_updated: new Date() },
      { type: 'terms', content: '<h2>Kullanım Şartları</h2><p>Bu sitede yer alan makaleler ve analizler tamamen genel bilgilendirme amaçlı olup, hukuki tavsiye niteliği taşımamaktadır.</p>', last_updated: new Date() }
    ];

    const resources = [
      { id: 'res-1', title: 'Şirket Kuruluş Kontrol Listesi', description: 'Limited ve Anonim Şirket kurarken gerekli tüm evrak ve adımlar.', file_url: '/uploads/sirket_kurulum_rehberi.pdf', category: 'guide', file_size: 1024 * 350, download_count: 45, display_order: 0, created_at: new Date() },
      { id: 'res-2', title: 'İş Sözleşmesi Taslağı (Uzaktan Çalışma)', description: 'Uzaktan çalışma düzenine uygun standart iş sözleşmesi örneği.', file_url: '/uploads/is_sozlesmesi_taslagi.pdf', category: 'template', file_size: 1024 * 120, download_count: 112, display_order: 1, created_at: new Date() }
    ];

    const settings = [
      { key: 'site_title', value: 'Avukat Selim Aras Danışman | Hukuki Analizler', description: 'Site başlığı', type: 'string', updated_at: new Date() },
      { key: 'site_description', value: 'Miras, Şirketler ve Bilişim Hukuku alanında güncel makale ve analizler.', description: 'Site açıklaması', type: 'string', updated_at: new Date() },
      { key: 'office_address', value: 'Levent Mah. Yasemin Sokak, No:12/4 Beşiktaş, İstanbul', description: 'Ofis Adresi', type: 'string', updated_at: new Date() }
    ];

    const dbData = {
      articles,
      article_categories: categories,
      author_profile: [author_profile],
      certifications,
      contact_submissions: [],
      legal_documents,
      resources,
      page_views: [],
      session_analytics: [],
      settings
    };

    fs.writeFileSync(this.localDbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    this.logger.log(`Initialized local JSON DB with seed data at: ${this.localDbPath}`);
  }

  private readLocalDb(): any {
    const data = fs.readFileSync(this.localDbPath, 'utf-8');
    return JSON.parse(data);
  }

  private writeLocalDb(data: any) {
    fs.writeFileSync(this.localDbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  private parseAuthorProfile(row: any): any {
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

  // --- CRUD API Fallback ---
  async getTableData(table: string): Promise<any[]> {
    if (!this.isLocalMode && this.supabase) {
      const { data, error } = await this.supabase.from(table).select('*');
      if (error) {
        this.logger.error(`Supabase error reading table ${table}`, error);
        throw error;
      }
      let result = data || [];
      if (table === 'author_profile') {
        result = result.map((r: any) => this.parseAuthorProfile(r));
      }
      return result;
    } else {
      const db = this.readLocalDb();
      let result = db[table] || [];
      if (table === 'author_profile') {
        result = result.map((r: any) => this.parseAuthorProfile(r));
      }
      return result;
    }
  }

  async getTableDataById(table: string, id: string): Promise<any | null> {
    if (!this.isLocalMode && this.supabase) {
      const { data, error } = await this.supabase.from(table).select('*').eq('id', id).single();
      if (error) return null;
      return table === 'author_profile' ? this.parseAuthorProfile(data) : data;
    } else {
      const db = this.readLocalDb();
      const rows = db[table] || [];
      const data = rows.find((r: any) => r.id === id) || null;
      return table === 'author_profile' ? this.parseAuthorProfile(data) : data;
    }
  }

  async getTableDataBySlug(table: string, slug: string): Promise<any | null> {
    if (!this.isLocalMode && this.supabase) {
      const { data, error } = await this.supabase.from(table).select('*').eq('slug', slug).single();
      if (error) return null;
      return table === 'author_profile' ? this.parseAuthorProfile(data) : data;
    } else {
      const db = this.readLocalDb();
      const rows = db[table] || [];
      const data = rows.find((r: any) => r.slug === slug) || null;
      return table === 'author_profile' ? this.parseAuthorProfile(data) : data;
    }
  }

  async insertTableData(table: string, row: any): Promise<any> {
    if (!this.isLocalMode && this.supabase) {
      const { data, error } = await this.supabase.from(table).insert([row]).select().single();
      if (error) {
        this.logger.error(`Supabase error inserting into ${table}`, error);
        throw error;
      }
      return table === 'author_profile' ? this.parseAuthorProfile(data) : data;
    } else {
      const db = this.readLocalDb();
      if (!row.id) row.id = randomUUID();
      if (!row.created_at) row.created_at = new Date();
      if (!db[table]) db[table] = [];
      db[table].push(row);
      this.writeLocalDb(db);
      return table === 'author_profile' ? this.parseAuthorProfile(row) : row;
    }
  }

  async updateTableData(table: string, id: string, updates: any): Promise<any> {
    if (!this.isLocalMode && this.supabase) {
      const { data, error } = await this.supabase.from(table).update(updates).eq('id', id).select().single();
      if (error) {
        this.logger.error(`Supabase error updating table ${table}`, error);
        throw error;
      }
      return table === 'author_profile' ? this.parseAuthorProfile(data) : data;
    } else {
      const db = this.readLocalDb();
      const rows = db[table] || [];
      const index = rows.findIndex((r: any) => r.id === id);
      if (index === -1) throw new Error(`Row not found in ${table} with id ${id}`);
      const updatedRow = { ...rows[index], ...updates, updated_at: new Date() };
      rows[index] = updatedRow;
      db[table] = rows;
      this.writeLocalDb(db);
      return table === 'author_profile' ? this.parseAuthorProfile(updatedRow) : updatedRow;
    }
  }

  async updateTableDataBySlug(table: string, slug: string, updates: any): Promise<any> {
    const db = this.readLocalDb();
    const rows = db[table] || [];
    const index = rows.findIndex((r: any) => r.slug === slug);
    if (index === -1) throw new Error(`Row not found in ${table} with slug ${slug}`);
    const updatedRow = { ...rows[index], ...updates, updated_at: new Date() };
    rows[index] = updatedRow;
    db[table] = rows;
    this.writeLocalDb(db);
    return table === 'author_profile' ? this.parseAuthorProfile(updatedRow) : updatedRow;
  }

  async deleteTableData(table: string, id: string): Promise<boolean> {
    if (!this.isLocalMode && this.supabase) {
      const { error } = await this.supabase.from(table).delete().eq('id', id);
      if (error) {
        this.logger.error(`Supabase error deleting from ${table}`, error);
        throw error;
      }
      return true;
    } else {
      const db = this.readLocalDb();
      const rows = db[table] || [];
      const filtered = rows.filter((r: any) => r.id !== id);
      if (filtered.length === rows.length) return false;
      db[table] = filtered;
      this.writeLocalDb(db);
      return true;
    }
  }

  // Specialized methods for Auth, settings, legal
  async getSettings(): Promise<any> {
    const rows = await this.getTableData('settings');
    const config: any = {};
    rows.forEach(r => {
      config[r.key] = r.value;
    });
    return config;
  }

  async getLegalDocument(type: string): Promise<any | null> {
    if (!this.isLocalMode && this.supabase) {
      const { data } = await this.supabase.from('legal_documents').select('*').eq('type', type).single();
      return data || null;
    } else {
      const db = this.readLocalDb();
      return db.legal_documents?.find((d: any) => d.type === type) || null;
    }
  }

  async updateLegalDocument(type: string, content: string): Promise<any> {
    if (!this.isLocalMode && this.supabase) {
      const { data, error } = await this.supabase.from('legal_documents').upsert({ type, content, last_updated: new Date() }, { onConflict: 'type' }).select().single();
      if (error) {
        this.logger.error(`Failed to upsert legal document of type ${type}: ${error.message}`, error.details);
        throw error;
      }
      return data;
    } else {
      const db = this.readLocalDb();
      let doc = db.legal_documents.find((d: any) => d.type === type);
      if (doc) {
        doc.content = content;
        doc.last_updated = new Date();
      } else {
        doc = { type, content, last_updated: new Date() };
        db.legal_documents.push(doc);
      }
      this.writeLocalDb(db);
      return doc;
    }
  }

  async uploadFile(file: any, bucketName: string = 'resources'): Promise<string> {
    if (!this.isLocalMode && this.supabase) {
      try {
        const { data: buckets } = await this.supabase.storage.listBuckets();
        if (buckets && !buckets.find(b => b.id === bucketName)) {
          await this.supabase.storage.createBucket(bucketName, {
            public: true
          });
        }
      } catch (err) {
        this.logger.error(`Failed to ensure bucket ${bucketName}`, err);
      }

      const fileExt = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExt}`;
      const filePath = fileName;

      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        throw new Error(`Supabase Storage upload error: ${error.message}`);
      }

      const { data: publicUrlData } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } else {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExt = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, file.buffer);

      return `/uploads/${fileName}`;
    }
  }
}
