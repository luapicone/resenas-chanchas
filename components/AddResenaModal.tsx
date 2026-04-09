'use client'

import { useState } from 'react'
import { Restaurante } from '@/app/page'

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: '2rem',
            cursor: 'pointer',
            color: i <= (hover || value) ? 'var(--gold)' : '#D4C5B0',
            transition: 'color 0.1s, transform 0.1s',
            transform: i <= (hover || value) ? 'scale(1.1)' : 'scale(1)',
            display: 'inline-block',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

const PUNTAJE_LABELS: Record<number, string> = {
  1: 'Pésimo 😬',
  2: 'Regular 😐',
  3: 'Bueno 😊',
  4: 'Muy bueno 😍',
  5: '¡Perfecto! 🤩',
}

export default function AddResenaModal({
  restaurante,
  session,
  onClose,
  onSaved,
}: {
  restaurante: Restaurante
  session: any
  onClose: () => void
  onSaved: () => void
}) {
  const existingResena = restaurante.resenas.find(r => r.user.id === session?.user?.id)

  const [puntaje, setPuntaje] = useState(existingResena?.puntaje || 0)
  const [comentario, setComentario] = useState(existingResena?.comentario || '')
  const [visitadoEn, setVisitadoEn] = useState(
    existingResena?.visitadoEn ? existingResena.visitadoEn.slice(0, 10) : ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!puntaje) { setError('Elegí un puntaje'); return }
    if (!comentario.trim()) { setError('Escribí un comentario'); return }

    setLoading(true)
    setError('')

    const res = await fetch('/api/resenas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restauranteId: restaurante.id,
        puntaje,
        comentario: comentario.trim(),
        visitadoEn: visitadoEn || null,
      }),
    })

    if (res.ok) {
      onSaved()
    } else {
      const data = await res.json()
      setError(data.error || 'Error al guardar')
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1.5px solid var(--ink)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              {existingResena ? 'Editar reseña' : 'Nueva reseña'}
            </p>
            <h2 className="font-display" style={{ fontSize: '1.4rem' }}>{restaurante.nombre}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginTop: '0.25rem' }}>✕</button>
        </div>

        {/* Who is reviewing */}
        <div style={{
          padding: '0.85rem 1.75rem',
          background: 'var(--cream)',
          borderBottom: '1px solid var(--blush)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--brown)',
        }}>
          <span style={{ fontSize: '1.2rem' }}>{session?.user?.avatar}</span>
          Reseñando como <strong>{session?.user?.name}</strong>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Stars */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--brown)' }}>
                Puntaje *
              </label>
              <StarPicker value={puntaje} onChange={setPuntaje} />
              {puntaje > 0 && (
                <p style={{ marginTop: '0.4rem', fontSize: '0.875rem', color: 'var(--terracotta)', fontWeight: 500 }}>
                  {PUNTAJE_LABELS[puntaje]}
                </p>
              )}
            </div>

            {/* Comentario */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--brown)' }}>
                Comentario *
              </label>
              <textarea
                className="input-field"
                placeholder="¿Qué comiste? ¿Qué te pareció? ¿Volvería?"
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                rows={4}
                style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }}
                required
              />
            </div>

            {/* Fecha */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--brown)' }}>
                ¿Cuándo fuiste? (opcional)
              </label>
              <input
                className="input-field"
                type="date"
                value={visitadoEn}
                onChange={e => setVisitadoEn(e.target.value)}
                style={{ width: 'auto' }}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF0ED', border: '1px solid var(--terracotta)', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--terracotta)' }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : existingResena ? 'Actualizar reseña' : 'Publicar reseña'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
