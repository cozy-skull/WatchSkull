import { IMG_SM, titleOf, isTV, STATUSES, PLATFORMS } from '../tmdb.js'
import { PageHeader, StarRating, EmptyState } from './UI.jsx'

const STATUS_COLORS = {
  'Watching':      '#c8922a',
  'Completed':     '#4a7a4a',
  'On Hold':       '#7a6a3a',
  'Dropped':       '#8a3a3a',
  'Plan to Watch': '#3a5a7a',
}

function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-hi)',
      borderRadius: 8, padding: '20px 22px',
    }}>
      <div style={{
        fontSize: 36, fontWeight: 900, color: 'var(--amber)',
        fontFamily: "'Playfair Display', serif", lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontSize: 9, color: 'var(--text-low)',
        textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 7,
      }}>{label}</div>
    </div>
  )
}

function BarChart({ items, total, colors }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.label} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
            <span style={{ color: 'var(--text)' }}>{item.label}</span>
            <span style={{ color: colors?.[item.label] || 'var(--amber)', fontWeight: 700 }}>{item.count}</span>
          </div>
          <div style={{ height: 3, background: 'var(--border)', borderRadius: 2 }}>
            <div style={{
              height: '100%',
              width: `${total > 0 ? (item.count / total) * 100 : 0}%`,
              background: colors?.[item.label] || 'var(--amber)',
              borderRadius: 2,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatsView({ lib }) {
  const total     = lib.library.length
  const shows     = lib.library.filter(isTV).length
  const films     = lib.library.filter(i => !isTV(i)).length
  const completed = lib.library.filter(i => i.status === 'Completed').length
  const rated     = lib.library.filter(i => i.rating > 0)
  const avgRating = rated.length
    ? (rated.reduce((s, i) => s + i.rating, 0) / rated.length).toFixed(1)
    : '—'

  const byStatus = STATUSES
    .map(s => ({ label: s, count: lib.library.filter(i => i.status === s).length }))
    .filter(s => s.count > 0)

  const byPlatform = PLATFORMS
    .map(p => ({ label: p, count: lib.library.filter(i => i.platform === p).length }))
    .filter(p => p.count > 0)
    .sort((a, b) => b.count - a.count)

  const topRated = [...lib.library]
    .filter(i => i.rating > 0)
    .sort((a, b) => b.rating - a.rating || b.addedAt - a.addedAt)
    .slice(0, 6)

  if (total === 0) {
    return (
      <div>
        <PageHeader title="The Record" sub="Everything you've watched, counted." />
        <EmptyState icon="📊" title="Nothing to count yet." sub="Start adding titles to your library." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="The Record" sub="Everything you've watched, counted." />

      {/* Big numbers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 12, marginBottom: 28,
      }}>
        <StatCard value={total}      label="Total Titles" />
        <StatCard value={shows}      label="Shows" />
        <StatCard value={films}      label="Films" />
        <StatCard value={completed}  label="Completed" />
        <StatCard value={avgRating}  label="Avg Rating" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {byStatus.length > 0 && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hi)', borderRadius: 8, padding: 22 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-low)', textTransform: 'uppercase', marginBottom: 16 }}>By Status</div>
            <BarChart items={byStatus} total={total} colors={STATUS_COLORS} />
          </div>
        )}
        {byPlatform.length > 0 && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hi)', borderRadius: 8, padding: 22 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-low)', textTransform: 'uppercase', marginBottom: 16 }}>By Platform</div>
            <BarChart items={byPlatform} total={total} />
          </div>
        )}
      </div>

      {/* Top Rated */}
      {topRated.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hi)', borderRadius: 8, padding: 22 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-low)', textTransform: 'uppercase', marginBottom: 18 }}>Top Rated</div>
          {topRated.map((item, i) => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 0',
              borderBottom: i < topRated.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                fontSize: 20, fontFamily: "'Playfair Display', serif",
                color: 'var(--border-hi)', fontWeight: 900, width: 24,
                flexShrink: 0, textAlign: 'center',
              }}>{i + 1}</span>
              {item.poster_path && (
                <img
                  src={`${IMG_SM}${item.poster_path}`}
                  alt=""
                  style={{ width: 38, borderRadius: 4, flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, color: 'var(--text-hi)', fontWeight: 600,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{titleOf(item)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-low)', marginTop: 2 }}>
                  {item.platform || item.status}
                </div>
              </div>
              <StarRating value={item.rating} size={15} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
