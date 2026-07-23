import { NextResponse } from 'next/server';
import { updateProfile, getProfile, uploadFileToSupabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';

    const currentProfile = await getProfile();
    if (!currentProfile) {
      return NextResponse.json({ error: 'Profile not found in database' }, { status: 404 });
    }

    let updates: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const bodyJsonStr = formData.get('data') as string | null;
      const body = bodyJsonStr ? JSON.parse(bodyJsonStr) : {};

      let uploadedImageUrl = body.image_url || '';

      if (file && file.size > 0) {
        try {
          uploadedImageUrl = await uploadFileToSupabase(file, 'profiles');
        } catch (uploadErr: any) {
          console.error('Profile photo upload error:', uploadErr);
          return NextResponse.json(
            { success: false, error: `Fotoğraf yükleme hatası: ${uploadErr.message}` },
            { status: 500 }
          );
        }
      }

      updates = {
        full_name: body.full_name,
        title: body.title,
        bar_number: body.bar_number,
        experience_years: parseInt(body.experience_years || '0', 10),
        specializations: typeof body.specializations === 'string' ? JSON.parse(body.specializations) : body.specializations,
        bio_short: body.bio_short,
        bio_long: body.bio_long,
        email: body.email,
        phone: body.phone,
        whatsapp_number: body.whatsapp_number,
        linkedin_url: body.linkedin_url || '',
        twitter_url: body.twitter_url || '',
        instagram_url: body.instagram_url || '',
        image_url: uploadedImageUrl,
      };
    } else {
      const body = await request.json();
      updates = {
        full_name: body.full_name,
        title: body.title,
        bar_number: body.bar_number,
        experience_years: parseInt(body.experience_years || '0', 10),
        specializations: typeof body.specializations === 'string' ? JSON.parse(body.specializations) : body.specializations,
        bio_short: body.bio_short,
        bio_long: body.bio_long,
        email: body.email,
        phone: body.phone,
        whatsapp_number: body.whatsapp_number,
        linkedin_url: body.linkedin_url || '',
        twitter_url: body.twitter_url || '',
        instagram_url: body.instagram_url || '',
        image_url: body.image_url !== undefined ? body.image_url : (currentProfile.image_url || ''),
      };
    }

    const data = await updateProfile(currentProfile.id, updates);
    return NextResponse.json({ success: true, data, image_url: data?.image_url || updates.image_url });
  } catch (error: any) {
    console.error('Update profile API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
