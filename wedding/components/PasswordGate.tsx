import { useState, useEffect } from 'react'
import { KolamDiamond, KolamBg } from './Kolam'

const SESSION_KEY = 'wedding_auth'

export function useAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const val = sessionStorage.getItem(SESSION_KEY)
    setAuthed(val === 'true')
  }, [])

  const login = (password: string, sitePassword: string): boolean => {
    if (password === sitePassword) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setAuthed(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  return { authed, login, logout }
}

interface PasswordGateProps {
  sitePassword: string
  coupleName1?: string
  coupleName2?: string
  children: React.ReactNode
}

export default function PasswordGate({ sitePassword, coupleName1 = 'Priya', coupleName2 = 'Arjun', children }: PasswordGateProps) {
  const { authed, login } = useAuth()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (authed === null) return null // hydrating

  if (authed) return <>{children}</>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const ok = login(input, sitePassword)
      if (!ok) {
        setError('Incorrect password. Please check your invitation.')
        setInput('')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: 24,
    }}>
      <KolamBg opacity={0.06} />

      <div style={{ textAlign: 'center', maxWidth: 400, width: '100%', position: 'relative', zIndex: 1 }}>
        <KolamDiamond size={48} color="#C8860A" />

        <div style={{ marginTop: 24, marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,247,242,0.4)' }}>
          You are invited to
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, color: 'rgba(250,247,242,0.95)', marginBottom: 4 }}>
          {coupleName1} <span style={{ color: 'var(--color-accent)' }}>&</span> {coupleName2}
        </h1>
        <div style={{ fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,247,242,0.3)', marginBottom: 40 }}>
          Wedding Celebrations
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError('') }}
              placeholder="Enter invitation password"
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(250,247,242,0.06)',
                border: `1px solid ${error ? 'rgba(220,38,38,0.5)' : 'rgba(250,247,242,0.15)'}`,
                borderRadius: 3,
                color: 'rgba(250,247,242,0.9)',
                fontSize: 15,
                textAlign: 'center',
                letterSpacing: '2px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
          {error && (
            <div style={{ fontSize: 13, color: '#F87171', marginBottom: 12, letterSpacing: '0.5px' }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={!input || loading}
            className="btn btn-accent"
            style={{ width: '100%', opacity: !input || loading ? 0.6 : 1 }}
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: 12, color: 'rgba(250,247,242,0.25)', letterSpacing: '1px' }}>
          Password shared on your invitation
        </div>
      </div>
    </div>
  )
}
