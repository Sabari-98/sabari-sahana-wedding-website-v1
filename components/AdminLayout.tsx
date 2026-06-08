import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ADMIN_SESSION_KEY = 'wedding_admin_auth'

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    setAuthed(sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true')
  }, [])

  const login = async (password: string): Promise<boolean> => {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
      setAuthed(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setAuthed(false)
  }

  return { authed, login, logout }
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/guests', label: 'Guests' },
  { href: '/admin/family', label: 'Families' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/rsvps', label: 'RSVPs' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/settings', label: 'Settings' },
]

interface AdminLayoutProps {
  children: ReactNode
  title: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter()
  const { authed, logout } = useAdminAuth()
  const [mobileNav, setMobileNav] = useState(false)

  if (authed === null) return null
  if (!authed) {
    if (typeof window !== 'undefined') router.replace('/admin')
    return null
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F7F6F3' }}>
      {/* Sidebar */}
      <div style={{
        width: 220,
        background: '#1C1917',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }} className="admin-sidebar">
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'rgba(250,247,242,0.9)' }}>
            Admin
          </div>
          <div style={{ fontSize: 11, color: 'rgba(250,247,242,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 2 }}>
            Wedding Portal
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'block',
              padding: '10px 20px',
              fontSize: 13,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: router.pathname === item.href ? 'var(--color-accent, #C8860A)' : 'rgba(250,247,242,0.55)',
              background: router.pathname === item.href ? 'rgba(200,134,10,0.1)' : 'transparent',
              borderLeft: router.pathname === item.href ? '2px solid var(--color-accent, #C8860A)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={logout} style={{
            fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
            color: 'rgba(250,247,242,0.3)', background: 'none', border: 'none', cursor: 'pointer',
          }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: 'white', borderBottom: '1px solid #E7E5E4', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: '#1C1917' }}>{title}</h1>
          <Link href="/" target="_blank" style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#C8860A', textDecoration: 'none' }}>
            View Site ↗
          </Link>
        </header>
        <div style={{ flex: 1, padding: '32px', maxWidth: 1100 }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
        }
      `}</style>
    </div>
  )
}

// ── Login screen ──
export function AdminLogin() {
  const { login } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(password)
    if (ok) {
      router.push('/admin/guests')
    } else {
      setError('Incorrect password.')
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C1917', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 40, width: '100%', maxWidth: 380 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#1C1917', marginBottom: 4 }}>Admin Dashboard</div>
        <div style={{ fontSize: 12, color: '#78716C', letterSpacing: '1px', marginBottom: 28 }}>Wedding Website Management</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter admin password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              autoFocus
            />
          </div>
          {error && <div style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={!password || loading} style={{ width: '100%' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=Jost:wght@300;400;500&display=swap');`}</style>
    </div>
  )
}
