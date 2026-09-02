'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function NewProfessor() {
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.target);

    try {
      const res = await fetch('/api/professors', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setResultUrl(`${window.location.origin}/p/${data.id}`);
      } else {
        setError(data.error || 'Ocurrió un error al crear el perfil');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (resultUrl) {
    return (
      <div className="container">
        <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', marginTop: '4rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>¡Perfil Creado con Éxito!</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Este es el enlace final que debes programar en la tarjeta NFC:</p>
          
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '1.5rem', 
            borderRadius: '10px',
            marginBottom: '2rem',
            wordBreak: 'break-all',
            border: '1px dashed var(--glass-border)'
          }}>
            <a href={resultUrl} target="_blank" rel="noreferrer" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.2rem' }}>
              {resultUrl}
            </a>
          </div>

          <Link href="/admin" className="btn-primary">
            Volver al Panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <Link href="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>← Volver</Link>
        <h1 style={{ margin: 0 }}>Crear Nuevo Profesor</h1>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && <div style={{ color: '#ef4444', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Nombre y Apellido *</label>
          <input type="text" name="name" required className="input-field" placeholder="Ej. Juan Pérez" />

          <label>Foto de Perfil</label>
          <input type="file" name="photo" accept="image/*" className="input-field" style={{ background: 'transparent', padding: '10px 0' }} />

          <label>Biografía corta o Cargo</label>
          <textarea name="bio" rows="3" className="input-field" placeholder="Profesor titular del departamento de..."></textarea>

          <label>URL de LinkedIn</label>
          <input type="url" name="linkedinUrl" className="input-field" placeholder="https://linkedin.com/in/..." />

          <label>Número de WhatsApp (con código de país)</label>
          <input type="text" name="whatsappNumber" className="input-field" placeholder="Ej. +573001234567" />

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creando...' : 'Guardar y Generar Enlace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
