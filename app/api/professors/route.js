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
        .upload(fileName, photo);
        
      if (uploadError) {
        throw uploadError;
      }
      
      photoUrl = uploadData.url;
    }

    const { data: insertData, error: insertError } = await db.database
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
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
