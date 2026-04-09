'use client'

import { useState } from 'react'
import { Restaurante } from '@/app/page'

const CATEGORIA_COLORS: Record<string, string> = {
  'Parrilla': '#C85C3A', 'Italiano': '#7A8C6E', 'Japonés': '#D4A843',
  'Pizza': '#E8C5B0', 'Árabe': '#6B4226', 'Mariscos': '#4A7B9D',
  'Vegano': '#7A8C6E', 'Brunch': '#D4A843', 'Cafetería': '#9B8B7A',
  'Mexicano': '#C85C3A', 'Chino': '#D4A843', 'Hamburguesería': '#6B4226',
  'Sushi': '#4A7B9D', 'Otro': '#1A1208',
}

function Stars({ puntaje }: { puntaje: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= puntaje ? 'star' : 'star empty'} style={{ fontSize: '0.95rem' }}>★</span>
      ))}
    </div>
  )
}

export default function RestauranteCard({ restaurante, session, onResena, onUpdated, style }: {
  restaurante: Restaurante
  session: any
  onResena: () => void
  onUpdated: () => void
  style?: React.CSSProperties
}) {
  const { id, nombre, categoria, direccion, ciudad, resenas } = restaurante
  const myResena = resenas.find(r => r.user.id === session?.user?.id)
  const avgPuntaje = resenas.length
    ? Math.round((resenas.reduce((acc, r) => acc + r.puntaje, 0) / resenas.length) * 10) / 10
    : null
  const catColor = CATEGORIA_COLORS[categoria] || '#1A1208'

  async function handleDeleteResena(resenaId: string) {
    if (!confirm('¿Eliminar tu reseña?')) return
    await fetch(`/api/resenas?id=${resenaId}`, { method: 'DELETE' })
    onUpdated()
  }

  async function handleDeleteRestaurante() {
    if (!confirm(`¿Eliminar "${nombre}" y todas sus reseñas?`)) return
    await fetch(`/api/restaurantes/${id}`, { method: 'DELETE' })
    onUpdated()
  }

  return (
    <div className="card animate-slide-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <h2 className="font-display" style={{ fontSize: '1.25rem', lineHeight: 1.2, marginBottom: '0.35rem' }}>{nombre}</h2>
          {(ciudad || direccion) && (
            <p style={{ fontSize: '0.8rem', color: 'var(--brown)', marginTop: '0.25rem' }}>
              📍 {[ciudad, direccion].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          <span className="tag" style={{ color: catColor, borderColor: catColor, whiteSpace: 'nowrap' }}>{categoria}</span>
          <button className="btn-danger" onClick={handleDeleteRestaurante} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
            🗑 Eliminar
          </button>
        </div>
      </div>

      {avgPuntaje !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Stars puntaje={Math.round(avgPuntaje)} />
          <span style={{ fontSize: '0.8rem', color: 'var(--brown)' }}>
            {avgPuntaje} · {resenas.length} reseña{resenas.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {resenas.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {resenas.map(resena => (
            <div key={resena.id} style={{ background: 'var(--cream)', border: '1px solid var(--blush)', padding: '0.85rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{resena.user.name}</span>
                <Stars puntaje={resena.puntaje} />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#3D2E1C', lineHeight: 1.5 }}>{resena.comentario}</p>
              {resena.visitadoEn && (
                <p style={{ fontSize: '0.75rem', color: '#9B8B7A', marginTop: '0.35rem' }}>
                  🗓 {new Date(resena.visitadoEn).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                </p>
              )}
              {resena.user.id === session?.user?.id && (
                <button className="btn-danger" onClick={() => handleDeleteResena(resena.id)}
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: '0.25rem' }}>
        <button className={myResena ? 'btn-secondary' : 'btn-primary'} onClick={onResena}
          style={{ width: '100%', justifyContent: 'center' }}>
          {myResena ? '✏️ Editar mi reseña' : '+ Agregar mi reseña'}
        </button>
      </div>
    </div>
  )
}
