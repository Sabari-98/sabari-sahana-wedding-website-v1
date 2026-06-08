import Layout from '../components/Layout'
import { KolamBg } from '../components/Kolam'

interface Config { [key: string]: string }

export default function TravelPage({ config = {} }: { config: Config }) {
  const name1 = config.couple_name_1 || 'Sahana'
  const name2 = config.couple_name_2 || 'Sabari'
  const content = config.travel_content || 'Add travel and accommodation information here.'
  const paragraphs = content.split('\n').filter(Boolean)

  return (
    <Layout coupleName1={name1} coupleName2={name2}>
      <section style={{ background: 'var(--color-primary)', padding: '80px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <KolamBg opacity={0.05} />
        <div className="uppercase text-accent" style={{ marginBottom: 8, position: 'relative', zIndex: 1 }}>Getting here</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 400, color: 'rgba(250,247,242,0.95)', position: 'relative', zIndex: 1 }}>
          Travel &amp; Stay
        </h1>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 2, color: 'var(--color-primary)' }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 24 }}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
