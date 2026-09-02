import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

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

    const id = crypto.randomBytes(4).toString('hex');
    let photoUrl = null;

    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const fileName = `${id}-${photo.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.writeFile(filePath, buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    const insert = db.prepare(`
      INSERT INTO professors (id, name, bio, photoUrl, linkedinUrl, whatsappNumber)
      VALUES (@id, @name, @bio, @photoUrl, @linkedinUrl, @whatsappNumber)
    `);

    insert.run({
      id,
      name,
      bio: bio || null,
      photoUrl,
      linkedinUrl: linkedinUrl || null,
      whatsappNumber: whatsappNumber || null
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Error creating professor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
