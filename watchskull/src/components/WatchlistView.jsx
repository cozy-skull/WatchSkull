import { useState } from 'react'
import { titleOf } from '../tmdb.js'
import { PosterCard, PageHeader, EmptyState } from './UI.jsx'
import { DetailModal } from './DetailModal.jsx'

export function WatchlistView({ lib }) {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <PageHeader
        title="Watchlist"
        sub={
          lib.watchlist.length === 0
            ? 'Nothing queued up yet.'
            : `${lib.watchlist.length} title${lib.watchlist.length !== 1 ? 's' : ''} waiting in the dark.`
        }
      />

      {lib.watchlist.length === 0
        ? <EmptyState
            icon="📋"
            title="Your watchlist is empty."
            sub="Add titles from Discover to start building your queue."
          />
        : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
            gap: 14,
          }}>
            {lib.watchlist.map(item => (
              <div key={item.id}>
                <PosterCard item={item} onClick={() => setSelected(item)} />
                <div style={{ display: 'flex', gap: 5, marginTop: 7 }}>
                  <button
                    onClick={() => lib.moveToLibrary(item)}
                    style={{
                      flex: 1, background: 'var(--amber)', color: '#0a0806',
                      border: 'none', borderRadius: 4,
                      padding: '6px 0', fontSize: 9, fontWeight: 800,
                      cursor: 'pointer', letterSpacing: '0.07em', textTransform: 'uppercase',
                    }}
                  >Watch Now</button>
                  <button
                    onClick={() => lib.removeFromWatchlist(item.id)}
                    style={{
                      background: 'var(--bg-hover)', color: 'var(--text-low)',
                      border: '1px solid var(--border-hi)',
                      borderRadius: 4, padding: '6px 9px',
                      fontSize: 11, cursor: 'pointer',
                    }}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} lib={lib} />
      )}
    </div>
  )
}
