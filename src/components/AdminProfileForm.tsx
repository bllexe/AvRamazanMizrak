'use client';

import React, { useState, useEffect } from 'react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date_obtained: string;
  display_order: number;
}

interface AdminProfileFormProps {
  initialProfile: any;
  initialCertifications: Certification[];
}

export default function AdminProfileForm({
  initialProfile,
  initialCertifications,
}: AdminProfileFormProps) {
  // Profile State
  const [profileData, setProfileData] = useState({
    full_name: initialProfile?.full_name || '',
    title: initialProfile?.title || '',
    bar_number: initialProfile?.bar_number || '',
    experience_years: initialProfile?.experience_years?.toString() || '0',
    specializations: Array.isArray(initialProfile?.specializations)
      ? JSON.stringify(initialProfile.specializations)
      : '[]',
    bio_short: initialProfile?.bio_short || '',
    bio_long: initialProfile?.bio_long || '',
    email: initialProfile?.email || '',
    phone: initialProfile?.phone || '',
    whatsapp_number: initialProfile?.whatsapp_number || '',
    linkedin_url: initialProfile?.linkedin_url || '',
    twitter_url: initialProfile?.twitter_url || '',
    instagram_url: initialProfile?.instagram_url || '',
    image_url:
      initialProfile?.image_url && !initialProfile.image_url.includes('lh3.googleusercontent.com')
        ? initialProfile.image_url
        : '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setProfileData({ ...profileData, image_url: '' });
  };

  // Certifications State
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [certFormMode, setCertFormMode] = useState<'create' | 'edit'>('create');
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certFormData, setCertFormData] = useState({
    title: '',
    issuer: '',
    date_obtained: '',
    display_order: '0',
  });

  const [isSavingCert, setIsSavingCert] = useState(false);

  // Delete modal state
  const [deleteCertId, setDeleteCertId] = useState<string | null>(null);

  const fetchCertifications = async () => {
    try {
      const res = await fetch('/api/admin/certifications-list');
      if (res.ok) {
        const data = await res.json();
        setCertifications(data.certifications || []);
      }
    } catch (err) {
      console.error('Failed to reload certs', err);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);

    try {
      // Validate specializations json
      try {
        JSON.parse(profileData.specializations);
      } catch (err) {
        alert('Uzmanlık alanları geçerli bir JSON dizisi olmalıdır. Örn: ["Ceza Hukuku", "Aile Hukuku"]');
        setIsSavingProfile(false);
        return;
      }

      let response: Response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('data', JSON.stringify(profileData));

        response = await fetch('/api/admin/profile', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/admin/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });
      }

      if (response.ok) {
        const resData = await response.json();
        if (resData.image_url) {
          setProfileData((prev) => ({ ...prev, image_url: resData.image_url }));
        }
        setSelectedFile(null);
        setFilePreview(null);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        const data = await response.json();
        alert(data.error || 'Profil kaydedilemedi.');
      }
    } catch (err) {
      console.error('Save profile error', err);
      alert('Sistemsel bir hata oluştu.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCertEdit = (cert: Certification) => {
    setCertFormMode('edit');
    setEditingCertId(cert.id);
    setCertFormData({
      title: cert.title,
      issuer: cert.issuer,
      date_obtained: cert.date_obtained ? cert.date_obtained.substring(0, 10) : '',
      display_order: cert.display_order.toString(),
    });
  };

  const handleCertCancel = () => {
    setCertFormMode('create');
    setEditingCertId(null);
    setCertFormData({
      title: '',
      issuer: '',
      date_obtained: '',
      display_order: '0',
    });
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCert(true);

    try {
      const url =
        certFormMode === 'create'
          ? '/api/admin/certifications'
          : `/api/admin/certifications/${editingCertId}`;
      const method = certFormMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certFormData),
      });

      if (response.ok) {
        handleCertCancel();
        await fetchCertifications();
      } else {
        alert('Sertifika kaydedilemedi.');
      }
    } catch (err) {
      console.error('Submit certification error', err);
    } finally {
      setIsSavingCert(false);
    }
  };

  const handleCertDeleteClick = (id: string) => {
    setDeleteCertId(id);
  };

  const confirmCertDelete = async () => {
    if (!deleteCertId) return;

    try {
      const response = await fetch(`/api/admin/certifications/${deleteCertId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteCertId(null);
        await fetchCertifications();
      } else {
        alert('Sertifika silinemedi.');
      }
    } catch (err) {
      console.error('Delete cert error', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Lawyer Profile Card */}
      <form
        onSubmit={handleProfileSubmit}
        className="bg-white dark:bg-slate-800 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl p-8 shadow-sm space-y-6"
      >
        <div className="flex justify-between items-center border-b border-stone-gray/40 dark:border-slate-700/40 pb-3">
          <h3 className="font-headline-sm text-lg text-legal-navy dark:text-slate-100 font-bold">Profil Bilgileri</h3>
          {profileSuccess && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 animate-fade-in-down">
              Değişiklikler Kaydedildi!
            </span>
          )}
        </div>

        {/* Profile Image Section */}
        <div className="p-5 bg-stone-50 dark:bg-slate-900/40 border border-stone-gray/40 dark:border-slate-700/40 rounded-xl space-y-4">
          <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold">
            AVUKAT PROFİL FOTOĞRAFI
          </label>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Image Preview Box */}
            <div className="relative w-28 h-36 rounded-lg overflow-hidden border-2 border-prestige-gold/50 shadow-md bg-stone-200 dark:bg-slate-700 shrink-0 flex items-center justify-center group">
              <img
                src={filePreview || profileData.image_url || '/images/profil2.jpeg'}
                alt="Profil Önizleme"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                Önizleme
              </div>
            </div>

            {/* Upload & URL Controls */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <label
                  htmlFor="profile-file-input"
                  className="px-4 py-2.5 bg-legal-navy text-white text-xs font-bold rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  Bilgisayardan Fotoğraf Seç
                </label>
                <input
                  id="profile-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {(selectedFile || profileData.image_url) && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border border-red-200 dark:border-red-900/50"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Kaldır / Sıfırla
                  </button>
                )}
              </div>

              {selectedFile && (
                <p className="text-xs text-green-700 dark:text-green-400 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Seçilen Dosya: {selectedFile.name} (Kaydet butonuna bastığınızda yüklenecektir)
                </p>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block" htmlFor="image_url">
                  VEYA GÖRSEL URL ADRESİ GİRİN
                </label>
                <input
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900/80 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-xs font-mono"
                  id="image_url"
                  type="text"
                  placeholder="https://... veya /images/profil2.jpeg"
                  value={profileData.image_url}
                  onChange={(e) => setProfileData({ ...profileData, image_url: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="full_name">
              AVUKAT AD SOYAD
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="full_name"
              type="text"
              required
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="title">
              UNVAN
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="title"
              type="text"
              required
              value={profileData.title}
              onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="bar_number">
              BARO SİCİL NO
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="bar_number"
              type="text"
              required
              value={profileData.bar_number}
              onChange={(e) => setProfileData({ ...profileData, bar_number: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="experience_years">
              DENEYİM YILI
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="experience_years"
              type="number"
              required
              value={profileData.experience_years}
              onChange={(e) =>
                setProfileData({ ...profileData, experience_years: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="specializations">
            UZMANLIK ALANLARI (JSON DİZİ BİÇİMİNDE)
          </label>
          <input
            className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-mono"
            id="specializations"
            type="text"
            required
            value={profileData.specializations}
            onChange={(e) => setProfileData({ ...profileData, specializations: e.target.value })}
          />
          <p className="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">
            Örnek: [&quot;Şirketler Hukuku&quot;, &quot;Ceza Hukuku&quot;, &quot;KVKK&quot;]
          </p>
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="bio_short">
            KISA ÖZGEÇMİŞ (ANASAYFA HAKKIMDA METNİ)
          </label>
          <textarea
            className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-none text-sm"
            id="bio_short"
            required
            rows={3}
            value={profileData.bio_short}
            onChange={(e) => setProfileData({ ...profileData, bio_short: e.target.value })}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="bio_long">
            DETAYLI ÖZGEÇMİŞ (HAKKIMDA SAYFASI HTML METNİ)
          </label>
          <textarea
            className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none resize-y text-sm font-sans"
            id="bio_long"
            required
            rows={10}
            value={profileData.bio_long}
            onChange={(e) => setProfileData({ ...profileData, bio_long: e.target.value })}
          />
          <p className="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">
            Paragraflar için &lt;p&gt; metin &lt;/p&gt; etiketlerini kullanabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="email">
              E-POSTA ADRESİ
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="email"
              type="email"
              required
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="phone">
              TELEFON HATI
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="phone"
              type="text"
              required
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="whatsapp_number">
              WHATSAPP HATI
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="whatsapp_number"
              type="text"
              required
              value={profileData.whatsapp_number}
              onChange={(e) => setProfileData({ ...profileData, whatsapp_number: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="linkedin_url">
              LINKEDIN URL
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="linkedin_url"
              type="text"
              value={profileData.linkedin_url}
              onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="twitter_url">
              TWITTER URL
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="twitter_url"
              type="text"
              value={profileData.twitter_url}
              onChange={(e) => setProfileData({ ...profileData, twitter_url: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="instagram_url">
              INSTAGRAM URL
            </label>
            <input
              className="w-full px-4 py-3 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-sm font-medium"
              id="instagram_url"
              type="text"
              value={profileData.instagram_url}
              onChange={(e) => setProfileData({ ...profileData, instagram_url: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-gray/40 dark:border-slate-700/40">
          <button
            className="w-full py-3.5 bg-legal-navy text-white font-bold rounded-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-md text-xs uppercase tracking-wider disabled:opacity-75"
            type="submit"
            disabled={isSavingProfile}
          >
            {isSavingProfile ? 'Kaydediliyor...' : 'Profil Bilgilerini Kaydet'}
            <span className="material-symbols-outlined text-prestige-gold group-hover:translate-x-1 transition-transform text-[18px]">
              save
            </span>
          </button>
        </div>
      </form>

      {/* Certifications Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Certifications List (2/3 width) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-lg text-legal-navy dark:text-slate-100 font-bold mb-1">
              Sertifikalar & Eğitimler
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4">
              Hakkımda sayfasında listelenen mesleki sertifika ve eğitim bilgilerinizi yönetin.
            </p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-stone-50 dark:bg-slate-900/50 text-on-surface-variant dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-stone-gray/40 dark:border-slate-700/40">
                  <th className="px-4 py-3">Sıra</th>
                  <th className="px-4 py-3">Sertifika / Eğitim Adı</th>
                  <th className="px-4 py-3">Veren Kurum</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-gray/30 dark:divide-slate-700/50 text-xs">
                {certifications.length > 0 ? (
                  certifications.map((cert) => (
                    <tr key={cert.id} className="hover:bg-stone-50 dark:hover:bg-slate-700/50 dark:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-semibold text-legal-navy dark:text-slate-100">
                        {cert.display_order}
                      </td>
                      <td className="px-4 py-3 font-bold text-legal-navy dark:text-slate-100">{cert.title}</td>
                      <td className="px-4 py-3 text-on-surface-variant dark:text-slate-400">{cert.issuer}</td>
                      <td className="px-4 py-3 text-on-surface-variant dark:text-slate-400">
                        {cert.date_obtained
                          ? new Date(cert.date_obtained).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                            })
                          : ''}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleCertEdit(cert)}
                            className="text-legal-navy dark:text-slate-100 hover:text-prestige-gold transition-colors flex items-center"
                            title="Düzenle"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCertDeleteClick(cert.id)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                            title="Sil"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-on-surface-variant dark:text-slate-400">
                      Sertifika veya eğitim kaydı bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certifications Form (1/3 width) */}
        <div className="bg-white dark:bg-slate-800 border border-stone-gray/60 dark:border-slate-700/60 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-legal-navy dark:text-slate-100 text-sm">
              {certFormMode === 'create' ? 'Yeni Sertifika Ekle' : 'Sertifikayı Düzenle'}
            </h4>
            <p className="text-[10px] text-on-surface-variant dark:text-slate-400 mt-0.5">
              Sertifika bilgilerini girerek kaydediniz.
            </p>
          </div>

          <form onSubmit={handleCertSubmit} className="space-y-3">
            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[9px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="cert_title">
                SERTİFİKA / EĞİTİM ADI
              </label>
              <input
                className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-xs"
                id="cert_title"
                type="text"
                placeholder="Örn: KVKK Uzmanlık Sertifikası"
                required
                value={certFormData.title}
                onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
              />
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="font-label-caps text-[9px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="cert_issuer">
                VEREN KURUM
              </label>
              <input
                className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-xs"
                id="cert_issuer"
                type="text"
                placeholder="Örn: Türkiye Barolar Birliği"
                required
                value={certFormData.issuer}
                onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 flex flex-col">
                <label className="font-label-caps text-[9px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="cert_date">
                  ALINDIĞI TARİH
                </label>
                <input
                  className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-xs"
                  id="cert_date"
                  type="date"
                  required
                  value={certFormData.date_obtained}
                  onChange={(e) =>
                    setCertFormData({ ...certFormData, date_obtained: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="font-label-caps text-[9px] text-on-surface-variant dark:text-slate-400 tracking-wider block font-bold" htmlFor="cert_order">
                  SIRA NO
                </label>
                <input
                  className="w-full px-3 py-2 bg-[#FCFBFA] dark:bg-slate-900/50 border border-[#DEDCD7] dark:border-slate-700/50 rounded-lg focus:ring-1 focus:ring-prestige-gold focus:border-prestige-gold outline-none text-xs"
                  id="cert_order"
                  type="number"
                  required
                  value={certFormData.display_order}
                  onChange={(e) =>
                    setCertFormData({ ...certFormData, display_order: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                className="w-full py-2 bg-legal-navy text-white font-bold rounded-lg hover:bg-opacity-95 transition-all text-xs disabled:opacity-75"
                type="submit"
                disabled={isSavingCert}
              >
                {isSavingCert ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              {certFormMode === 'edit' && (
                <button
                  type="button"
                  onClick={handleCertCancel}
                  className="w-full py-1.5 bg-[#E2E8F0] text-legal-navy dark:text-slate-100 font-bold rounded-lg hover:bg-opacity-90 transition-all text-xs"
                >
                  İptal Et
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A2B3C] bg-opacity-40 backdrop-blur-sm"
            onClick={() => setDeleteCertId(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-stone-gray dark:border-slate-700 max-w-sm w-full mx-4 overflow-hidden z-10">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <div>
                  <h4 className="font-bold text-legal-navy dark:text-slate-100 text-sm">Sertifikayı Sil</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1.5 leading-relaxed">
                    Bu sertifika/eğitim kaydını silmek istediğinize emin misiniz? Bu işlem geri
                    alınamaz.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteCertId(null)}
                  className="px-4 py-2 bg-[#E2E8F0] hover:bg-opacity-90 text-legal-navy dark:text-slate-100 font-semibold text-xs rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmCertDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-opacity-95 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
