import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import '../styles/globals.css'
import PasswordGate from '../components/PasswordGate'
import { supabase } from '../lib/supabase'

export default function App({ Component, pageProps }: AppProps) {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('site_config')
      .select('key, value')
      .then(({ data }) => {
        const cfg: Record<string, string> = {}
        data?.forEach(r => { cfg[r.key] = r.value })
        setConfig(cfg)
        // Apply CSS custom properties from config
        if (cfg.primary_color) document.documentElement.style.setProperty('--color-primary', cfg.primary_color)
        if (cfg.accent_color) document.documentElement.style.setProperty('--color-accent', cfg.accent_color)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1C1917', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'rgba(250,247,242,0.5)', letterSpacing: '4px', textTransform: 'uppercase' }}>
        Loading…
      </div>
    </div>
  )

  // Admin pages bypass the password gate
  const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')

  if (isAdminPage) {
    return <Component {...pageProps} config={config} />
  }

  return (
    <PasswordGate
      sitePassword={config.site_password || process.env.NEXT_PUBLIC_SITE_PASSWORD || 'celebration2025'}
      coupleName1={config.couple_name_1}
      coupleName2={config.couple_name_2}
    >
      <Component {...pageProps} config={config} />
    </PasswordGate>
  )
}
