import { useState, useEffect } from 'react'
import { IMG_SM, IMG_LG, titleOf, yearOf, STATUS_META } from '../tmdb.js'

// ── STAR RATING ──────────────────────────────────────────────────────────────
export function StarRating({ value = 0, onChange, size = 18 }) {
  const [hov, setHov] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => onChange?.(n === value ? 0 : n)}
          onMouseEnter={() => onChange && setHov(n)}
          onMouseLeave={() => setHov(0)}
          style={{
            fontSize: size,
            lineHeight: 1,
            cursor: onChange ? 'pointer' : 'default',
            color: n <= (hov || value) ? 'var(--amber)' : 'var(--border-hi)',
            transition: 'color 0.12s',
            userSelect: 'none',
          }}
        >★</span>
      ))}
    </div>
  )
}

// ── POSTER CARD ──────────────────────────────────────────────────────────────
export function PosterCard({ item, onClick, badge, badgeColor }) {
  const [err, setErr] = useState(false)
  const title = titleOf(item)
  const year  = yearOf(item)
  const src   = item.poster_path && !err ? `${IMG_SM}${item.poster_path}` : null

  return (
    <div
      className="poster-card"
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: 6,
        overflow: 'hidden',
        aspectRatio: '2/3',
        cursor: 'pointer',
        background: 'var(--bg-raised)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(200,146,42,0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.5)'
      }}
    >
      {src
        ? <img src={src} alt={title} onError={() => setErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <NoPoster title={title} />
      }

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: 'linear-gradient(to top, rgba(10,8,6,0.97) 0%, rgba(10,8,6,0.5) 55%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Info */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px' }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: 'var(--text-hi)',
          fontFamily: "'Playfair Display', Georgia, serif",
          lineHeight: 1.25, marginBottom: 3,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {year && <span style={{ fontSize: 9, color: 'var(--text-low)' }}>{year}</span>}
          {item.rating > 0 && <StarRating value={item.rating} size={9} />}
        </div>
      </div>

      {/* Badge */}
      {badge && (
        <div style={{
          position: 'absolute', top: 7, left: 7,
          background: badgeColor || 'var(--amber)',
          color: badgeColor ? '#fff' : '#0a0806',
          fontSize: 8, fontWeight: 800,
          padding: '2px 6px', borderRadius: 3,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{badge}</div>
      )}
    </div>
  )
}

function NoPoster({ title }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, var(--bg-raised) 0%, var(--bg) 100%)',
      padding: 12,
    }}>
      <span style={{
        color: 'var(--text-faint)', fontSize: 10,
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic', textAlign: 'center', lineHeight: 1.4,
      }}>{title}</span>
    </div>
  )
}

// ── MODAL SHELL ──────────────────────────────────────────────────────────────
export function Modal({ onClose, children, wide }) {
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-hi)',
          borderRadius: 10,
          width: '100%',
          maxWidth: wide ? 780 : 640,
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            background: 'rgba(10,8,6,0.6)', border: '1px solid var(--border-hi)',
            color: 'var(--text-low)', fontSize: 18, cursor: 'pointer',
            width: 30, height: 30, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-hi)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-low)'}
        >×</button>
        {children}
      </div>
    </div>
  )
}

// ── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '72px 24px' }}>
      <div style={{ fontSize: 48, marginBottom: 18, opacity: 0.3 }}>{icon}</div>
      <div style={{
        fontSize: 18, color: 'var(--text-low)',
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
        marginBottom: 10,
      }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{sub}</div>
    </div>
  )
}

// ── PAGE HEADER ──────────────────────────────────────────────────────────────
export function PageHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{
        fontSize: 34, margin: '0 0 6px',
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic', fontWeight: 700,
        color: 'var(--text-hi)', letterSpacing: '-0.01em',
      }}>{title}</h1>
      {sub && <p style={{ margin: 0, color: 'var(--text-low)', fontSize: 13 }}>{sub}</p>}
    </div>
  )
}

// ── PILL BUTTON ──────────────────────────────────────────────────────────────
export function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'var(--amber)' : 'var(--bg-hover)',
        color: active ? '#0a0806' : 'var(--text-low)',
        border: '1px solid ' + (active ? 'var(--amber)' : 'var(--border-hi)'),
        padding: '5px 14px', borderRadius: 20,
        fontSize: 11, fontWeight: 700, cursor: 'pointer',
        letterSpacing: '0.05em', textTransform: 'uppercase',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >{children}</button>
  )
}

// ── ACTION BUTTON ─────────────────────────────────────────────────────────────
export function Btn({ onClick, children, variant = 'primary', small }) {
  const styles = {
    primary:  { bg: 'var(--amber)',     color: '#0a0806' },
    ghost:    { bg: 'var(--bg-hover)',  color: 'var(--text-mid)' },
    danger:   { bg: 'var(--bg-hover)',  color: 'var(--red)' },
  }
  const s = styles[variant] || styles.primary
  return (
    <button
      onClick={onClick}
      style={{
        background: s.bg, color: s.color,
        border: variant === 'ghost' ? '1px solid var(--border-hi)' : 'none',
        padding: small ? '5px 12px' : '9px 18px',
        borderRadius: 5, fontSize: small ? 11 : 12,
        fontWeight: 700, cursor: 'pointer',
        letterSpacing: '0.04em',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >{children}</button>
  )
}

// ── LABEL ────────────────────────────────────────────────────────────────────
export function Label({ children }) {
  return (
    <div style={{
      fontSize: 9, letterSpacing: '0.12em',
      color: 'var(--text-low)', textTransform: 'uppercase',
      marginBottom: 6, fontWeight: 600,
    }}>{children}</div>
  )
}
