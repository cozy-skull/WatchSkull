export const TMDB_KEY = '2dca580c2a14b55200e784d157207b4d'
export const TMDB_BASE = 'https://api.themoviedb.org/3'
export const IMG_SM = 'https://image.tmdb.org/t/p/w342'
export const IMG_MD = 'https://image.tmdb.org/t/p/w500'
export const IMG_LG = 'https://image.tmdb.org/t/p/w1280'

export async function tmdb(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set('api_key', TMDB_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB ${res.status}`)
  return res.json()
}

export const STATUSES = [
  'Watching',
  'Completed',
  'On Hold',
  'Dropped',
  'Plan to Watch',
]

export const STATUS_META = {
  'Watching':       { color: '#c8922a', short: 'Watching' },
  'Completed':      { color: '#4a7a4a', short: 'Done'     },
  'On Hold':        { color: '#7a6a3a', short: 'On Hold'  },
  'Dropped':        { color: '#8a3a3a', short: 'Dropped'  },
  'Plan to Watch':  { color: '#3a5a7a', short: 'Queued'   },
}

export const PLATFORMS = [
  'Netflix', 'Hulu', 'HBO Max', 'Disney+', 'Apple TV+',
  'Prime', 'Peacock', 'Paramount+', 'Theater', 'Other',
]

export const titleOf  = (item) => item.title || item.name || 'Untitled'
export const yearOf   = (item) => (item.release_date || item.first_air_date || '').slice(0, 4)
export const isTV     = (item) => item.media_type === 'tv' || (!item.title && !!item.name)
