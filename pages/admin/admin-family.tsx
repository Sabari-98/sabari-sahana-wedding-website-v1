import { useState, useEffect, useRef } from 'react'
import { AdminLayout, useAdminAuth, AdminLogin } from '../../components/AdminLayout'

interface FamilyMember {
  name: string
  title: string
  photo: string
}

interface FamilyGroup {
  groupTitle: string
  members: FamilyMember[]
}

export default function AdminFamilyPage() {
  const { authed } = useAdminAuth()
  const [groups, setGroups] = useState<FamilyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    if (!authed) return
    fetch('/api/admin/config')
      .then(r => r.json())
      .then(data => {
        try {
          setGroups(JSON.parse(data.config?.family_content || '[]'))
        } catch {
          setGroups([])
        }
        setLoading(false)
      })
  }, [authed])

  if (authed === null) return null
  if (!authed) return <AdminLogin />

  const addGroup = () => {
    setGroups([...groups, { groupTitle: '', members: [] }])
  }

  const removeGroup = (gi: number) => {
    setGroups(groups.filter((_, i) => i !== gi))
  }

  const updateGroupTitle = (gi: number, title: string) => {
    setGroups(groups.map((g, i) => i === gi ? { ...g, groupTitle: title } : g))
  }

  const addMember = (gi: number) => {
    setGroups(groups.map((g, i) => i === gi
      ? { ...g, members: [...g.members, { name: '', title: '', photo: '' }] }
      : g
    ))
  }

  const removeMember = (gi: number, mi: number) => {
    setGroups(groups.map((g, i) => i === gi
      ? { ...g, members: g.members.filter((_, j) => j !== mi) }
      : g
    ))
  }

  const updateMember = (gi: number, mi: number, field: string, value: string) => {
    setGroups(groups.map((g, i) => i === gi
      ? {
          ...g,
          members: g.members.map((m, j) => j === mi ? { ...m, [field]: value } : m),
        }
      : g
    ))
  }

  const handlePhotoUpload = async (gi: number, mi: number, file: File) => {
    // Convert to base64 data URL for storage
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      updateMember(gi, mi, 'photo', dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: { family_content: JSON.stringify(groups) },
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AdminLayout title="Our Families">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: '#78716C', fontSize: 14, maxWidth: 500 }}>
          Organise family members into groups (e.g. "Bride's Family", "Groom's Family"). Each member can have a name, title, and photo.
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 13, color: '#0F766E' }}>✓ Saved</span>}
          <button className="btn btn-accent" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#78716C' }}>Loading…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {groups.map((group, gi) => (
            <div key={gi} style={{ background: 'white', border: '1px solid #E7E5E4', borderRadius: 8, overflow: 'hidden' }}>
              {/* Group header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #E7E5E4', display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  className="form-input"
                  placeholder="Group title (e.g. Bride's Family)"
                  value={group.groupTitle}
                  onChange={e => updateGroupTitle(gi, e.target.value)}
                  style={{ flex: 1, fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}
                />
                <button
                  onClick={() => removeGroup(gi)}
                  style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: '4px 8px', flexShrink: 0 }}
                >
                  ✕
                </button>
              </div>

              {/* Members */}
              <div style={{ padding: '16px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {group.members.map((member, mi) => (
                    <div key={mi} style={{ background: '#FAF7F2', borderRadius: 6, padding: 16, position: 'relative' }}>
                      <button
                        onClick={() => removeMember(gi, mi)}
                        style={{ position: 'absolute', top: 10, right: 10, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
                      >
                        ✕
                      </button>

                      {/* Photo upload */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div
                          onClick={() => fileInputRefs.current[`${gi}-${mi}`]?.click()}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            border: '2px dashed #C8860A',
                            background: member.photo ? 'transparent' : '#FFF8E7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          {member.photo ? (
                            <img src={member.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 22, color: '#C8860A' }}>+</span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#78716C', marginBottom: 4 }}>Click circle to upload photo</div>
                          {member.photo && (
                            <button
                              onClick={() => updateMember(gi, mi, 'photo', '')}
                              style={{ fontSize: 11, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                              Remove photo
                            </button>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          ref={el => { fileInputRefs.current[`${gi}-${mi}`] = el }}
                          onChange={e => e.target.files?.[0] && handlePhotoUpload(gi, mi, e.target.files[0])}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 8 }}>
                        <label className="form-label">Full Name</label>
                        <input
                          className="form-input"
                          placeholder="e.g. Lakshmi Subramanian"
                          value={member.name}
                          onChange={e => updateMember(gi, mi, 'name', e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Title / Relation</label>
                        <input
                          className="form-input"
                          placeholder="e.g. Mother of the Bride"
                          value={member.title}
                          onChange={e => updateMember(gi, mi, 'title', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add member button */}
                  <div
                    onClick={() => addMember(gi)}
                    style={{
                      background: 'transparent',
                      border: '2px dashed #E7E5E4',
                      borderRadius: 6,
                      padding: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      minHeight: 120,
                      color: '#C7C3BF',
                      fontSize: 13,
                      letterSpacing: '1px',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C8860A'; (e.currentTarget as HTMLElement).style.color = '#C8860A' }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E7E5E4'; (e.currentTarget as HTMLElement).style.color = '#C7C3BF' }}
                  >
                    + Add Member
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add group */}
          <button
            className="btn btn-outline"
            onClick={addGroup}
            style={{ alignSelf: 'flex-start', fontSize: 11, letterSpacing: '2px' }}
          >
            + Add Group
          </button>
        </div>
      )}
    </AdminLayout>
  )
}
