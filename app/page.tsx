'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import RestauranteCard from '@/components/RestauranteCard'
import AddRestauranteModal from '@/components/AddRestauranteModal'
import AddResenaModal from '@/components/AddResenaModal'

export type Resena = {
  id: string
  puntaje: number
  comentario: string
  visitadoEn: string | null
  createdAt: string
  user: { id: string; name: string; avatar: string }
}

export type Restaurante = {
  id: string
  nombre: string
  categoria: string
  direccion: string | null
  ciudad: string | null
  createdAt: string
  resenas: Resena[]
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddRestaurante, setShowAddRestaurante] = useState(false)
  const [selectedRestaurante, setSelectedRestaurante] = useState<Restaurante | null>(null)
  const [search, setSearch] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') fetchRestaurantes()
  }, [status])

  async function fetchRestaurantes() {
    setLoading(true)
    const res = await fetch('/api/restaurantes')
    const data = await res.json()
    setRestaurantes(data)
    setLoading(false)
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="font-display" style={{ fontSize: '1.5rem', color: 'var(--brown)' }}>Cargando...</div>
      </div>
    )
  }

  const categorias = [...new Set(restaurantes.map(r => r.categoria))].sort()
  const filtered = restaurantes.filter(r => {
    const matchSearch = r.nombre.toLowerCase().includes(search.toLowerCase()) ||
      r.ciudad?.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCategoria || r.categoria === filterCategoria
    return matchSearch && matchCat
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <header style={{
        borderBottom: '2px solid var(--ink)',
        background: 'var(--warm-white)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.6rem', lineHeight: 1 }}>
              Reseñas <em>Chanchas</em>
            </h1>
            <span style={{ fontSize: '1.2rem' }}>🍽️</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--brown)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{session?.user?.avatar}</span>
              {session?.user?.name}
            </span>
            <button className="btn-secondary" onClick={() => signOut({ callbackUrl: '/login' })}
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input className="input-field" placeholder="Buscar restaurante o ciudad..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field" value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}>
            <option value="">Todas las categorías</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn-primary" onClick={() => setShowAddRestaurante(true)}>
            + Agregar restaurante
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Restaurantes', value: restaurantes.length },
            { label: 'Reseñas totales', value: restaurantes.reduce((acc, r) => acc + r.resenas.length, 0) },
            { label: 'De Mimi', value: restaurantes.reduce((acc, r) => acc + r.resenas.filter(re => re.user.name === 'Mimi').length, 0) },
            { label: 'De Liqui', value: restaurantes.reduce((acc, r) => acc + r.resenas.filter(re => re.user.name === 'Liqui').length, 0) },
          ].map(stat => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="font-display" style={{ fontSize: '1.8rem', color: 'var(--terracotta)' }}>{stat.value}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--brown)' }}>
            <div className="font-display" style={{ fontSize: '1.2rem' }}>Cargando restaurantes...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--blush)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍴</div>
            <div className="font-display" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              {restaurantes.length === 0 ? 'Ningún restaurante todavía' : 'Sin resultados'}
            </div>
            <p style={{ color: 'var(--brown)', fontSize: '0.9rem' }}>
              {restaurantes.length === 0 ? 'Agregá el primer restaurante para empezar a reseñar' : 'Probá con otro filtro'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((r, i) => (
              <RestauranteCard key={r.id} restaurante={r} session={session}
                onResena={() => setSelectedRestaurante(r)} onUpdated={fetchRestaurantes}
                style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        )}
      </main>

      {showAddRestaurante && (
        <AddRestauranteModal onClose={() => setShowAddRestaurante(false)}
          onCreated={() => { setShowAddRestaurante(false); fetchRestaurantes() }} />
      )}
      {selectedRestaurante && (
        <AddResenaModal restaurante={selectedRestaurante} session={session}
          onClose={() => setSelectedRestaurante(null)}
          onSaved={() => { setSelectedRestaurante(null); fetchRestaurantes() }} />
      )}
    </div>
  )
}
