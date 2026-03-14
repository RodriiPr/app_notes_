import { addCategoryToNote, removeCategoryFromNote } from '../services/api'

const s = {
  wrap: { marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' },
  label: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--text2)', marginBottom: '8px', display: 'block' },
  pill: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
    fontWeight: 500, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
    margin: '3px'
  }
}

export default function CategoryPicker({ note, categories, onUpdate }) {
  const noteCategIds = note.categories?.map(c => c.id) || []

  const toggle = async (catId) => {
    let updated
    if (noteCategIds.includes(catId)) {
      updated = await removeCategoryFromNote(note.id, catId)
    } else {
      updated = await addCategoryToNote(note.id, catId)
    }
    onUpdate(updated)
  }

  if (categories.length === 0) return null

  return (
    <div style={s.wrap}>
      <span style={s.label}>Categories</span>
      <div>
        {categories.map(cat => {
          const active = noteCategIds.includes(cat.id)
          return (
            <span
              key={cat.id}
              style={{
                ...s.pill,
                background: active ? 'var(--accent2)' : 'var(--surface2)',
                borderColor: active ? 'var(--accent2)' : 'var(--border)',
                color: active ? '#0f0e0c' : 'var(--text2)'
              }}
              onClick={() => toggle(cat.id)}
            >
              {active && '✓ '}{cat.name}
            </span>
          )
        })}
      </div>
    </div>
  )
}
