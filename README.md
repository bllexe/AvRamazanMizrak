# Av. Ramazan Hoca - Web Sitesi & Yönetim Paneli

Avukat Ramazan Hoca için özel olarak tasarlanmış, modern ve premium arayüze sahip, yönetim panelli avukat blog ve kurumsal tanıtım web sitesi.

---

## 🚀 Özellikler

### Ziyaretçi Arayüzü (Frontend)
- **Ana Sayfa**: Prestijli ve dinamik bento/ızgara düzeninde tasarlanmış giriş alanı, avukat bilgileri ve güncel yasal makalelerin yatay kaydırıcı (slider) ile sunumu.
- **Hakkımda**: Eğitim, sertifika ve mesleki uzmanlık alanlarının kronolojik ve şık bir şekilde listelenmesi.
- **Makaleler**: Kategorilere göre filtrelenebilen, okuma süreli, ilgili makalelerle zenginleştirilmiş blog sistemi.
- **Kaynaklar**: Müvekkillerin faydalanabileceği indirilebilir yasal doküman ve rehberler.
- **İletişim**: Randevu ve danışmanlık talepleri için dinamik iletişim formu.
- **Legal Belgeler**: KVKK Aydınlatma Metni, Gizlilik Politikası ve Kullanım Koşulları sayfaları.

### Yönetim Paneli (Admin Panel)
- **Özet Ekranı (Dashboard)**: Toplam okunma sayıları, gelen mesajlar ve sistem analiz grafiği.
- **Makale Yönetimi**: Çoklu kategori seçimi, zengin metin editörü (CKEditor) entegrasyonu, yayınlama/taslak durumları.
- **Kategori Yönetimi**: Makalelerin sınıflandırılması için CRUD işlemleri.
- **Kaynaklar (Yasal Belgeler)**: Supabase Storage entegrasyonu ile doküman yükleme (Info balonları ve 10MB limit uyarıları ile).
- **Profil Yönetimi**: Unvan, baro sicil no, biyografi, eğitim ve sertifikaların dinamik güncellenmesi.
- **Site Ayarları**: İletişim bilgileri, sosyal medya hesapları (Twitter, Instagram, LinkedIn resmi ikonları ile) ve KVKK/Gizlilik metinlerinin veritabanından dinamik kontrolü.
- **Mesaj Yönetimi**: İletişim formundan gelen mesajların okunması, durum güncellenmesi ve silinmesi.

---

## 🛠️ Teknoloji Yığını

- **Backend**: NestJS (TypeScript)
- **Frontend / Template Engine**: EJS (Embedded JavaScript templates)
- **CSS / Styling**: Tailwind CSS, Vanilla CSS
- **Database / Storage**: Supabase (PostgreSQL & Object Storage)
- **Editor**: CKEditor (Rich Text Editor)

---

## 📦 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Çevre Değişkenlerini Ayarlayın
Kök dizinde `.env` dosyası oluşturun ve aşağıdaki anahtarları girin (Değerleri kendi Supabase kimlik bilgilerinizle doldurun):

```env
PORT=3000
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_BUCKET_NAME=documents
```

### 3. Veritabanını Hazırlayın
Supabase SQL Editor üzerinde `db/migration/` içerisindeki SQL betiklerini sırasıyla çalıştırarak tabloları ve varsayılan verileri oluşturun.

Çoklu kategori desteği için aşağıdaki ek SQL sorgusunu çalıştırın:
```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category_ids UUID[] DEFAULT '{}';
UPDATE articles SET category_ids = ARRAY[category_id] WHERE category_id IS NOT NULL;
```

### 4. Uygulamayı Başlatın

```bash
# Geliştirme Modu (Hot Reload)
npm run start:dev

# Prodüksiyon Derlemesi
npm run build

# Prodüksiyon Modunda Çalıştır
npm run start:prod
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

---

## 📂 Dosya Yapısı

```text
├── db/                   # Veritabanı şemaları ve migration SQL dosyaları
├── public/               # CSS, JS, görsel varlıklar ve ikonlar
├── src/                  # NestJS modülleri, servisler ve kontrolcüler
│   ├── admin/            # Yönetim paneli lojikleri ve yönlendirmeleri
│   ├── database/         # Supabase bağlantısı ve DB sorguları
│   └── app.*             # Genel uygulama servis ve kontrolcüleri
├── views/                # Arayüz EJS dosyaları
│   ├── admin/            # Yönetim paneli ekran şablonları
│   ├── pages/            # Ziyaretçi sayfaları (Ana Sayfa, Blog, vb.)
│   └── partials/         # Ortak arayüz parçaları (Header, Footer, Head)
└── .gitignore            # Git dışı bırakılan dosyalar
```

---

## 📄 Lisans

Bu proje **MIT** lisansı altında korunmaktadır.
