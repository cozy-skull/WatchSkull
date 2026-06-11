import { useState, useEffect, useCallback } from 'react'
import { tmdb } from '../tmdb.js'
import { PosterCard, PageHeader, Pill, EmptyState } from './UI.jsx'
import { DetailModal } from './DetailModal.jsx'

const STATUS_COLORS = {
  'Watching': '#c8922a', 'Completed': '#4a7a4a', 'On Hold': '#7a6a3a',
  'Dropped': '#8a3a3a', 'Plan to Watch': '#3a5a7a',
}

export function DiscoverView({ lib, profiles, settings }) {
  const [query,     setQuery]     = useState('')
  const [results,   setResults]   = useState([])
  const [trending,  setTrending]  = useState([])
  const [topRated,  setTopRated]  = useState([])
  const [browseTab, setBrowseTab] = useState('trending')
  const [typeFilter,setTypeFilter]= useState('all')
  const [loading,   setLoading]   = useState(false)
  const [selected,  setSelected]  = useState(null)

  useEffect(() => {
    tmdb('/trending/all/week').then(d => setTrending(d.results || []))
    Promise.all([
      tmdb('/movie/top_rated').then(d => (d.results || []).map(r => ({ ...r, media_type: 'movie' }))),
      tmdb('/tv/top_rated').then(d => (d.results || []).map(r => ({ ...r, media_type: 'tv' }))),
    ]).then(([m, t]) => setTopRated([...m, ...t].sort((a, b) => b.vote_average - a.vote_average)))
  }, [])

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const [m, t] = await Promise.all([
        tmdb('/search/movie', { query: q }),
        tmdb('/search/tv',    { query: q }),
      ])
      const movies = (m.results || []).map(r => ({ ...r, media_type: 'movie' }))
      const shows  = (t.results || []).map(r => ({ ...r, media_type: 'tv' }))
      setResults([...movies, ...shows].sort((a, b) => b.popularity - a.popularity))
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 380)
    return () => clearTimeout(t)
  }, [query, doSearch])

  const pool = query ? results : browseTab === 'trending' ? trending : topRated
  const display = typeFilter === 'all' ? pool : pool.filter(r => r.media_type === typeFilter)

  return (
    <div>
      <PageHeader title="Discover" sub="Find something worth losing sleep over." />

      <div style={{ position: 'relative', marginBottom: 18 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)', fontSize: 17, pointerEvents: 'none' }}>⌕</span>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies & shows…" style={{ paddingLeft: 42 }} />
        {loading && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)', fontSize: 11 }}>…</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {!query && ['trending','top_rated'].map(t => (
          <Pill key={t} active={browseTab === t} onClick={() => setBrowseTab(t)}>
            {t === 'trending' ? 'Trending' : 'Top Rated'}
          </Pill>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['all','movie','tv'].map(f => (
            <button key={f} onClick={() => setTypeFilter(f)} style={{
              background: typeFilter === f ? 'var(--bg-hover)' : 'none',
              color: typeFilter === f ? 'var(--text)' : 'var(--text-low)',
              border: '1px solid ' + (typeFilter === f ? 'var(--border-hi)' : 'transparent'),
              padding: '5px 13px', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontWeight: 600,
            }}>{f === 'all' ? 'All' : f === 'movie' ? 'Films' : 'Shows'}</button>
          ))}
        </div>
      </div>

      {display.length === 0 && query && !loading
        ? <EmptyState icon="🔍" title="Nothing found." sub="Try a different search." />
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 14 }}>
            {display.slice(0, 40).map(item => {
              const entry = lib.inLibrary(item.id)
              const inWl  = lib.inWatchlist(item.id)
              const badge = entry ? entry.status : inWl ? 'Watchlist' : null
              const badgeColor = entry ? STATUS_COLORS[entry.status] : inWl ? '#3a5a7a' : null
              return (
                <PosterCard key={`${item.media_type}-${item.id}`} item={item}
                  onClick={() => setSelected(item)} badge={badge} badgeColor={badgeColor} />
              )
            })}
          </div>
        )
      }

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} lib={lib} profiles={profiles} settings={settings} />
      )}
    </div>
  )
}
