'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Usuario o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--cream)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍽️</div>
          <h1
            className="font-display"
            style={{
              fontSize: '2.8rem',
              lineHeight: 1.1,
              color: 'var(--ink)',
              marginBottom: '0.5rem',
            }}
          >
            Reseñas
            <br />
            <em>Chanchas</em>
          </h1>
          <p style={{ color: 'var(--brown)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
            Entrá con tu usuario para dejar tu reseña
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  color: 'var(--brown)',
                }}
              >
                Usuario
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="mimi o liqui"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  color: 'var(--brown)',
                }}
              >
                Contraseña
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                style={{
                  background: '#FEF0ED',
                  border: '1px solid var(--terracotta)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  color: 'var(--terracotta)',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Decorative */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.8rem',
            color: '#9B8B7A',
          }}
        >
          Solo para Mimi y Liqui 🐱🐶
        </div>
      </div>
    </div>
  )
}
