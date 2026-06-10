import { useState } from 'react'
import { isTV, STATUSES, PLATFORMS, STATUS_META, titleOf } from '../tmdb.js'
import { PosterCard, PageHeader, EmptyState } from './UI.jsx'
import { DetailModal } from './DetailModal.jsx'

const STATUS_COLORS = {
  'Watching':      '#c8922a',
  'Completed':     '#4a7a4a',
  'On Hold':       '#7a6a3a',
  'Dropped':       '#8a3a3a',
  'Plan to Watch': '#3a5a7a',
}

export function LibraryView({ lib }) {
  const [mediaTab,  setMediaTab]  = useState('tv')
  const [status,    setStatus]    = useState('All')
  const [platform,  setPlatform]  = useState('All')
  const [sortBy,    setSortBy]    = useState('recent')
  const [selected,  setSelected]  = useState(null)

  const shows  = lib.library.filter(i => isTV(i))
  const films  = lib.library.filter(i => !isTV(i))

  const pool = mediaTab === 'tv' ? shows : films

  const filtered = pool
    .filter(i => status   === 'All' || i.status   === status)
    .filter(i => platform === 'All' || i.platform === platform)
    .sort((a, b) => {
      if (sortBy === 'recent') return b.addedAt - a.addedAt
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'title')  return titleOf(a).localeCompare(titleOf(b))
      return 0
    })

  const usedPlatforms = [...new Set(pool.map(i => i.platform).filter(Boolean))]

  return (
    <div>
      <PageHeader
        title="Library"
        sub={`${lib.library.length} title${lib.library.length !== 1 ? 's' : ''} in the collection.`}
      />

      {/* Show / Film tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {[
          { id: 'tv',    label: 'Shows', count: shows.length },
          { id: 'movie', label: 'Films', count: films.length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setMediaTab(t.id)}
            style={{
              background: 'none', border: 'none',
              borderBottom: mediaTab === t.id ? '2px solid var(--amber)' : '2px solid transparent',
              color: mediaTab === t.id ? 'var(--amber)' : 'var(--text-low)',
              padding: '10px 20px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: -1,
            }}
          >{t.label} <span style={{ opacity: 0.5, fontWeight: 400 }}>{t.count}</span></button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: 'auto' }}>
          <option>All</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>

        {usedPlatforms.length > 0 && (
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ width: 'auto' }}>
            <option>All</option>
            {usedPlatforms.map(p => <option key={p}>{p}</option>)}
          </select>
        )}

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto', marginLeft: 'auto' }}>
          <option value="recent">Recently Added</option>
          <option value="rating">Rating</option>
          <option value="title">A – Z</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0
        ? <EmptyState
            icon={lib.library.length === 0 ? '🎬' : '🔎'}
            title={lib.library.length === 0 ? 'Your library is empty.' : 'Nothing matches.'}
            sub={lib.library.length === 0 ? 'Head to Discover and start adding titles.' : 'Try different filters.'}
          />
        : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
            gap: 14,
          }}>
            {filtered.map(item => (
              <PosterCard
                key={item.id}
                item={item}
                onClick={() => setSelected(item)}
                badge={item.status}
                badgeColor={STATUS_COLORS[item.status]}
              />
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
