import Layout from '../components/Layout'
import { KolamBg, KolamDivider } from '../components/Kolam'

interface Config { [key: string]: string }

const VENUE_ADDRESS = '341 75th St, Willowbrook, IL 60527'
const VENUE_MAPS_URL = 'https://maps.google.com/?q=341+75th+St,+Willowbrook,+IL+60527'

const AIRPORTS = [
  {
    code: 'ORD',
    name: "Chicago O'Hare International Airport",
    distance: '28 miles',
    driveTime: '35–50 min',
    note: 'Largest airport in the Chicago area. Served by most major domestic and international airlines.',
    mapsUrl: 'https://maps.google.com/?saddr=Chicago+O%27Hare+International+Airport&daddr=341+75th+St,+Willowbrook,+IL+60527',
  },
  {
    code: 'MDW',
    name: 'Chicago Midway International Airport',
    distance: '17 miles',
    driveTime: '25–35 min',
    note: 'Closer to the venue. Served by Southwest Airlines and several other carriers.',
    mapsUrl: 'https://maps.google.com/?saddr=Chicago+Midway+International+Airport&daddr=341+75th+St,+Willowbrook,+IL+60527',
  },
]

export default function TravelPage({ config = {} }: { config: Config }) {
  const name1 = config.couple_name_1 || 'Sahana'
  const name2 = config.couple_name_2 || 'Sabari'

  let hotels: { name: string; address: string; phone?: string; url?: string; notes?: string }[] = []
  try { hotels = JSON.parse(config.hotels_content || '[]') } catch {}

  return (
    <Layout coupleName1={name1} coupleName2={name2}>
      {/* Hero */}
      <section style={{ background: 'var(--color-primary)', padding: '80px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <KolamBg opacity={0.05} />
        <div className="uppercase text-accent" style={{ marginBottom: 8, position: 'relative', zIndex: 1 }}>Getting here</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 400, color: 'rgba(250,247,242,0.95)', position: 'relative', zIndex: 1 }}>
          Travel &amp; Stay
        </h1>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>

          {/* Venue */}
          <div style={{ marginBottom: 56 }}>
            <div className="uppercase text-accent" style={{ marginBottom: 12 }}>Venue</div>
            <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>Ceremony &amp; Reception Venue</div>
                <div style={{ color: 'var(--color-muted)', fontSize: 15 }}>{VENUE_ADDRESS}</div>
              </div>
              <a href={VENUE_MAPS_URL} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: 11, letterSpacing: '2px', whiteSpace: 'nowrap' }}>
                Get Directions ↗
              </a>
            </div>
          </div>

          {/* Airports */}
          <div style={{ marginBottom: 56 }}>
            <div className="uppercase text-accent" style={{ marginBottom: 12 }}>Nearest Airports</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {AIRPORTS.map(airport => (
                <div key={airport.code} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '24px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--color-accent)', lineHeight: 1 }}>{airport.code}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{airport.name}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                      <div className="form-label" style={{ marginBottom: 3 }}>Distance</div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{airport.distance}</div>
                    </div>
                    <div>
                      <div className="form-label" style={{ marginBottom: 3 }}>Drive Time</div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{airport.driveTime}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.65, marginBottom: 16 }}>{airport.note}</p>

                  <a href={airport.mapsUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-accent)', textDecoration: 'none' }}>
                    Directions from this airport ↗
                  </a>
                </div>
              ))}
            </div>
          </div>

          <KolamDivider />

          {/* Hotels */}
          <div>
            <div className="uppercase text-accent" style={{ marginBottom: 12 }}>Where to Stay</div>

            {hotels.length === 0 ? (
              <div style={{ background: 'var(--color-white)', border: '1px dashed var(--color-border)', borderRadius: 6, padding: '40px 28px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Hotel Information Coming Soon</div>
                <p style={{ color: 'var(--color-muted)', fontSize: 15, maxWidth: 420, margin: '0 auto' }}>
                  We are finalising hotel recommendations and room block details. Check back soon!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {hotels.map((h, i) => (
                  <div key={i} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>{h.name}</div>
                        {h.address && <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>{h.address}</div>}
                        {h.phone && <div style={{ color: 'var(--color-muted)', fontSize: 14, marginTop: 2 }}>{h.phone}</div>}
                        {h.notes && <p style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 10, lineHeight: 1.65 }}>{h.notes}</p>}
                      </div>
                      {h.url && (
                        <a href={h.url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: 11, letterSpacing: '2px', whiteSpace: 'nowrap' }}>
                          Book Now ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </Layout>
  )
}
