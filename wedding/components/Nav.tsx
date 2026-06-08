import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/story', label: 'Our Story' },
  { href: '/events', label: 'Events' },
  { href: '/travel', label: 'Travel' },
  { href: '/registry', label: 'Registry' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/faq', label: 'FAQ' },
]

export default function Nav({ coupleName1 = 'Priya', coupleName2 = 'Arjun' }: { coupleName1?: string; coupleName2?: string }) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [router.pathname])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: scrolled ? 'rgba(250,247,242,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(28,25,23,0.08)' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, letterSpacing: 1, color: 'var(--color-primary)' }}>
            {coupleName1} <span style={{ color: 'var(--color-accent)', margin: '0 4px' }}>&</span> {coupleName2}
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="nav-desktop">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{
                fontSize: 11,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: router.pathname === l.href ? 'var(--color-accent)' : 'var(--color-primary)',
                fontWeight: router.pathname === l.href ? 500 : 400,
                transition: 'color 0.2s',
                position: 'relative',
              }}>
                {l.label}
                {router.pathname === l.href && (
                  <span style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 1, background: 'var(--color-accent)' }} />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="nav-mobile-btn" style={{ display: 'none', flexDirection: 'column', gap: 5, padding: 4 }} aria-label="Menu">
            <span style={{ display: 'block', width: 22, height: 1, background: 'var(--color-primary)', transition: 'all 0.2s', transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1, background: 'var(--color-primary)', opacity: open ? 0 : 1, transition: 'opacity 0.2s' }} />
            <span style={{ display: 'block', width: 22, height: 1, background: 'var(--color-primary)', transition: 'all 0.2s', transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: 'var(--color-cream)',
          borderBottom: '1px solid var(--color-border)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: 13,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: router.pathname === l.href ? 'var(--color-accent)' : 'var(--color-primary)',
            }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
