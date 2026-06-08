import Nav from './Nav'
import { KolamDivider } from './Kolam'

interface LayoutProps {
  children: React.ReactNode
  coupleName1?: string
  coupleName2?: string
}

export default function Layout({ children, coupleName1 = 'Priya', coupleName2 = 'Arjun' }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav coupleName1={coupleName1} coupleName2={coupleName2} />
      <main style={{ flex: 1, paddingTop: 64 }}>{children}</main>
      <footer style={{
        background: 'var(--color-primary)',
        color: 'rgba(250,247,242,0.6)',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'rgba(250,247,242,0.9)', marginBottom: 8 }}>
          {coupleName1} <span style={{ color: 'var(--color-accent)' }}>&</span> {coupleName2}
        </div>
        <div style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase' }}>
          With love &amp; gratitude
        </div>
      </footer>
    </div>
  )
}
