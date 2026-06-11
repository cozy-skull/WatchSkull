import { useState, useEffect } from 'react'

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function useLibrary() {
  const [library,   setLibrary]   = useState(() => load('ws_library',   []))
  const [watchlist, setWatchlist] = useState(() => load('ws_watchlist', []))

  useEffect(() => { localStorage.setItem('ws_library',   JSON.stringify(library))   }, [library])
  useEffect(() => { localStorage.setItem('ws_watchlist', JSON.stringify(watchlist)) }, [watchlist])

  const inLibrary   = (id) => library.find(i => i.id === id)
  const inWatchlist = (id) => watchlist.find(i => i.id === id)

  function addToLibrary(item, status = 'Plan to Watch') {
    if (inLibrary(item.id)) return
    setWatchlist(w => w.filter(i => i.id !== item.id))
    setLibrary(l => [...l, {
      ...item,
      status,
      platform:     '',
      ratings:      {},   // { profileId: 1-5 }
      review:       '',
      season:       1,
      episode:      1,
      viewingMode:  '',
      kidFriendly:  '',
      vibeTags:     [],
      attentionTags:[],
      goreLevel:    '',
      nextSeason:   '',
      notes:        '',
      addedAt:      Date.now(),
    }])
  }

  function updateLibrary(id, updates) {
    setLibrary(l => l.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  function removeFromLibrary(id) {
    setLibrary(l => l.filter(i => i.id !== id))
  }

  function addToWatchlist(item) {
    if (inLibrary(item.id) || inWatchlist(item.id)) return
    setWatchlist(w => [...w, { ...item, addedAt: Date.now() }])
  }

  function removeFromWatchlist(id) {
    setWatchlist(w => w.filter(i => i.id !== id))
  }

  function moveToLibrary(item) {
    addToLibrary(item, 'Watching')
  }

  function setRating(titleId, profileId, value) {
    setLibrary(l => l.map(i => {
      if (i.id !== titleId) return i
      const ratings = { ...i.ratings, [profileId]: value }
      return { ...i, ratings }
    }))
  }

  return {
    library, watchlist,
    inLibrary, inWatchlist,
    addToLibrary, updateLibrary, removeFromLibrary,
    addToWatchlist, removeFromWatchlist, moveToLibrary,
    setRating,
  }
}
