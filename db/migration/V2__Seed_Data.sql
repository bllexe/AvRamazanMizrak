-- 1. SEED ARTICLE CATEGORIES
INSERT INTO article_categories (id, name, slug, description, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Şirketler Hukuku', 'sirketler-hukuku', 'Şirket kuruluşları ve ticari davalar', 0),
('550e8400-e29b-41d4-a716-446655440002', 'Ceza Hukuku', 'ceza-hukuku', 'Ağır ceza ve bilişim suçları', 1),
('550e8400-e29b-41d4-a716-446655440003', 'Medeni Hukuk', 'medeni-hukuk', 'Aile, miras ve mülkiyet hukuku', 2),
('550e8400-e29b-41d4-a716-446655440004', 'İş Hukuku', 'is-hukuku', 'İşçi işveren ilişkileri ve davaları', 3),
('550e8400-e29b-41d4-a716-446655440005', 'KVKK', 'kvkk', 'Kişisel verilerin korunması kanunu', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED AUTHOR PROFILE
INSERT INTO author_profile (id, full_name, title, bar_number, experience_years, specializations, image_url, bio_short, bio_long, email, phone, whatsapp_number, linkedin_url, twitter_url, instagram_url) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Selim Aras Danışman', 'Kıdemli Hukuk Danışmanı / Avukat', '42159', 15, '["Şirketler Hukuku", "Ceza Hukuku", "Medeni Hukuk", "Bilişim Hukuku"]', 'https://lh3.googleusercontent.com/aida-public/AB6AXuChVl5a454Jk0TPnA_w0bwK3LmPRaBTtVLQl5CrAxQ2CqmAKCvAJce-bBGEANefScxYruSov0GX7GI_VB_wZHnaghktSmQRHht5me-2jfYdg0ufTHpc2ks4Vd6JCod9gooVFGNn9y6GwLFQZ5v3mLCnqfBxRgBHM16AU0vOy9W56stP-y8RT0Gkzxb_S92s-A2Xi7M8tNt8ARWFkytoEAUnewr8MZ8UlCOEeM4YV0DYY5telyR7Glf_6I-nGU4pOxTIfaSUAe2LsqJP', 'Karmaşık hukuki süreçlerinizi stratejik bir bakış açısıyla yönetiyoruz. 10 yılı aşkın tecrübe ile her vakada mutlak titizlik ve şeffaflık önceliğimizdir.', '<p>Hukuk kariyerime, adaletin sadece bir kavram değil, toplumsal bir denge unsuru olduğu bilinciyle başladım. Yirmi yılı aşkın süredir, karmaşık hukuki süreçleri müvekkillerim için şeffaf, güvenilir ve stratejik bir düzleme taşıyorum.</p><p>Modern hukukun dinamiklerini, geleneksel etik değerlerle harmanlayarak, her dosyanın kendine özgü hikayesine ve ihtiyacına odaklanıyorum. Uzmanlık alanlarımda edindiğim derin tecrübe, sadece dava kazanmak değil, sürdürülebilir hukuki çözümler üretmek üzerine kuruludur.</p>', 'iletisim@avdanisman.com', '+90 (212) 555 01 01', '+905550000000', 'https://linkedin.com/in/av-selim-aras', 'https://twitter.com/av-selim-aras', 'https://instagram.com/av-selim-aras')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED ARTICLES
INSERT INTO articles (id, title, slug, summary, content, image_url, category_id, meta_description, meta_keywords, status, published_at, view_count, reading_time_minutes) VALUES
('550e8400-e29b-41d4-a716-446655440021', 'Yeni Türk Ticaret Kanunu Kapsamında Şirket Kuruluşları', 'yeni-turk-ticaret-kanunu-kapsaminda-sirket-kuruluslari', '2024 yılında yürürlüğe giren yeni düzenlemelerle birlikte anonim ve limited şirketlerin kuruluş aşamasındaki sermaye gereklilikleri.', '<h2>Yeni TTK Kapsamında Yapılan Değişiklikler</h2><p>2024 yılı itibarıyla Türk Ticaret Kanunu''nda şirket kuruluşu süreçlerinde önemli güncellemeler yapılmıştır. Özellikle asgari sermaye tutarlarının artırılması, kurumsal ve ticari hayatın güvenliğini sağlama yolunda atılmış büyük bir adımdır.</p><blockquote>"Şirketlerin finansal sürdürülebilirliği açısından, başlangıç sermayelerinin günümüz ekonomik koşullarına uyarlanması elzemdi."</blockquote><h3>Asgari Sermaye Tutarları</h3><p>Yeni düzenlemeye göre limited şirketler için asgari sermaye 50.000 TL''ye, anonim şirketler için ise 250.000 TL''ye çıkarılmıştır. Bu tutarların nakdi kısımlarının tescilden önce ödenmesi usulleri de kolaylaştırılmıştır.</p><p>Ayrıca dijital tescil ve MERSİS entegrasyonu sayesinde kuruluş işlemleri artık çok daha hızlı ve şeffaf bir şekilde tamamlanabilmektedir. Hukuki riskleri minimize etmek için bir uzmana danışmanız tavsiye edilir.</p>', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5EfIBDVDq5Z453D902zh3KVwnykwh9jNhiQ45I9c06m6KRrU8fNQTqRCfnwgnkoMQLiFSb5ErHP8-1VFHqNUNhYnay-qYmED5gikj7wDelDJ2BIFieEbjqxU2Y-GqH_pepM7of5I5zKeS9cRata996YHYqiQkU2x5FYuAK9ZU-tlRNptkIncYKDVLjb4TDcBftF37k_7okkH-pVxtJtfCLoV-PRMjd1qfeeWCU7v3xlxpSRAxrrCBrrBZtSrMsKIEMXq6ZIezsABb', '550e8400-e29b-41d4-a716-446655440001', 'Yeni TTK limited ve anonim şirket kuruluş sermayesi ve dijital tescil işlemleri rehberi.', 'şirket kurmak, ttk 2024, asgari sermaye, anonim şirket, limited şirket', 'published', NOW(), 1240, 8),

('550e8400-e29b-41d4-a716-446655440022', 'Bilişim Suçlarında Dijital Delillerin Toplanması ve Geçerliliği', 'bilisim-suclarinda-dijital-delillerin-toplanmasi-ve-gecerliligi', 'Yargıtay''ın güncel içtihatları ışığında, sosyal medya üzerinden işlenen suçlarda ekran görüntülerinin ve log kayıtlarının mahkemelerce delil olarak kabul edilme şartları.', '<h2>Dijital Delillerin Hukuki Niteliği</h2><p>Bilişim suçlarının soruşturulmasında en kritik aşama, dijital verilerin bütünlüğünün korunarak delil olarak sunulmasıdır. Usulüne uygun toplanmayan dijital veriler, mahkeme aşamasında geçersiz sayılabilmektedir.</p><h3>Yargıtay İçtihatları ve Ekran Görüntüleri</h3><p>Yargıtay kararlarına göre sadece ekran görüntüsü (screenshot) sunmak çoğu zaman yeterli olmamakta, bu verilerin sunucu kayıtları (loglar) ve hash değerleriyle desteklenmesi gerekmektedir. Aksi halde delil üzerinde oynama yapıldığı iddiası dosyayı zedeleyebilir.</p>', 'https://lh3.googleusercontent.com/aida-public/AB6AXuByXbfAbi1wJm-zGl0GlC4MeEkI1OMNbfST2USRfUED1FSLdjp--g4spPFHldQzb5b5GaMVhrvg0JS_D8SBG_voHbAkkQzJUjWnQFTXAF-_xb0gsEsl28Rra05wDR8Isn390N2TxBfVDSlHNLU6dzZZgfeXD6wW9a_XJXl9i02DeB6qDjp5eOLZvM-b9-BMZ47-tHkcNyTFRiyy05u4dzaOXfC7aZ_z2c5dnXF74wsGyHrZ9uo7HUPBuxdpUb0WpAQg3bbWHRLk-0I1', '550e8400-e29b-41d4-a716-446655440002', 'Sosyal medya suçlarında ve bilişim hukuku davalarında dijital delil toplama esasları.', 'dijital delil, log kaydı, whatsapp delil, bilişim suçları', 'published', NOW(), 892, 12),

('550e8400-e29b-41d4-a716-446655440023', 'Miras Hukukunda Saklı Paylı Mirasçıların Hakları', 'miras-hukukunda-sakli-payli-mirascilarin-haklari', 'Vasiyetname düzenlenirken dikkat edilmesi gereken saklı pay oranları ve tenkis davası açma süreçleri hakkında kapsamlı bir rehber.', '<h2>Saklı Pay Nedir?</h2><p>Mirasbırakanın vasiyetname ile dilediği gibi tasarruf edemediği, mirasçıların kanunen korunan payına saklı pay denir. Saklı paylı mirasçılar; altsoy (çocuklar, torunlar), ana-baba ve sağ kalan eştir.</p><h3>Tenkis Davası</h3><p>Saklı payları ihlal edilen mirasçılar, mirasbırakanın ölümünden sonra tenkis davası açarak yasal haklarını talep edebilirler. Bu davada süre sınırları ve hesaplama yöntemleri son derece detaylıdır.</p>', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSfBOwK7Q7Ode-O577FWgo2t0dlfcvdeQS120ezKCQ-XT6vEMAj3IrgeY-dB9daVNoN0IW1n1-JWtXmTgZ0LE5yvr0XbjmqrKo62FTOjaU4VkXx1hAPBH5uPR-tkXXKyqGWNn4Hv_cYDQ23DsUW62OGK9RgFmkSqdU79maHOOWVIaBlMsP52iYHo5mwMTYyCNHGDMp3dnYYcPxt-Uo3-IzfViuWTFirR1qt6h3WjV4ExPr4tlu5LOVupceZzfHNE3BEHrAG1RUgeMO', '550e8400-e29b-41d4-a716-446655440003', 'Miras taksiminde saklı pay hesapları, tenkis davası şartları ve mirasçı hakları.', 'saklı pay, miras hakkı, tenkis davası, vasiyetname', 'published', NOW(), 3120, 6)
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED CERTIFICATIONS
INSERT INTO certifications (id, title, issuer, date_obtained, display_order) VALUES
('550e8400-e29b-41d4-a716-446655440031', 'Tahkim ve Arabuluculuk Sertifikası', 'Türkiye Barolar Birliği', '2018-05-10', 0),
('550e8400-e29b-41d4-a716-446655440032', 'KVKK Uzmanlık Eğitimi', 'Kişisel Verileri Koruma Kurumu', '2020-11-15', 1),
('550e8400-e29b-41d4-a716-446655440033', 'Uluslararası Barolar Birliği (IBA) Üyeliği', 'International Bar Association', '2021-03-01', 2)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED LEGAL DOCUMENTS
INSERT INTO legal_documents (type, content) VALUES
('kvkk', '<h2>KVKK Aydınlatma Metni</h2><p>Bu metin, kişisel verilerinizin işlenmesi hususunda sizleri bilgilendirmek amacıyla hazırlanmıştır. Sitemiz üzerindeki iletişim formunu doldurduğunuzda adınız, e-postanız ve mesajınız veri güvenliği kurallarına uygun şekilde saklanır.</p>'),
('privacy', '<h2>Gizlilik Politikası</h2><p>Kişisel gizliliğiniz bizim için önemlidir. Bu web sitesinde çerezler kullanıcı deneyimini iyileştirmek amacıyla kullanılmaktadır.</p>'),
('terms', '<h2>Kullanım Şartları</h2><p>Bu sitede yer alan makaleler ve analizler tamamen genel bilgilendirme amaçlı olup, hukuki tavsiye niteliği taşımamaktadır.</p>')
ON CONFLICT (type) DO NOTHING;

-- 6. SEED RESOURCES
INSERT INTO resources (id, title, description, file_url, category, file_size, display_order) VALUES
('550e8400-e29b-41d4-a716-446655440041', 'Şirket Kuruluş Kontrol Listesi', 'Limited ve Anonim Şirket kurarken gerekli tüm evrak ve adımlar.', '/uploads/sirket_kurulum_rehberi.pdf', 'guide', 358400, 0),
('550e8400-e29b-41d4-a716-446655440042', 'İş Sözleşmesi Taslağı (Uzaktan Çalışma)', 'Uzaktan çalışma düzenine uygun standart iş sözleşmesi örneği.', '/uploads/is_sozlesmesi_taslagi.pdf', 'template', 122880, 1)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED SITE SETTINGS
INSERT INTO settings (key, value, description, type) VALUES
('site_title', 'Avukat Selim Aras Danışman | Hukuki Analizler', 'Site başlığı', 'string'),
('site_description', 'Miras, Şirketler ve Bilişim Hukuku alanında güncel makale ve analizler.', 'Site açıklaması', 'string'),
('office_address', 'Levent Mah. Yasemin Sokak, No:12/4 Beşiktaş, İstanbul', 'Ofis Adresi', 'string')
ON CONFLICT (key) DO NOTHING;
