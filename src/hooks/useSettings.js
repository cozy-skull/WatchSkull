import { useState, useEffect } from 'react'

export const DEFAULT_VIBE_TAGS = [
  'Rules-Based Nightmare',
  'Mind-Bendy',
  'What the Hell Is Wrong',
  'Psychological Horror',
  'Apocalyptic',
  'Comfort Chaos',
  'Chaos Energy',
  'Slow Burn',
  'Feel Good',
  'Edge of Your Seat',
]

export const DEFAULT_ATTENTION_TAGS = [
  'Must Focus',
  'Half-Watch',
  'Do NOT Scroll',
  'Background Noise',
  'Active Watching',
]

export const VIEWING_MODES = [
  'Dark / Heavy',
  'Focused / Must Pay Attention',
  'Stressful but Good',
  'Comfort Watch',
  'Family Night',
  'Background Noise',
]

export const GORE_LEVELS = ['None', 'Low', 'Medium', 'High', 'Extreme']

export const KID_FRIENDLY_OPTIONS = ['Yes', 'No', 'Maybe']

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function useSettings() {
  const [vibeTags, setVibeTags] = useState(() => load('ws_vibe_tags', DEFAULT_VIBE_TAGS))
  const [attentionTags, setAttentionTags] = useState(() => load('ws_attention_tags', DEFAULT_ATTENTION_TAGS))

  useEffect(() => { localStorage.setItem('ws_vibe_tags', JSON.stringify(vibeTags)) }, [vibeTags])
  useEffect(() => { localStorage.setItem('ws_attention_tags', JSON.stringify(attentionTags)) }, [attentionTags])

  function addVibeTag(tag) { if (tag && !vibeTags.includes(tag)) setVibeTags(t => [...t, tag]) }
  function removeVibeTag(tag) { setVibeTags(t => t.filter(v => v !== tag)) }
  function addAttentionTag(tag) { if (tag && !attentionTags.includes(tag)) setAttentionTags(t => [...t, tag]) }
  function removeAttentionTag(tag) { setAttentionTags(t => t.filter(v => v !== tag)) }

  return {
    vibeTags, attentionTags,
    addVibeTag, removeVibeTag,
    addAttentionTag, removeAttentionTag,
  }
}
