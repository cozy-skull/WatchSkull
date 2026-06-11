import { useState } from 'react'
import { PageHeader, Label, Btn } from './UI.jsx'

const EMOJI_OPTIONS = [
  '💀','👻','🦇','🕷️','🌙','⭐','🔥','❄️','🎬','🍿',
  '👁️','🐺','🦊','🐱','🐶','🦋','🌿','🌸','🎭','🎪',
  '🧠','💜','🖤','❤️','🤍','💛','🩷','🩵','🧡','💚',
]

function ProfileCard({ profile, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [name,    setName]    = useState(profile.name)
  const [emoji,   setEmoji]   = useState(profile.emoji)

  function save() {
    if (!name.trim()) return
    onUpdate(profile.id, { name: name.trim(), emoji })
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{
        background: 'var(--bg-hover)', border: '1px solid var(--amber)',
        borderRadius: 8, padding: 18,
      }}>
        <div style={{ marginBottom: 14 }}>
          <Label>Name</Label>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label>Emoji</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  fontSize: 22, background: emoji === e ? 'var(--bg-raised)' : 'none',
                  border: '2px solid ' + (emoji === e ? 'var(--amber)' : 'transparent'),
                  borderRadius: 6, padding: '4px 6px', cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >{e}</button>
            ))}
            {/* Custom emoji input */}
            <input
              value={EMOJI_OPTIONS.includes(emoji) ? '' : emoji}
              onChange={e => setEmoji(e.target.value)}
              placeholder="✏️"
              style={{ width: 54, textAlign: 'center', fontSize: 18, padding: '4px 6px' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn onClick={save}>Save</Btn>
          <Btn variant="ghost" onClick={() => { setEditing(false); setName(profile.name); setEmoji(profile.emoji) }}>Cancel</Btn>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-hi)',
      borderRadius: 8, padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <span style={{ fontSize: 32 }}>{profile.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-hi)' }}>{profile.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 2 }}>Household member</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn variant="ghost" small onClick={() => setEditing(true)}>Edit</Btn>
        <Btn variant="danger" small onClick={() => onRemove(profile.id)}>Remove</Btn>
      </div>
    </div>
  )
}

function AddProfileForm({ onAdd }) {
  const [open,  setOpen]  = useState(false)
  const [name,  setName]  = useState('')
  const [emoji, setEmoji] = useState('⭐')

  function submit() {
    if (!name.trim()) return
    onAdd(name.trim(), emoji)
    setName('')
    setEmoji('⭐')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%', background: 'none',
          border: '2px dashed var(--border-hi)',
          borderRadius: 8, padding: '14px',
          color: 'var(--text-low)', fontSize: 13,
          cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.color = 'var(--text-low)' }}
      >+ Add Household Member</button>
    )
  }

  return (
    <div style={{ background: 'var(--bg-hover)', border: '1px solid var(--amber)', borderRadius: 8, padding: 18 }}>
      <div style={{ marginBottom: 14 }}>
        <Label>Name</Label>
        <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Name…" autoFocus />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Label>Pick an Emoji</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EMOJI_OPTIONS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              style={{
                fontSize: 22, background: emoji === e ? 'var(--bg-raised)' : 'none',
                border: '2px solid ' + (emoji === e ? 'var(--amber)' : 'transparent'),
                borderRadius: 6, padding: '4px 6px', cursor: 'pointer',
              }}
            >{e}</button>
          ))}
          <input
            value={EMOJI_OPTIONS.includes(emoji) ? '' : emoji}
            onChange={e => setEmoji(e.target.value)}
            placeholder="✏️"
            style={{ width: 54, textAlign: 'center', fontSize: 18, padding: '4px 6px' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn onClick={submit}>Add Member</Btn>
        <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
      </div>
    </div>
  )
}

function TagManager({ label, tags, onAdd, onRemove }) {
  const [input, setInput] = useState('')

  function submit() {
    if (!input.trim()) return
    onAdd(input.trim())
    setInput('')
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hi)', borderRadius: 8, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)', marginBottom: 14 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {tags.map(tag => (
          <div key={tag} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-hover)', border: '1px solid var(--border-hi)',
            borderRadius: 4, padding: '4px 10px',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text)' }}>{tag}</span>
            <button
              onClick={() => onRemove(tag)}
              style={{ background: 'none', border: 'none', color: 'var(--text-low)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
            >×</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="New tag…"
          style={{ flex: 1 }}
        />
        <Btn onClick={submit} small>Add</Btn>
      </div>
    </div>
  )
}

export function SettingsView({ profiles, settings }) {
  return (
    <div>
      <PageHeader title="Settings" sub="Manage your household and customize your tags." />

      {/* Household Members */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--text-low)', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>
          Household Members
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {profiles.profiles.map(p => (
            <ProfileCard
              key={p.id}
              profile={p}
              onUpdate={profiles.updateProfile}
              onRemove={profiles.removeProfile}
            />
          ))}
        </div>
        <AddProfileForm onAdd={profiles.addProfile} />
      </section>

      {/* Tag Management */}
      <section>
        <div style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--text-low)', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>
          Custom Tags
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <TagManager
            label="Vibe Tags"
            tags={settings.vibeTags}
            onAdd={settings.addVibeTag}
            onRemove={settings.removeVibeTag}
          />
          <TagManager
            label="Attention Tags"
            tags={settings.attentionTags}
            onAdd={settings.addAttentionTag}
            onRemove={settings.removeAttentionTag}
          />
        </div>
      </section>
    </div>
  )
}
