// Kolam-inspired geometric dot pattern — a nod to South Indian rangoli art
// Used as decorative dividers and section accents throughout the site

interface KolamProps {
  size?: number
  color?: string
  className?: string
}

export function KolamDiamond({ size = 40, color = '#C8860A', className = '' }: KolamProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="18" y="2" width="4" height="4" fill={color} opacity="0.3" />
      <rect x="18" y="34" width="4" height="4" fill={color} opacity="0.3" />
      <rect x="2" y="18" width="4" height="4" fill={color} opacity="0.3" />
      <rect x="34" y="18" width="4" height="4" fill={color} opacity="0.3" />
      <rect x="11" y="11" width="3" height="3" fill={color} opacity="0.5" />
      <rect x="26" y="11" width="3" height="3" fill={color} opacity="0.5" />
      <rect x="11" y="26" width="3" height="3" fill={color} opacity="0.5" />
      <rect x="26" y="26" width="3" height="3" fill={color} opacity="0.5" />
      <rect x="18.5" y="18.5" width="3" height="3" fill={color} />
      <line x1="20" y1="4" x2="20" y2="18" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="22" x2="20" y2="36" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="4" y1="20" x2="18" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="22" y1="20" x2="36" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="12" y1="12" x2="18" y2="18" stroke={color} strokeWidth="0.5" opacity="0.25" />
      <line x1="28" y1="12" x2="22" y2="18" stroke={color} strokeWidth="0.5" opacity="0.25" />
      <line x1="12" y1="28" x2="18" y2="22" stroke={color} strokeWidth="0.5" opacity="0.25" />
      <line x1="28" y1="28" x2="22" y2="22" stroke={color} strokeWidth="0.5" opacity="0.25" />
    </svg>
  )
}

export function KolamDivider({ color = '#C8860A' }: { color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', margin: '32px 0' }}>
      <div style={{ height: '1px', width: '80px', background: `linear-gradient(90deg, transparent, ${color}44)` }} />
      <KolamDiamond size={28} color={color} />
      <div style={{ height: '1px', width: '80px', background: `linear-gradient(90deg, ${color}44, transparent)` }} />
    </div>
  )
}

export function KolamBg({ opacity = 0.04 }: { opacity?: number }) {
  // Repeating dot-grid pattern inspired by kolam starting dots
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="kolam-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#C8860A" />
          <circle cx="16" cy="16" r="0.8" fill="#C8860A" />
          <circle cx="2" cy="30" r="1.2" fill="#C8860A" />
          <circle cx="30" cy="2" r="1.2" fill="#C8860A" />
          <circle cx="30" cy="30" r="1.2" fill="#C8860A" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kolam-dots)" opacity={opacity} />
    </svg>
  )
}
