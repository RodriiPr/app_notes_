import { useState } from 'react'
import { createCategory, deleteCategory } from '../services/api'

const PALETTE = [
  '#60a5fa', 
  '#4ade80', 
  '#f97316', 
  '#a78bfa', 
  '#f472b6', 
  '#facc15', 
  '#d33434', 
  '#f87171',
]

const getColor = (cat, index) => cat.color && cat.color !== '#c4974a' ? cat.color : PALETTE[index % PALETTE.length]

const s = {
  section: { marginTop: '28px' },
  heading: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '12px' },
  item: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '7px 10px', borderRadius: '6px', cursor: 'pointer',
    transition: 'background 0.15s', fontSize: '13px', marginBottom: '2px'
  },
  dot: { width: '8px', height: '8px', borderRadius: '50%', marginRight: '9px', flexShrink: 0 },
  del: { opacity: 0, fontSize: '16px', color: 'var(--danger)', background: 'none',
    border: 'none', lineHeight: 1, padding: '0 2px', transition: 'opacity 0.15s', cursor: 'pointer' },
  input: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '7px 10px', color: 'var(--text)', fontSize: '13px',
    outline: 'none', marginTop: '8px'
  },
  addBtn: {
    width: '100%', marginTop: '6px', padding: '7px', borderRadius: '6px',
    border: '1px dashed var(--border)', background: 'transparent',
    color: 'var(--text3)', fontSize: '12px', transition: 'all 0.15s', cursor: 'pointer'
  },
  colorRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' },
  colorDot: { width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer', border: '2px solid transparent', transition: 'transform 0.15s' }
}

export default function CategoryManager({ categories, selectedId, onSelect, onRefresh }) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PALETTE[0])
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!newName.trim()) return
    await createCategory(newName.trim(), newColor)
    setNewName('')
    setNewColor(PALETTE[0])
    setAdding(false)
    onRefresh()
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    await deleteCategory(id)
    if (selectedId === id) onSelect(null)
    onRefresh()
  }

  return (
    <div style={s.section}>
      <div style={s.heading}>Categories</div>

      <div
        style={{ ...s.item, background: selectedId === null ? 'var(--surface2)' : 'transparent', color: selectedId === null ? 'var(--text)' : 'var(--text2)' }}
        onClick={() => onSelect(null)}
      >
        All categories
      </div>

      {categories.map((cat, i) => {
        const color = getColor(cat, i)
        return (
          <div
            key={cat.id}
            style={{ ...s.item, background: selectedId === cat.id ? 'var(--surface2)' : 'transparent', color: selectedId === cat.id ? 'var(--text)' : 'var(--text2)' }}
            onClick={() => onSelect(cat.id === selectedId ? null : cat.id)}
            onMouseEnter={e => { e.currentTarget.querySelector('.del-btn').style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.querySelector('.del-btn').style.opacity = '0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ ...s.dot, background: color }} />
              {cat.name}
            </div>
            <button className="del-btn" style={s.del} onClick={(e) => handleDelete(e, cat.id)}>×</button>
          </div>
        )
      })}

      {adding ? (
        <>
          <input
            style={s.input}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Category name..."
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
          />
          <div style={s.colorRow}>
            {PALETTE.map(c => (
              <div
                key={c}
                style={{ ...s.colorDot, background: c, borderColor: newColor === c ? '#fff' : 'transparent', transform: newColor === c ? 'scale(1.2)' : 'scale(1)' }}
                onClick={() => setNewColor(c)}
              />
            ))}
          </div>
          <button
            onClick={handleAdd}
            style={{ marginTop: '8px', width: '100%', padding: '6px', borderRadius: '6px', border: 'none', background: 'var(--accent)', color: '#0f0e0c', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            Add
          </button>
        </>
      ) : (
        <button style={s.addBtn} onClick={() => setAdding(true)}
          onMouseEnter={e => { e.target.style.color = 'var(--accent)'; e.target.style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { e.target.style.color = 'var(--text3)'; e.target.style.borderColor = 'var(--border)' }}>
          + Add category
        </button>
      )}
    </div>
  )
}