import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name');
    const bio = formData.get('bio');
    const linkedinUrl = formData.get('linkedinUrl');
    const whatsappNumber = formData.get('whatsappNumber');
    const photo = formData.get('photo');
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let photoUrl = null;

    if (photo && photo.size > 0) {
      const fileName = `${Date.now()}-${photo.name.replace(/\s+/g, '-')}`;
      
      const { data: uploadData, error: uploadError } = await db.storage
        .from('professor_assets')
        .upload(fileName, photo, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: publicUrlData } = db.storage
        .from('professor_assets')
        .getPublicUrl(uploadData.path);
        
      photoUrl = publicUrlData.publicUrl;
    }

    const { data: insertData, error: insertError } = await db
      .from('professors')
      .insert([{
        name,
        bio: bio || null,
        photoUrl,
        linkedinUrl: linkedinUrl || null,
        whatsappNumber: whatsappNumber || null
      }])
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ success: true, id: insertData.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating professor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
