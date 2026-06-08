import Layout from '../components/Layout'
import { KolamDivider } from '../components/Kolam'
import { EVENT_META, EventId, supabase } from '../lib/supabase'
import { GetServerSideProps } from 'next'

interface EventData {
  id: EventId
  event_date: string | null
  event_time: string | null
  venue: string
  address: string
  dress_code: string
  notes: string
}

interface Config { [key: string]: string }

interface Props {
  events: EventData[]
  config: Config
}

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(t: string | null) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function EventsPage({ events, config }: Props) {
  const name1 = config.couple_name_1 || 'Priya'
  const name2 = config.couple_name_2 || 'Arjun'

  return (
    <Layout coupleName1={name1} coupleName2={name2}>
      <section style={{ padding: '80px 0 40px', background: 'var(--color-primary)', textAlign: 'center' }}>
        <div className="uppercase text-accent" style={{ marginBottom: 8 }}>The Celebrations</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 400, color: 'rgba(250,247,242,0.95)' }}>
          Events &amp; Schedule
        </h1>
      </section>

      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          {events.map((evt, i) => {
            const meta = EVENT_META[evt.id]
            const hasDetails = evt.event_date || evt.venue || evt.event_time
            return (
              <div key={evt.id}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }} className="event-row">
                  {/* Left */}
                  <div>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{meta.emoji}</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: meta.color, marginBottom: 8 }}>
                      {meta.label}
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
                      {meta.description}
                    </p>
                  </div>

                  {/* Right */}
                  <div>
                    {!hasDetails ? (
                      <div style={{ padding: '24px', background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-muted)', fontSize: 14, fontStyle: 'italic' }}>
                        Details coming soon — check back closer to the date.
                      </div>
                    ) : (
                      <div style={{ padding: '28px', background: 'var(--color-white)', border: `1px solid rgba(${hexToRgb(meta.color)},0.15)`, borderRadius: 6, borderTop: `3px solid ${meta.color}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: evt.notes ? 20 : 0 }}>
                          {evt.event_date && (
                            <div>
                              <div className="form-label" style={{ marginBottom: 4 }}>Date</div>
                              <div style={{ fontSize: 15 }}>{formatDate(evt.event_date)}</div>
                            </div>
                          )}
                          {evt.event_time && (
                            <div>
                              <div className="form-label" style={{ marginBottom: 4 }}>Time</div>
                              <div style={{ fontSize: 15 }}>{formatTime(evt.event_time)}</div>
                            </div>
                          )}
                          {evt.venue && (
                            <div>
                              <div className="form-label" style={{ marginBottom: 4 }}>Venue</div>
                              <div style={{ fontSize: 15 }}>{evt.venue}</div>
                            </div>
                          )}
                          {evt.dress_code && (
                            <div>
                              <div className="form-label" style={{ marginBottom: 4 }}>Dress Code</div>
                              <div style={{ fontSize: 15 }}>{evt.dress_code}</div>
                            </div>
                          )}
                          {evt.address && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <div className="form-label" style={{ marginBottom: 4 }}>Address</div>
                              <a
                                href={`https://maps.google.com?q=${encodeURIComponent(evt.address)}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ fontSize: 15, color: meta.color, textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.2s' }}
                                onMouseOver={e => (e.currentTarget.style.textDecorationColor = meta.color)}
                                onMouseOut={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
                              >
                                {evt.address} ↗
                              </a>
                            </div>
                          )}
                        </div>
                        {evt.notes && (
                          <div style={{ paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                            <div className="form-label" style={{ marginBottom: 6 }}>Notes</div>
                            <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.7 }}>{evt.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {i < events.length - 1 && <KolamDivider />}
              </div>
            )
          })}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .event-row { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </Layout>
  )
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await supabase.from('events').select('*').order('id')
  return { props: { events: data || [] } }
}
