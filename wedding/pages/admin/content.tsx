import { useState, useEffect } from 'react'
import { AdminLayout, useAdminAuth, AdminLogin } from '../../components/AdminLayout'

type Section = 'general' | 'story' | 'travel' | 'faq' | 'registry' | 'design'

export default function ContentPage() {
  const { authed } = useAdminAuth()
  const [config, setConfig] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [section, setSection] = useState<Section>('general')
  const [faqItems, setFaqItems] = useState<{ q: string; a: string }[]>([])
  const [registryLinks, setRegistryLinks] = useState<{ name: string; url: string }[]>([])

  const fetchConfig = async () => {
    const res = await fetch('/api/admin/config')
    const data = await res.json()
    setConfig(data.config || {})
    try { setFaqItems(JSON.parse(data.config?.faq_content || '[]')) } catch { setFaqItems([]) }
    try { setRegistryLinks(JSON.parse(data.config?.registry_links || '[]')) } catch { setRegistryLinks([]) }
    setLoading(false)
  }

  useEffect(() => { if (authed) fetchConfig() }, [authed])

  if (authed === null) return null
  if (!authed) return <AdminLogin />

  const set = (key: string, value: string) => setConfig(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    const updates = {
      ...config,
      faq_content: JSON.stringify(faqItems),
      registry_links: JSON.stringify(registryLinks),
    }
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const SECTIONS: { id: Section; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'story', label: 'Our Story' },
    { id: 'travel', label: 'Travel' },
    { id: 'faq', label: 'FAQ' },
    { id: 'registry', label: 'Registry' },
    { id: 'design', label: 'Design' },
  ]

  return (
    <AdminLayout title="Content">
      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            padding: '8px 16px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
            border: `1px solid ${section === s.id ? '#C8860A' : '#E7E5E4'}`,
            background: section === s.id ? '#C8860A15' : 'white',
            color: section === s.id ? '#C8860A' : '#78716C',
            borderRadius: 2, cursor: 'pointer',
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? <div style={{ color: '#78716C', padding: 24 }}>Loading…</div> : (
        <div style={{ background: 'white', border: '1px solid #E7E5E4', borderRadius: 8, padding: 28 }}>

          {section === 'general' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'couple_name_1', label: 'Name 1 (e.g. Priya)' },
                { key: 'couple_name_2', label: 'Name 2 (e.g. Arjun)' },
                { key: 'wedding_date', label: 'Wedding Date', type: 'date' },
                { key: 'contact_email', label: 'Contact Email' },
                { key: 'site_password', label: 'Guest Site Password' },
                { key: 'hero_tagline', label: 'Hero Tagline' },
              ].map(f => (
                <div key={f.key} className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{f.label}</label>
                  <input type={f.type || 'text'} className="form-input" value={config[f.key] || ''} onChange={e => set(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {section === 'story' && (
            <div>
              <div className="form-group">
                <label className="form-label">Page Title</label>
                <input className="form-input" value={config.story_title || ''} onChange={e => set('story_title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Story Content (use blank lines to create paragraphs)</label>
                <textarea className="form-input" style={{ minHeight: 240 }} value={config.story_content || ''} onChange={e => set('story_content', e.target.value)} />
              </div>
            </div>
          )}

          {section === 'travel' && (
            <div>
              <div className="form-group">
                <label className="form-label">Travel & Accommodation Content (use blank lines for paragraphs)</label>
                <textarea className="form-input" style={{ minHeight: 280 }} value={config.travel_content || ''} onChange={e => set('travel_content', e.target.value)} placeholder="Add flight info, hotel recommendations, local transport tips, etc." />
              </div>
            </div>
          )}

          {section === 'faq' && (
            <div>
              {faqItems.map((item, i) => (
                <div key={i} style={{ background: '#FAF7F2', borderRadius: 4, padding: 16, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#78716C', letterSpacing: '1px', textTransform: 'uppercase' }}>Q{i + 1}</span>
                    <button onClick={() => setFaqItems(faqItems.filter((_, j) => j !== i))} style={{ fontSize: 14, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                  <div className="form-group" style={{ marginBottom: 8 }}>
                    <label className="form-label">Question</label>
                    <input className="form-input" value={item.q} onChange={e => setFaqItems(faqItems.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Answer</label>
                    <textarea className="form-input" value={item.a} onChange={e => setFaqItems(faqItems.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} />
                  </div>
                </div>
              ))}
              <button className="btn btn-outline" onClick={() => setFaqItems([...faqItems, { q: '', a: '' }])} style={{ fontSize: 11, marginBottom: 8 }}>
                + Add Question
              </button>
            </div>
          )}

          {section === 'registry' && (
            <div>
              <div className="form-group">
                <label className="form-label">Registry Note / Poem</label>
                <textarea className="form-input" style={{ minHeight: 120 }} value={config.registry_note || ''} onChange={e => set('registry_note', e.target.value)} />
              </div>
              <div className="form-label" style={{ marginBottom: 12 }}>Registry Links</div>
              {registryLinks.map((link, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 10, marginBottom: 8, alignItems: 'end' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Name</label>
                    <input className="form-input" placeholder="Zola" value={link.name} onChange={e => setRegistryLinks(registryLinks.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">URL</label>
                    <input className="form-input" placeholder="https://zola.com/registry/..." value={link.url} onChange={e => setRegistryLinks(registryLinks.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} />
                  </div>
                  <button onClick={() => setRegistryLinks(registryLinks.filter((_, j) => j !== i))} style={{ fontSize: 16, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 8px', marginBottom: 1 }}>✕</button>
                </div>
              ))}
              <button className="btn btn-outline" onClick={() => setRegistryLinks([...registryLinks, { name: '', url: '' }])} style={{ fontSize: 11 }}>
                + Add Registry
              </button>
            </div>
          )}

          {section === 'design' && (
            <div>
              <p style={{ fontSize: 14, color: '#78716C', marginBottom: 20, lineHeight: 1.6 }}>
                Customize your site's colors. Changes apply globally across all pages.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { key: 'primary_color', label: 'Primary Color', hint: 'Main dark color used for backgrounds and text' },
                  { key: 'accent_color', label: 'Accent / Gold Color', hint: 'Used for decorative elements and highlights' },
                ].map(f => (
                  <div key={f.key}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">{f.label}</label>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input type="color" value={config[f.key] || '#000000'} onChange={e => set(f.key, e.target.value)} style={{ width: 44, height: 40, border: '1px solid #E7E5E4', borderRadius: 4, cursor: 'pointer', padding: 2 }} />
                        <input className="form-input" value={config[f.key] || ''} onChange={e => set(f.key, e.target.value)} style={{ fontFamily: 'monospace' }} />
                      </div>
                      <div style={{ fontSize: 12, color: '#78716C', marginTop: 4 }}>{f.hint}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save bar */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #E7E5E4', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
            {saved && <span style={{ fontSize: 13, color: '#0F766E' }}>✓ Changes saved</span>}
            <button className="btn btn-accent" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
