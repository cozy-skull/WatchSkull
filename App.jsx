import { useState } from 'react'
import { useLibrary } from './hooks/useLibrary.js'
import { DiscoverView }  from './components/DiscoverView.jsx'
import { LibraryView }   from './components/LibraryView.jsx'
import { WatchlistView } from './components/WatchlistView.jsx'
import { StatsView }     from './components/StatsView.jsx'

const NAV = [
  {
    id: 'discover',
    label: 'Discover',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    id: 'library',
    label: 'Library',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'stats',
    label: 'The Record',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
]

const VIEWS = {
  discover:  DiscoverView,
  library:   LibraryView,
  watchlist: WatchlistView,
  stats:     StatsView,
}

export default function App() {
  const [view, setView] = useState('discover')
  const lib = useLibrary()

  const CurrentView = VIEWS[view]

  const watchingCount   = lib.library.filter(i => i.status === 'Watching').length
  const watchlistCount  = lib.watchlist.length

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 210,
        flexShrink: 0,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 0 24px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
      }}>
        {/* Wordmark */}
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
          }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>💀</span>
            <div>
              <div style={{
                fontSize: 16, fontFamily: "'Playfair Display', serif",
                fontWeight: 900, color: 'var(--text-hi)',
                letterSpacing: '-0.01em', lineHeight: 1,
              }}>WatchSkull</div>
            </div>
          </div>
          <div style={{
            fontSize: 9, color: 'var(--text-faint)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginTop: 7, paddingLeft: 31,
          }}>dead serious about what you watch</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {NAV.map(n => {
            const active = view === n.id
            const badge  = n.id === 'watchlist' ? watchlistCount : n.id === 'library' ? watchingCount : 0
            return (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                style={{
                  width: '100%',
                  background: active ? 'var(--bg-hover)' : 'none',
                  border: 'none',
                  borderLeft: `2px solid ${active ? 'var(--amber)' : 'transparent'}`,
                  color: active ? 'var(--text-hi)' : 'var(--text-low)',
                  padding: '11px 22px',
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-low)' }}
              >
                <span style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }}>{n.icon}</span>
                {n.label}
                {badge > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: 'var(--amber)', color: '#0a0806',
                    fontSize: 9, fontWeight: 800,
                    padding: '1px 6px', borderRadius: 10,
                    lineHeight: 1.6,
                  }}>{badge}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer counts */}
        <div style={{ padding: '16px 24px 0', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', lineHeight: 2 }}>
            <div>{lib.library.length} in library</div>
            <div>{lib.watchlist.length} in queue</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{
        flex: 1,
        padding: '40px 44px',
        maxWidth: 1140,
        overflowY: 'auto',
      }}>
        <CurrentView lib={lib} />
      </main>
    </div>
  )
}
