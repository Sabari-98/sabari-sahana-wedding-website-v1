import Layout from '../components/Layout'
import { KolamDivider, KolamBg, KolamDiamond } from '../components/Kolam'

interface Config { [key: string]: string }

export default function RegistryPage({ config = {} }: { config: Config }) {
  const name1 = config.couple_name_1 || 'Priya'
  const name2 = config.couple_name_2 || 'Arjun'
  const note = config.registry_note || 'Your presence is the greatest gift. For those who wish to give, we are registered at the links below.'
  let links: { name: string; url: string }[] = []
  try { links = JSON.parse(config.registry_links || '[]') } catch {}

  return (
    <Layout coupleName1={name1} coupleName2={name2}>
      <section style={{ background: 'var(--color-primary)', padding: '80px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <KolamBg opacity={0.05} />
        <div className="uppercase text-accent" style={{ marginBottom: 8, position: 'relative', zIndex: 1 }}>Gifts</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 400, color: 'rgba(250,247,242,0.95)', position: 'relative', zIndex: 1 }}>
          Registry
        </h1>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
          <KolamDiamond size={40} color="var(--color-accent)" />

          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: 'var(--color-primary)', lineHeight: 1.8, margin: '32px 0 40px' }}>
            {note}
          </p>

          <KolamDivider />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            {links.map(l => (
              <a
                key={l.name}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ minWidth: 240 }}
              >
                {l.name} ↗
              </a>
            ))}
            {links.length === 0 && (
              <p style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Registry links coming soon.</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
