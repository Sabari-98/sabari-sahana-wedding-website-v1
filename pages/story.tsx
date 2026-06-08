import Layout from '../components/Layout'
import { KolamDivider, KolamBg } from '../components/Kolam'

interface Config { [key: string]: string }

export default function StoryPage({ config = {} }: { config: Config }) {
  const name1 = config.couple_name_1 || 'Priya'
  const name2 = config.couple_name_2 || 'Arjun'
  const title = config.story_title || 'Our Story'
  const content = config.story_content || 'Tell your story here — how you met, your journey together, and what makes your love unique.'

  const paragraphs = content.split('\n').filter(Boolean)

  return (
    <Layout coupleName1={name1} coupleName2={name2}>
      {/* Hero */}
      <section style={{
        background: 'var(--color-primary)',
        padding: '80px 24px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <KolamBg opacity={0.05} />
        <div className="uppercase text-accent" style={{ marginBottom: 8, position: 'relative', zIndex: 1 }}>A love story</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 400, color: 'rgba(250,247,242,0.95)', position: 'relative', zIndex: 1 }}>
          {title}
        </h1>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: 660 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 2, color: 'var(--color-primary)' }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 24, fontStyle: i === 0 ? 'italic' : 'normal' }}>{p}</p>
            ))}
          </div>

          <KolamDivider />

          <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--color-primary)' }}>
            {name1} <span style={{ color: 'var(--color-accent)' }}>&</span> {name2}
          </div>
        </div>
      </section>
    </Layout>
  )
}
