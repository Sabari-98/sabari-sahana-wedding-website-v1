import { useState, useEffect } from 'react'
import { AdminLayout, useAdminAuth, AdminLogin } from '../../components/AdminLayout'
import { EVENT_META, EventId } from '../../lib/supabase'

const ALL_EVENTS: EventId[] = ['haldi', 'sangeet', 'ceremony', 'reception']

interface RsvpRow {
  guest_name: string
  household_name: string
  event_id: EventId
  status: 'attending' | 'declined' | 'pending'
}

export default function RsvpsPage() {
  const { authed } = useAdminAuth()
  const [rsvps, setRsvps] = useState<RsvpRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<EventId | 'all'>('all')

  useEffect(() => {
    if (!authed) return
    fetch('/api/admin/rsvps')
      .then(r => r.json())
      .then(data => { setRsvps(data.rsvps || []); setLoading(false) })
  }, [authed])

  if (authed === null) return null
  if (!authed) return <AdminLogin />

  const filtered = filter === 'all' ? rsvps : rsvps.filter(r => r.event_id === filter)

  const counts = (evtId: EventId | 'all') => {
    const rows = evtId === 'all' ? rsvps : rsvps.filter(r => r.event_id === evtId)
    return {
      attending: rows.filter(r => r.status === 'attending').length,
      declined: rows.filter(r => r.status === 'declined').length,
      pending: rows.filter(r => r.status === 'pending').length,
    }
  }

  const total = counts('all')

  const statusStyle = (s: string) => ({
    padding: '2px 10px',
    fontSize: 10,
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    borderRadius: 2,
    background: s === 'attending' ? '#DCFCE7' : s === 'declined' ? '#FEE2E2' : '#FEF9C3',
    color: s === 'attending' ? '#15803D' : s === 'declined' ? '#DC2626' : '#92400E',
  })

  return (
    <AdminLayout title="RSVPs">
      {/* Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Attending', value: total.attending, color: '#15803D' },
          { label: 'Declined', value: total.declined, color: '#DC2626' },
          { label: 'Pending', value: total.pending, color: '#92400E' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #E7E5E4', borderRadius: 6, padding: '16px 24px', minWidth: 100, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#78716C', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-event breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {ALL_EVENTS.map(evtId => {
          const meta = EVENT_META[evtId]
          const c = counts(evtId)
          return (
            <div key={evtId} style={{ background: 'white', border: `1px solid ${meta.color}33`, borderTop: `3px solid ${meta.color}`, borderRadius: 6, padding: '16px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: meta.color, marginBottom: 8 }}>{meta.emoji} {meta.label}</div>
              <div style={{ fontSize: 13, color: '#78716C', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span>✓ {c.attending} attending</span>
                <span>✕ {c.declined} declined</span>
                <span>? {c.pending} pending</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {([['all', 'All Events'], ...ALL_EVENTS.map(e => [e, EVENT_META[e].label])] as [string, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id as any)} style={{
            padding: '6px 14px', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
            border: `1px solid ${filter === id ? '#C8860A' : '#E7E5E4'}`,
            background: filter === id ? '#C8860A15' : 'white',
            color: filter === id ? '#C8860A' : '#78716C',
            borderRadius: 2, cursor: 'pointer',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#78716C' }}>Loading…</div>
      ) : (
        <div style={{ background: 'white', border: '1px solid #E7E5E4', borderRadius: 6, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #E7E5E4' }}>
                {['Household', 'Guest', 'Event', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#78716C', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F5F4F2' }}>
                  <td style={{ padding: '10px 16px', fontSize: 14, color: '#78716C' }}>{r.household_name}</td>
                  <td style={{ padding: '10px 16px', fontSize: 14 }}>{r.guest_name}</td>
                  <td style={{ padding: '10px 16px', fontSize: 14 }}>
                    <span style={{ color: EVENT_META[r.event_id]?.color }}>{EVENT_META[r.event_id]?.emoji} {EVENT_META[r.event_id]?.label}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={statusStyle(r.status)}>{r.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: '#78716C', fontStyle: 'italic', fontSize: 14 }}>No RSVPs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
