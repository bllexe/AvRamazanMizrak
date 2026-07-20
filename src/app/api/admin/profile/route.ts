import { NextResponse } from 'next/server';
import { updateProfile, getProfile } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Get current profile ID to update
    const currentProfile = await getProfile();
    if (!currentProfile) {
      return NextResponse.json({ error: 'Profile not found in database' }, { status: 404 });
    }

    const updates = {
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
    };

    if (body.image_url) {
      (updates as any).image_url = body.image_url;
    }

    const data = await updateProfile(currentProfile.id, updates);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Update profile API error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
