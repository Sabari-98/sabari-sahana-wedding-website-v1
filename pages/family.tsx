import Layout from '../components/Layout'
import { KolamBg, KolamDivider } from '../components/Kolam'

interface Config { [key: string]: string }

interface FamilyMember {
  name: string
  title: string
  photo?: string
  side?: 'bride' | 'groom' | 'both'
}

interface FamilyGroup {
  groupTitle: string
  members: FamilyMember[]
}

export default function FamilyPage({ config = {} }: { config: Config }) {
  const name1 = config.couple_name_1 || 'Sahana'
  const name2 = config.couple_name_2 || 'Sabari'

  let groups: FamilyGroup[] = []
  try { groups = JSON.parse(config.family_content || '[]') } catch {}

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
        <div className="uppercase text-accent" style={{ marginBottom: 8, position: 'relative', zIndex: 1 }}>
          With love &amp; gratitude
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 400,
          color: 'rgba(250,247,242,0.95)',
          position: 'relative',
          zIndex: 1,
        }}>
          Our Families
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 18,
          color: 'rgba(250,247,242,0.45)',
          marginTop: 16,
          position: 'relative',
          zIndex: 1,
          maxWidth: 480,
          margin: '16px auto 0',
          lineHeight: 1.7,
        }}>
          The people who raised us, shaped us, and stand beside us today
        </p>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 1000 }}>

          {groups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 12 }}>Coming Soon</div>
              <p style={{ color: 'var(--color-muted)', fontSize: 15 }}>
                Family details will be added shortly.
              </p>
            </div>
          ) : (
            groups.map((group, gi) => (
              <div key={gi} style={{ marginBottom: 64 }}>
                {/* Group title */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <div className="uppercase text-accent" style={{ marginBottom: 8 }}>{group.groupTitle}</div>
                  <div style={{ height: 1, background: 'var(--color-border)', maxWidth: 200, margin: '0 auto' }} />
                </div>

                {/* Members grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 32,
                  justifyItems: 'center',
                }}>
                  {group.members.map((member, mi) => (
                    <div key={mi} style={{ textAlign: 'center', maxWidth: 220 }}>
                      {/* Photo */}
                      <div style={{
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 16px',
                        border: '2px solid var(--color-border-accent)',
                        background: 'var(--color-accent-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 40,
                            color: 'var(--color-accent)',
                            fontWeight: 300,
                          }}>
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22,
                        fontWeight: 400,
                        color: 'var(--color-primary)',
                        marginBottom: 4,
                      }}>
                        {member.name}
                      </div>

                      {/* Title */}
                      <div style={{
                        fontSize: 11,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                      }}>
                        {member.title}
                      </div>
                    </div>
                  ))}
                </div>

                {gi < groups.length - 1 && <KolamDivider />}
              </div>
            ))
          )}
        </div>
      </section>
    </Layout>
  )
}
