import { useState } from 'react'
import { addCategoryToNote, removeCategoryFromNote } from '../services/api'

const s = {
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px', display: 'flex',
    flexDirection: 'column', gap: '10px', transition: 'border-color 0.2s, transform 0.15s',
    animation: 'fadeIn 0.25s ease',
  },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: 700, color: 'var(--text)' },
  content: { fontSize: '13px', color: 'var(--text2)', lineHeight: 1.65,
    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: {
    fontSize: '11px', padding: '2px 9px', borderRadius: '20px',
    background: 'var(--surface2)', border: '1px solid',
    fontWeight: 500, letterSpacing: '0.04em', cursor: 'pointer'
  },
  actions: { display: 'flex', gap: '6px', marginTop: '4px' },
  btn: {
    flex: 1, padding: '7px', borderRadius: '6px', border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text2)', fontSize: '12px',
    fontWeight: 500, transition: 'all 0.15s', letterSpacing: '0.02em'
  },
  date: { fontSize: '11px', color: 'var(--text3)' },
  catPopup: {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '10px', marginTop: '6px',
    display: 'flex', flexWrap: 'wrap', gap: '6px'
  },
  catPill: {
    fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
    border: '1px solid', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s'
  }
}

export default function NoteCard({ note, onEdit, onArchive, onDelete, categories = [], onUpdate }) {
  const [hovered, setHovered] = useState(false)
  const [showCats, setShowCats] = useState(false)

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const noteCategIds = note.categories?.map(c => c.id) || []

  const toggleCat = async (e, catId) => {
    e.stopPropagation()
    let updated
    if (noteCategIds.includes(catId)) {
      updated = await removeCategoryFromNote(note.id, catId)
    } else {
      updated = await addCategoryToNote(note.id, catId)
    }
    onUpdate && onUpdate(updated)
  }

  return (
    <div
      style={{ ...s.card, borderColor: hovered ? 'var(--accent2)' : 'var(--border)', transform: hovered ? 'translateY(-2px)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.title}>{note.title}</div>
      {note.content && <div style={s.content}>{note.content}</div>}

      {/* Tags asignadas */}
      {note.categories?.length > 0 && (
        <div style={s.tags}>
          {note.categories.map(c => (
            <span
              key={c.id}
              style={{ ...s.tag, borderColor: c.color || 'var(--border)', color: c.color || 'var(--accent2)' }}
              title="Click to remove"
              onClick={(e) => toggleCat(e, c.id)}
            >
              × {c.name}
            </span>
          ))}
        </div>
      )}

      {/* Selector de categorías */}
      {categories.length > 0 && (
        <>
          <button
            style={{ ...s.btn, flex: 'none', fontSize: '11px', padding: '4px 10px' }}
            onClick={() => setShowCats(v => !v)}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)' }}
          >
            {showCats ? '▲ Hide categories' : '▼ Add category'}
          </button>
          {showCats && (
            <div style={s.catPopup}>
              {categories.map(cat => {
                const active = noteCategIds.includes(cat.id)
                return (
                  <span
                    key={cat.id}
                    style={{
                      ...s.catPill,
                      background: active ? (cat.color || 'var(--accent2)') : 'transparent',
                      borderColor: cat.color || 'var(--border)',
                      color: active ? '#0f0e0c' : (cat.color || 'var(--text2)')
                    }}
                    onClick={(e) => toggleCat(e, cat.id)}
                  >
                    {active ? '✓ ' : '+ '}{cat.name}
                  </span>
                )
              })}
            </div>
          )}
        </>
      )}

      <div style={s.date}>{fmt(note.updated_at)}</div>
      <div style={s.actions}>
        <button style={s.btn} onClick={() => onEdit(note)}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)' }}>
          Edit
        </button>
        <button style={s.btn} onClick={() => onArchive(note.id)}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--accent2)'; e.target.style.color = 'var(--accent2)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)' }}>
          {note.archived ? 'Unarchive' : 'Archive'}
        </button>
        <button style={s.btn} onClick={() => onDelete(note.id)}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--danger)'; e.target.style.color = 'var(--danger)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)' }}>
          Delete
        </button>
      </div>
    </div>
  )
}