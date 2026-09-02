import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PublicProfile({ params }) {
  const { id } = await params;
  
  const { data: professor, error } = await db.database
    .from('professors')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !professor) {
    notFound();
  }

  const waLink = professor.whatsappNumber 
    ? `https://wa.me/${professor.whatsappNumber.replace(/[^0-9]/g, '')}` 
    : null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        textAlign: 'center',
        padding: '3rem 2rem'
      }}>
        {professor.photoUrl ? (
          <img 
            src={professor.photoUrl} 
            alt={professor.name} 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '4px solid var(--accent-cyan)',
              marginBottom: '1.5rem',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
            }} 
          />
        ) : (
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--accent-purple)',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: 'bold',
            border: '4px solid rgba(255,255,255,0.2)'
          }}>
            {professor.name.charAt(0)}
          </div>
        )}

        <h1 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>{professor.name}</h1>
        {professor.bio && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
            {professor.bio}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ background: '#25D366' }}>
              Contactar por WhatsApp
            </a>
          )}
          
          {professor.linkedinUrl && (
            <a href={professor.linkedinUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ background: '#0077b5' }}>
              Ver perfil en LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
