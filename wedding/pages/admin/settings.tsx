import { AdminLayout, useAdminAuth, AdminLogin } from '../../components/AdminLayout'

export default function SettingsPage() {
  const { authed } = useAdminAuth()
  if (authed === null) return null
  if (!authed) return <AdminLogin />

  return (
    <AdminLayout title="Settings">
      <div style={{ background: 'white', border: '1px solid #E7E5E4', borderRadius: 8, padding: 28, maxWidth: 600 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 16 }}>Quick Links</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'View the guest-facing website', href: '/', external: true },
            { label: 'Download RSVP CSV export', href: '/api/admin/rsvps/export' },
            { label: 'Download guest list CSV', href: '/api/admin/guests/export' },
          ].map(l => (
            <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid #E7E5E4', borderRadius: 4, color: '#1C1917', textDecoration: 'none', fontSize: 14, transition: 'background 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#FAF7F2')}
              onMouseOut={e => (e.currentTarget.style.background = 'white')}
            >
              {l.label}
              <span style={{ color: '#C8860A' }}>↗</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: '16px', background: '#FAF7F2', borderRadius: 6, fontSize: 13, color: '#78716C', lineHeight: 1.7 }}>
          <strong style={{ color: '#1C1917' }}>Admin password</strong> is set via the <code>ADMIN_PASSWORD</code> environment variable in Vercel. To change it, update that variable in your Vercel project settings and redeploy.
        </div>
      </div>
    </AdminLayout>
  )
}
