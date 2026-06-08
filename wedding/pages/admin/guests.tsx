import { useState, useEffect, useRef } from 'react'
import { AdminLayout, useAdminAuth, AdminLogin } from '../../components/AdminLayout'
import { EVENT_META, EventId } from '../../lib/supabase'
import Papa from 'papaparse'

interface Guest {
  id: string
  full_name: string
  email: string | null
  events: EventId[]
  household_id: string
  household_name?: string
}

interface Household {
  id: string
  name: string
  guests: Guest[]
}

const ALL_EVENTS: EventId[] = ['haldi', 'sangeet', 'ceremony', 'reception']

export default function GuestsPage() {
  const { authed } = useAdminAuth()
  const [households, setHouseholds] = useState<Household[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingHh, setEditingHh] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [importPreview, setImportPreview] = useState<any[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  // New household form
  const [hhName, setHhName] = useState('')
  const [hhGuests, setHhGuests] = useState([{ name: '', email: '', events: [] as EventId[] }])

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/guests')
    const data = await res.json()
    setHouseholds(data.households || [])
    setLoading(false)
  }

  useEffect(() => { if (authed) fetchData() }, [authed])

  if (authed === null) return null
  if (!authed) return <AdminLogin />

  const filtered = search
    ? households.filter(hh =>
        hh.name.toLowerCase().includes(search.toLowerCase()) ||
        hh.guests.some(g => g.full_name.toLowerCase().includes(search.toLowerCase()) || (g.email || '').toLowerCase().includes(search.toLowerCase()))
      )
    : households

  const totalGuests = households.reduce((n, hh) => n + hh.guests.length, 0)

  // Add guest row to form
  const addGuestRow = () => setHhGuests([...hhGuests, { name: '', email: '', events: [] }])
  const removeGuestRow = (i: number) => setHhGuests(hhGuests.filter((_, idx) => idx !== i))
  const updateGuestRow = (i: number, field: string, value: any) => {
    setHhGuests(hhGuests.map((g, idx) => idx === i ? { ...g, [field]: value } : g))
  }

  const toggleEvent = (guestIdx: number, evtId: EventId) => {
    const g = hhGuests[guestIdx]
    const events = g.events.includes(evtId) ? g.events.filter(e => e !== evtId) : [...g.events, evtId]
    updateGuestRow(guestIdx, 'events', events)
  }

  const handleSaveHousehold = async () => {
    if (!hhName.trim() || hhGuests.every(g => !g.name.trim())) return
    setSaving(true)
    await fetch('/api/admin/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        householdName: hhName,
        guests: hhGuests.filter(g => g.name.trim()),
      }),
    })
    setSaving(false)
    setShowAdd(false)
    setHhName('')
    setHhGuests([{ name: '', email: '', events: [] }])
    fetchData()
  }

  const handleDeleteHousehold = async (hhId: string) => {
    if (!confirm('Delete this household and all guests?')) return
    await fetch(`/api/admin/guests?householdId=${hhId}`, { method: 'DELETE' })
    fetchData()
  }

  const handleCSVParse = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setImportPreview(results.data as any[])
        setShowImport(true)
      },
    })
  }

  const handleImport = async () => {
    setSaving(true)
    await fetch('/api/admin/guests/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: importPreview }),
    })
    setSaving(false)
    setShowImport(false)
    setImportPreview([])
    fetchData()
  }

  return (
    <AdminLayout title="Guests">
      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Households', value: households.length },
          { label: 'Total Guests', value: totalGuests },
          ...ALL_EVENTS.map(evtId => ({
            label: EVENT_META[evtId].label,
            value: households.reduce((n, hh) => n + hh.guests.filter(g => (g.events || []).includes(evtId)).length, 0),
            color: EVENT_META[evtId].color,
          })),
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #E7E5E4', borderRadius: 6, padding: '16px 20px', minWidth: 100 }}>
            <div style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", color: (s as any).color || '#1C1917', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#78716C', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-input"
          placeholder="Search guests or households…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <div style={{ flex: 1 }} />
        <button className="btn btn-outline" onClick={() => fileRef.current?.click()} style={{ fontSize: 11, letterSpacing: '2px' }}>
          Import CSV
        </button>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleCSVParse(e.target.files[0])} />
        <button className="btn btn-accent" onClick={() => setShowAdd(true)} style={{ fontSize: 11, letterSpacing: '2px' }}>
          + Add Household
        </button>
      </div>

      {/* Household list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#78716C' }}>Loading…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.map(hh => (
            <div key={hh.id} style={{ background: 'white', border: '1px solid #E7E5E4' }}>
              {/* Household header */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 12, borderBottom: editingHh === hh.id ? '1px solid #E7E5E4' : 'none' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, flex: 1 }}>{hh.name}</span>
                <span style={{ fontSize: 12, color: '#78716C' }}>{hh.guests.length} {hh.guests.length === 1 ? 'guest' : 'guests'}</span>
                <button className="btn btn-ghost" style={{ fontSize: 10 }} onClick={() => setEditingHh(editingHh === hh.id ? null : hh.id)}>
                  {editingHh === hh.id ? 'Close' : 'Edit'}
                </button>
                <button onClick={() => handleDeleteHousehold(hh.id)} style={{ fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>✕</button>
              </div>

              {/* Guest rows */}
              {(editingHh === hh.id ? hh.guests : hh.guests).map(g => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px 10px 36px', gap: 12, borderBottom: '1px solid #F5F4F2', flexWrap: 'wrap' }}>
                  <span style={{ minWidth: 160, fontSize: 14 }}>{g.full_name}</span>
                  <span style={{ fontSize: 13, color: '#78716C', flex: 1 }}>{g.email || '—'}</span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {ALL_EVENTS.map(evtId => {
                      const invited = (g.events || []).includes(evtId)
                      const meta = EVENT_META[evtId]
                      return (
                        <span key={evtId} style={{
                          padding: '2px 8px',
                          fontSize: 10,
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                          borderRadius: 2,
                          border: `1px solid ${invited ? meta.color : '#E7E5E4'}`,
                          background: invited ? meta.color + '15' : 'transparent',
                          color: invited ? meta.color : '#C7C3BF',
                        }}>
                          {meta.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: 48, color: '#78716C', fontStyle: 'italic' }}>
              {search ? 'No guests match your search.' : 'No guests yet. Add a household to get started.'}
            </div>
          )}
        </div>
      )}

      {/* Add Household Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => { if (e.target === e.currentTarget) setShowAdd(false) }}>
          <div style={{ background: 'white', borderRadius: 8, padding: 32, width: '100%', maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24 }}>Add Household</h2>
              <button onClick={() => setShowAdd(false)} style={{ fontSize: 20, color: '#78716C', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Household Name</label>
              <input className="form-input" placeholder="e.g. The Sharma Family" value={hhName} onChange={e => setHhName(e.target.value)} />
            </div>

            <div style={{ marginBottom: 12, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#78716C' }}>Guests</div>

            {hhGuests.map((g, i) => (
              <div key={i} style={{ background: '#FAF7F2', borderRadius: 4, padding: '16px', marginBottom: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 12, alignItems: 'end' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input className="form-input" placeholder="e.g. Rahul Sharma" value={g.name} onChange={e => updateGuestRow(i, 'name', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email (optional)</label>
                    <input className="form-input" type="email" placeholder="email@example.com" value={g.email} onChange={e => updateGuestRow(i, 'email', e.target.value)} />
                  </div>
                  {hhGuests.length > 1 && (
                    <button onClick={() => removeGuestRow(i)} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 8px', fontSize: 16 }}>✕</button>
                  )}
                </div>
                <div>
                  <div className="form-label" style={{ marginBottom: 8 }}>Invited Events</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {ALL_EVENTS.map(evtId => {
                      const meta = EVENT_META[evtId]
                      const sel = g.events.includes(evtId)
                      return (
                        <button key={evtId} onClick={() => toggleEvent(i, evtId)} style={{
                          padding: '5px 12px', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
                          border: `1px solid ${sel ? meta.color : '#E7E5E4'}`,
                          background: sel ? meta.color : 'white',
                          color: sel ? 'white' : '#78716C',
                          borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          {meta.emoji} {meta.label}
                        </button>
                      )
                    })}
                    <button onClick={() => updateGuestRow(i, 'events', ALL_EVENTS)} style={{ padding: '5px 10px', fontSize: 10, letterSpacing: '1px', border: '1px dashed #C7C3BF', background: 'transparent', color: '#78716C', borderRadius: 2, cursor: 'pointer' }}>
                      All
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button className="btn btn-outline" onClick={addGuestRow} style={{ marginBottom: 24, fontSize: 11 }}>
              + Add Another Guest
            </button>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-accent" onClick={handleSaveHousehold} disabled={saving || !hhName.trim()}>
                {saving ? 'Saving…' : 'Save Household'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 8, padding: 32, width: '100%', maxWidth: 760, maxHeight: '80vh', overflow: 'auto' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, marginBottom: 8 }}>Import Guests from CSV</h2>
            <p style={{ color: '#78716C', fontSize: 14, marginBottom: 16 }}>
              Expected columns: <code>household_name, full_name, email, haldi, sangeet, ceremony, reception</code> (use Y/y/1/true for invited)
            </p>

            <div style={{ overflowX: 'auto', marginBottom: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#FAF7F2' }}>
                    {Object.keys(importPreview[0] || {}).map(k => (
                      <th key={k} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#78716C', borderBottom: '1px solid #E7E5E4' }}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importPreview.slice(0, 10).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F5F4F2' }}>
                      {Object.values(row).map((v: any, j) => (
                        <td key={j} style={{ padding: '8px 12px', color: '#1C1917' }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {importPreview.length > 10 && <div style={{ textAlign: 'center', padding: 8, color: '#78716C', fontSize: 12 }}>…and {importPreview.length - 10} more rows</div>}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => { setShowImport(false); setImportPreview([]) }}>Cancel</button>
              <button className="btn btn-accent" onClick={handleImport} disabled={saving}>
                {saving ? 'Importing…' : `Import ${importPreview.length} guests`}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
