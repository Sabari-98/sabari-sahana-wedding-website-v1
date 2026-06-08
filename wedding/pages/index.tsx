import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { KolamDivider, KolamBg, KolamDiamond } from '../components/Kolam'
import { EVENT_META } from '../lib/supabase'
import Link from 'next/link'

interface Config { [key: string]: string }

function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
      {units.map(u => (
        <div key={u.label} style={{ textAlign: 'center', minWidth: 70 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 300, color: 'rgba(250,247,242,0.95)', lineHeight: 1 }}>
            {String(u.value).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,247,242,0.4)', marginTop: 6 }}>
            {u.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home({ config = {} }: { config: Config }) {
  const name1 = config.couple_name_1 || 'Priya'
  const name2 = config.couple_name_2 || 'Arjun'
  const date = config.wedding_date || '2025-11-15'
  const tagline = config.hero_tagline || 'Two families. One celebration.'

  const formattedDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <Layout coupleName1={name1} coupleName2={name2}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        background: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <KolamBg opacity={0.05} />

        {/* Top label */}
        <div className="fade-up" style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(250,247,242,0.4)', marginBottom: 20 }}>
          Together with their families
        </div>

        {/* Names */}
        <h1 className="fade-up fade-up-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 10vw, 96px)', fontWeight: 300, color: 'rgba(250,247,242,0.95)', lineHeight: 1, marginBottom: 16 }}>
          {name1}
          <span style={{ display: 'block', fontSize: '0.55em', color: 'var(--color-accent)', letterSpacing: '6px', margin: '8px 0', fontStyle: 'italic' }}>
            &amp;
          </span>
          {name2}
        </h1>

        {/* Date */}
        <div className="fade-up fade-up-2" style={{ fontSize: 13, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,247,242,0.5)', marginBottom: 8 }}>
          {formattedDate}
        </div>

        <div className="fade-up fade-up-2" style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic', color: 'rgba(250,247,242,0.4)', marginBottom: 48 }}>
          {tagline}
        </div>

        {/* Countdown */}
        <div className="fade-up fade-up-3">
          <Countdown targetDate={date} />
        </div>

        <div className="fade-up fade-up-4" style={{ display: 'flex', gap: 12, marginTop: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/rsvp" className="btn btn-accent">RSVP Now</Link>
          <Link href="/events" className="btn btn-outline" style={{ color: 'rgba(250,247,242,0.7)', borderColor: 'rgba(250,247,242,0.2)' }}>View Events</Link>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(250,247,242,0.3), transparent)', margin: '0 auto' }} />
        </div>
      </section>

      {/* ── Events preview ── */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <div className="uppercase text-accent" style={{ marginBottom: 8 }}>The Celebrations</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400 }}>
              Four Days of Joy
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1, background: 'var(--color-border)' }}>
            {Object.values(EVENT_META).map(e => (
              <div key={e.label} style={{ background: 'var(--color-white)', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{e.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: e.color, marginBottom: 8 }}>
                  {e.label}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.6 }}>{e.description}</p>
              </div>
            ))}
          </div>

          <KolamDivider />

          <div className="text-center">
            <Link href="/events" className="btn btn-primary">Event Details &amp; Schedule</Link>
          </div>
        </div>
      </section>

      {/* ── Story teaser ── */}
      <section className="section" style={{ background: 'var(--color-primary)', position: 'relative', overflow: 'hidden' }}>
        <KolamBg opacity={0.04} />
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <KolamDiamond size={36} color="#C8860A" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 400, color: 'rgba(250,247,242,0.95)', margin: '24px 0 16px' }}>
            Our Story
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,242,0.5)', maxWidth: 520, margin: '0 auto 32px', fontFamily: 'var(--font-display)', fontStyle: 'italic', lineHeight: 1.8 }}>
            {config.story_content?.substring(0, 160) || 'Every love story is beautiful, but ours is our favourite.'}
            {(config.story_content?.length || 0) > 160 ? '…' : ''}
          </p>
          <Link href="/story" className="btn btn-ghost">Read Our Story</Link>
        </div>
      </section>

    </Layout>
  )
}
