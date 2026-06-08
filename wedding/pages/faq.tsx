import Layout from '../components/Layout'
import { KolamBg } from '../components/Kolam'
import { useState } from 'react'

interface Config { [key: string]: string }

export default function FAQPage({ config = {} }: { config: Config }) {
  const name1 = config.couple_name_1 || 'Priya'
  const name2 = config.couple_name_2 || 'Arjun'
  const [open, setOpen] = useState<number | null>(0)

  let faqs: { q: string; a: string }[] = []
  try { faqs = JSON.parse(config.faq_content || '[]') } catch {}

  return (
    <Layout coupleName1={name1} coupleName2={name2}>
      <section style={{ background: 'var(--color-primary)', padding: '80px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <KolamBg opacity={0.05} />
        <div className="uppercase text-accent" style={{ marginBottom: 8, position: 'relative', zIndex: 1 }}>Questions</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 400, color: 'rgba(250,247,242,0.95)', position: 'relative', zIndex: 1 }}>
          FAQ
        </h1>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 680 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: 16,
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--color-primary)' }}>{faq.q}</span>
                <span style={{ color: 'var(--color-accent)', fontSize: 20, flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: 20, fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.8 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}

          {faqs.length === 0 && (
            <p style={{ color: 'var(--color-muted)', fontStyle: 'italic', textAlign: 'center' }}>FAQs coming soon.</p>
          )}

          <div style={{ marginTop: 48, padding: '28px', background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>Still have questions?</div>
            <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 16 }}>
              Reach out and we'll be happy to help.
            </p>
            <a href={`mailto:${config.contact_email || 'hello@example.com'}`} className="btn btn-outline">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
