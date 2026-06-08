import { useState, useEffect } from 'react'
import { AdminLayout, useAdminAuth, AdminLogin } from '../../components/AdminLayout'
import { EVENT_META, EventId } from '../../lib/supabase'

const ALL_EVENTS: EventId[] = ['haldi', 'sangeet', 'ceremony', 'reception']

interface EventRow {
  id: EventId
  event_date: string | null
  event_time: string | null
  venue: string
  address: string
  dress_code: string
  notes: string
}

export default function AdminEventsPage() {
  const { authed } = useAdminAuth()
  const [events, setEvents] = useState<Record<EventId, EventRow>>({} as any)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<EventId | null>(null)
  const [saved, setSaved] = useState<EventId | null>(null)

  useEffect(() => {
    if (!authed) return
    fetch('/api/admin/events')
      .then(r => r.json())
      .then(data => {
        const map: any = {}
        ;(data.events || []).forEach((e: EventRow) => { map[e.id] = e })
        setEvents(map)
        setLoading(false)
      })
  }, [authed])

  if (authed === null) return null
  if (!authed) return <AdminLogin />

  const update = (evtId: EventId, field: string, value: string) => {
    setEvents(prev => ({ ...prev, [evtId]: { ...prev[evtId], [field]: value } }))
  }

  const saveEvent = async (evtId: EventId) => {
    setSaving(evtId)
    await fetch('/api/admin/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: evtId, ...events[evtId] }),
    })
    setSaving(null)
    setSaved(evtId)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <AdminLayout title="Events">
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#78716C' }}>Loading…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {ALL_EVENTS.map(evtId => {
            const meta = EVENT_META[evtId]
            const evt = events[evtId] || {}
            return (
              <div key={evtId} style={{ background: 'white', border: '1px solid #E7E5E4', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: `3px solid ${meta.color}`, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{meta.emoji}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: meta.color }}>{meta.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {saved === evtId && <span style={{ fontSize: 12, color: '#0F766E' }}>✓ Saved</span>}
                    <button className="btn btn-accent" onClick={() => saveEvent(evtId)} disabled={saving === evtId} style={{ fontSize: 11, letterSpacing: '2px', padding: '8px 18px' }}>
                      {saving === evtId ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Date</label>
                      <input type="date" className="form-input" value={evt.event_date || ''} onChange={e => update(evtId, 'event_date', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Time</label>
                      <input type="time" className="form-input" value={evt.event_time || ''} onChange={e => update(evtId, 'event_time', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Venue Name</label>
                      <input className="form-input" placeholder="e.g. The Grand Ballroom" value={evt.venue || ''} onChange={e => update(evtId, 'venue', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Dress Code</label>
                      <input className="form-input" placeholder="e.g. Traditional Indian Wear" value={evt.dress_code || ''} onChange={e => update(evtId, 'dress_code', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Address</label>
                    <input className="form-input" placeholder="Full venue address" value={evt.address || ''} onChange={e => update(evtId, 'address', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Notes for Guests</label>
                    <textarea className="form-input" placeholder="Parking, special instructions, etc." value={evt.notes || ''} onChange={e => update(evtId, 'notes', e.target.value)} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}
