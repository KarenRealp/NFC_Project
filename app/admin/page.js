import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { data, error } = await db
    .from('professors')
    .select('*')
    .order('createdAt', { ascending: false });

  const professors = data || [];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Panel de Administración</h1>
        <Link href="/admin/new" className="btn-primary">
          + Nuevo Profesor
        </Link>
      </div>

      <div className="glass-panel">
        {professors.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No hay profesores registrados aún.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {professors.map((prof) => (
              <div key={prof.id} style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                padding: '1.5rem', 
                borderRadius: '15px',
                border: '1px solid var(--glass-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  {prof.photoUrl ? (
                    <img src={prof.photoUrl} alt={prof.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {prof.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{prof.name}</h3>
                    <a href={`/p/${prof.id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', textDecoration: 'none' }}>
                      Ver Perfil ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
