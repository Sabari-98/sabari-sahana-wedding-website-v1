import { useState } from 'react'
import Layout from '../components/Layout'
import { KolamDivider, KolamBg } from '../components/Kolam'
import { supabase, EVENT_META, EventId } from '../lib/supabase'

interface Config { [key: string]: string }

interface GuestRow {
  id: string
  full_name: string
  email: string | null
  events: EventId[]
  household_id: string
}

interface RsvpRow {
  guest_id: string
  event_id: EventId
  status: 'attending' | 'declined' | 'pending'
}

type RsvpState = Record<string, Record<EventId, 'attending' | 'declined' | 'pending'>>

export default function RsvpPage({ config = {} }: { config: Config }) {
  const name1 = config.couple_name_1 || 'Priya'
  const name2 = config.couple_name_2 || 'Arjun'

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [household, setHousehold] = useState<{ name: string } | null>(null)
  const [guests, setGuests] = useState<GuestRow[]>([])
  const [rsvps, setRsvps] = useState<RsvpState>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setHousehold(null)
    setGuests([])
    setSaved(false)

    const q = query.trim().toLowerCase()

    // Search by email or full name
    const { data: found, error: err } = await supabase
      .from('guests')
      .select('id, full_name, email, events, household_id')
      .or(`email.ilike.${q},full_name.ilike.${q}`)
      .limit(5)

    if (err || !found || found.length === 0) {
      setError("We couldn't find you on the guest list. Try your full name or the email you were invited with.")
      setLoading(false)
      return
    }

    // Get household
    const householdId = found[0].household_id
    const { data: hhData } = await supabase
      .from('households')
      .select('name')
      .eq('id', householdId)
      .single()

    // Get all guests in household
    const { data: hhGuests } = await supabase
      .from('guests')
      .select('id, full_name, email, events, household_id')
      .eq('household_id', householdId)

    const guestList = hhGuests || []

    // Get existing RSVPs
    const guestIds = guestList.map(g => g.id)
    const { data: existingRsvps } = await supabase
      .from('rsvps')
      .select('guest_id, event_id, status')
      .in('guest_id', guestIds)

    // Build rsvp state
    const rsvpState: RsvpState = {}
    guestList.forEach(g => {
      rsvpState[g.id] = {} as Record<EventId, 'attending' | 'declined' | 'pending'>
      ;(g.events || []).forEach((evtId: EventId) => {
        rsvpState[g.id][evtId] = 'pending'
      })
    })
    ;(existingRsvps as RsvpRow[] || []).forEach(r => {
      if (!rsvpState[r.guest_id]) rsvpState[r.guest_id] = {} as Record<EventId, 'attending' | 'declined' | 'pending'>
      rsvpState[r.guest_id][r.event_id] = r.status
    })

    setHousehold(hhData || { name: 'Your household' })
    setGuests(guestList)
    setRsvps(rsvpState)
    setLoading(false)
  }

  const setRsvpStatus = (guestId: string, eventId: EventId, status: 'attending' | 'declined') => {
    setRsvps(prev => ({
      ...prev,
      [guestId]: { ...prev[guestId], [eventId]: status },
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const upserts: { guest_id: string; event_id: EventId; status: string; updated_at: string }[] = []
    guests.forEach(g => {
      const gRsvps = rsvps[g.id] || {}
      Object.entries(gRsvps).forEach(([evtId, status]) => {
        upserts.push({ guest_id: g.id, event_id: evtId as EventId, status, updated_at: new Date().toISOString() })
      })
    })
    await supabase.from('rsvps').upsert(upserts, { onConflict: 'guest_id,event_id' })
    setSaving(false)
    setSaved(true)
  }

  const allEvents = ['haldi', 'sangeet', 'ceremony', 'reception'] as EventId[]

  // Find events any guest in household is invited to
  const householdEvents = allEvents.filter(evtId =>
    guests.some(g => (g.events || []).includes(evtId))
  )

  return (
    <Layout coupleName1={name1} coupleName2={name2}>
      <section style={{ background: 'var(--color-primary)', padding: '80px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <KolamBg opacity={0.05} />
        <div className="uppercase text-accent" style={{ marginBottom: 8, position: 'relative', zIndex: 1 }}>Kindly reply</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 400, color: 'rgba(250,247,242,0.95)', position: 'relative', zIndex: 1 }}>
          RSVP
        </h1>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>

          {!household ? (
            /* ── Lookup form ── */
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic', color: 'var(--color-muted)', marginBottom: 32, lineHeight: 1.7 }}>
                Enter your full name or the email address you were invited with to find your invitation.
              </p>
              <form onSubmit={handleLookup}>
                <div className="form-group">
                  <input
                    className="form-input"
                    placeholder="Full name or email address"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setError('') }}
                    autoFocus
                    style={{ textAlign: 'center', fontSize: 16 }}
                  />
                </div>
                {error && (
                  <div style={{ color: '#DC2626', fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>{error}</div>
                )}
                <button type="submit" className="btn btn-primary" disabled={!query || loading} style={{ width: '100%' }}>
                  {loading ? 'Searching…' : 'Find My Invitation'}
                </button>
              </form>
            </div>
          ) : (
            /* ── RSVP form ── */
            <div>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div className="uppercase text-accent" style={{ marginBottom: 8 }}>Welcome</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400 }}>
                  {household.name}
                </h2>
                <p style={{ color: 'var(--color-muted)', fontSize: 14, marginTop: 8 }}>
                  Please RSVP for each person below
                </p>
              </div>

              {/* ── Header row showing invited events ── */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 16px 12px 0', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 400, minWidth: 160 }}>
                        Guest
                      </th>
                      {householdEvents.map(evtId => {
                        const meta = EVENT_META[evtId]
                        return (
                          <th key={evtId} style={{ textAlign: 'center', padding: '12px 8px', minWidth: 110 }}>
                            <div style={{ fontSize: 16, marginBottom: 2 }}>{meta.emoji}</div>
                            <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: meta.color, fontWeight: 400 }}>{meta.label}</div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((g, gi) => (
                      <tr key={g.id} style={{ borderTop: '1px solid var(--color-border)', background: gi % 2 === 0 ? 'var(--color-white)' : 'transparent' }}>
                        <td style={{ padding: '16px 16px 16px 0' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400 }}>{g.full_name}</div>
                        </td>
                        {householdEvents.map(evtId => {
                          const isInvited = (g.events || []).includes(evtId)
                          const status = rsvps[g.id]?.[evtId] || 'pending'
                          if (!isInvited) {
                            return <td key={evtId} style={{ textAlign: 'center', padding: '16px 8px' }}>
                              <span style={{ color: 'var(--color-border)', fontSize: 18 }}>—</span>
                            </td>
                          }
                          return (
                            <td key={evtId} style={{ textAlign: 'center', padding: '16px 8px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                                <button
                                  onClick={() => setRsvpStatus(g.id, evtId, 'attending')}
                                  style={{
                                    padding: '5px 12px',
                                    fontSize: 11,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    border: `1px solid ${status === 'attending' ? '#0F766E' : 'var(--color-border)'}`,
                                    background: status === 'attending' ? '#0F766E' : 'transparent',
                                    color: status === 'attending' ? 'white' : 'var(--color-muted)',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    width: 80,
                                  }}
                                >
                                  Attending
                                </button>
                                <button
                                  onClick={() => setRsvpStatus(g.id, evtId, 'declined')}
                                  style={{
                                    padding: '5px 12px',
                                    fontSize: 11,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    border: `1px solid ${status === 'declined' ? '#DC2626' : 'var(--color-border)'}`,
                                    background: status === 'declined' ? '#DC2626' : 'transparent',
                                    color: status === 'declined' ? 'white' : 'var(--color-muted)',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    width: 80,
                                  }}
                                >
                                  Declined
                                </button>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <KolamDivider />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <button
                  onClick={() => { setHousehold(null); setGuests([]); setQuery(''); setSaved(false) }}
                  className="btn btn-outline"
                  style={{ fontSize: 11, letterSpacing: '2px' }}
                >
                  ← Not you?
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {saved && (
                    <span style={{ fontSize: 13, color: '#0F766E', letterSpacing: '1px' }}>✓ Saved</span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-accent"
                  >
                    {saving ? 'Saving…' : 'Submit RSVP'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
