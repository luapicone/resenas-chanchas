'use client'

import { useState } from 'react'

const CATEGORIAS = [
  'Parrilla', 'Italiano', 'Japonés', 'Pizza', 'Árabe',
  'Mariscos', 'Vegano', 'Brunch', 'Cafetería', 'Mexicano',
  'Chino', 'Hamburguesería', 'Sushi', 'Otro',
]

export default function AddRestauranteModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState({ nombre: '', categoria: '', direccion: '', ciudad: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre || !form.categoria) {
      setError('Nombre y categoría son obligatorios')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/restaurantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      onCreated()
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
          alignItems: 'center',
        }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem' }}>Nuevo restaurante</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--brown)' }}>
                Nombre *
              </label>
              <input className="input-field" placeholder="El nombre del lugar" value={form.nombre}
                onChange={e => update('nombre', e.target.value)} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--brown)' }}>
                Categoría *
              </label>
              <select className="input-field" value={form.categoria} onChange={e => update('categoria', e.target.value)} required>
                <option value="">Elegir tipo de comida</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--brown)' }}>
                Ciudad
              </label>
              <input className="input-field" placeholder="Ej: Buenos Aires" value={form.ciudad}
                onChange={e => update('ciudad', e.target.value)} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--brown)' }}>
                Dirección
              </label>
              <input className="input-field" placeholder="Ej: Av. Corrientes 1234" value={form.direccion}
                onChange={e => update('direccion', e.target.value)} />
            </div>

            {error && (
              <div style={{ background: '#FEF0ED', border: '1px solid var(--terracotta)', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--terracotta)' }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar restaurante'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
