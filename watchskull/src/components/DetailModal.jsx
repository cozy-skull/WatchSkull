import { useState, useEffect } from 'react'
import { tmdb, IMG_MD, IMG_LG, titleOf, yearOf, isTV, STATUSES, PLATFORMS, STATUS_META } from '../tmdb.js'
import { Modal, StarRating, Btn, Label } from './UI.jsx'

export function DetailModal({ item, onClose, lib }) {
  const [details, setDetails] = useState(null)
  const [cast,    setCast]    = useState([])
  const tv = isTV(item)
  const libEntry   = lib.inLibrary(item.id)
  const inWatchlist = lib.inWatchlist(item.id)

  useEffect(() => {
    const type = tv ? 'tv' : 'movie'
    tmdb(`/${type}/${item.id}`).then(setDetails).catch(() => {})
    tmdb(`/${type}/${item.id}/credits`).then(d => setCast((d.cast || []).slice(0, 10))).catch(() => {})
  }, [item.id, tv])

  const title    = titleOf(item)
  const year     = yearOf(item)
  const backdrop = details?.backdrop_path ? `${IMG_LG}${details.backdrop_path}` : null
  const runtime  = details?.runtime
    ? `${details.runtime} min`
    : details?.episode_run_time?.[0]
    ? `${details.episode_run_time[0]} min / ep`
    : null
  const genres  = details?.genres?.map(g => g.name).join(' · ') || ''
  const seasons = details?.number_of_seasons

  return (
    <Modal onClose={onClose}>
      {/* Backdrop */}
      {backdrop && (
        <div style={{ height: 200, position: 'relative', overflow: 'hidden', borderRadius: '10px 10px 0 0' }}>
          <img src={backdrop} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 60%)',
          }} />
        </div>
      )}

      <div style={{ padding: backdrop ? '0 28px 28px' : '28px' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Poster */}
          {item.poster_path && (
            <img
              src={`${IMG_MD}${item.poster_path}`}
              alt={title}
              style={{
                width: 100, borderRadius: 6, flexShrink: 0,
                boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                marginTop: backdrop ? -60 : 0,
                position: 'relative',
              }}
            />
          )}

          {/* Meta */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 8 }}>
            <h2 style={{
              margin: '0 0 6px', fontSize: 22,
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-hi)', lineHeight: 1.2,
            }}>{title}</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 11, color: 'var(--text-low)', marginBottom: 8 }}>
              {year     && <span>{year}</span>}
              {runtime  && <span>{runtime}</span>}
              {seasons  && <span>{seasons} season{seasons !== 1 ? 's' : ''}</span>}
              <span style={{ color: tv ? 'var(--amber)' : '#8a6aaa', fontWeight: 700 }}>
                {tv ? 'TV' : 'Film'}
              </span>
              {details?.vote_average > 0 && (
                <span>TMDB {details.vote_average.toFixed(1)}</span>
              )}
            </div>

            {genres && (
              <div style={{ fontSize: 11, color: 'var(--text-low)', marginBottom: 10 }}>{genres}</div>
            )}

            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.65 }}>
              {item.overview || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <Label>Cast</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cast.map(c => (
                <span key={c.id} style={{
                  fontSize: 11, background: 'var(--bg-hover)',
                  border: '1px solid var(--border-hi)',
                  padding: '3px 9px', borderRadius: 3,
                  color: 'var(--text-mid)',
                }}>{c.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '22px 0' }} />

        {/* Library panel or Add buttons */}
        {libEntry
          ? <EditPanel item={libEntry} tv={tv} lib={lib} onClose={onClose} />
          : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn onClick={() => { lib.addToLibrary({ ...item, media_type: tv ? 'tv' : 'movie' }, 'Watching'); onClose() }}>
                + Add to Library
              </Btn>
              {!inWatchlist
                ? <Btn variant="ghost" onClick={() => { lib.addToWatchlist({ ...item, media_type: tv ? 'tv' : 'movie' }); onClose() }}>
                    + Watchlist
                  </Btn>
                : <span style={{ fontSize: 12, color: 'var(--text-low)', alignSelf: 'center' }}>In your watchlist</span>
              }
            </div>
          )
        }
      </div>
    </Modal>
  )
}

function EditPanel({ item, tv, lib, onClose }) {
  const up = (k, v) => lib.updateLibrary(item.id, { [k]: v })

  return (
    <div>
      <Label>Your Record</Label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <Label>Status</Label>
          <select value={item.status} onChange={e => up('status', e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label>Platform</Label>
          <select value={item.platform} onChange={e => up('platform', e.target.value)}>
            <option value="">—</option>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        {tv && <>
          <div>
            <Label>Season</Label>
            <input type="number" min={1} value={item.season} onChange={e => up('season', +e.target.value)} />
          </div>
          <div>
            <Label>Episode</Label>
            <input type="number" min={1} value={item.episode} onChange={e => up('episode', +e.target.value)} />
          </div>
        </>}
      </div>

      <div style={{ marginBottom: 14 }}>
        <Label>Rating</Label>
        <StarRating value={item.rating} onChange={v => up('rating', v)} size={24} />
      </div>

      <div style={{ marginBottom: 18 }}>
        <Label>Review (optional)</Label>
        <textarea
          value={item.review}
          onChange={e => up('review', e.target.value)}
          placeholder="What did you think…"
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </div>

      <Btn variant="danger" small onClick={() => { lib.removeFromLibrary(item.id); onClose() }}>
        Remove from Library
      </Btn>
    </div>
  )
}
