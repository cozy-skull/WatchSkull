import { useState, useEffect } from 'react'

const DEFAULT_PROFILES = [
  { id: 'p1', name: 'Case', emoji: '💀' },
]

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function useProfiles() {
  const [profiles, setProfiles] = useState(() => load('ws_profiles', DEFAULT_PROFILES))

  useEffect(() => {
    localStorage.setItem('ws_profiles', JSON.stringify(profiles))
  }, [profiles])

  function addProfile(name, emoji) {
    const id = 'p' + Date.now()
    setProfiles(p => [...p, { id, name, emoji }])
  }

  function updateProfile(id, updates) {
    setProfiles(p => p.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  function removeProfile(id) {
    setProfiles(p => p.filter(m => m.id !== id))
  }

  return { profiles, addProfile, updateProfile, removeProfile }
}
