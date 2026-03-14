import { useState, useEffect } from 'react'

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease'
  },
  modal: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '32px', width: '100%',
    maxWidth: '560px', boxShadow: 'var(--shadow)', animation: 'fadeIn 0.2s ease'
  },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: '22px',
    marginBottom: '24px', color: 'var(--text)'
  },
  label: { display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--text2)', marginBottom: '6px' },
  input: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '10px 14px', color: 'var(--text)', fontSize: '15px',
    outline: 'none', transition: 'border-color 0.2s', marginBottom: '18px'
  },
  textarea: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '10px 14px', color: 'var(--text)', fontSize: '15px',
    outline: 'none', resize: 'vertical', minHeight: '120px', marginBottom: '24px',
    transition: 'border-color 0.2s'
  },
  row: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  btnCancel: {
    padding: '9px 20px', borderRadius: '6px', border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text2)', fontSize: '14px', fontWeight: 500
  },
  btnSave: {
    padding: '9px 24px', borderRadius: '6px', border: 'none',
    background: 'var(--accent)', color: '#0f0e0c', fontSize: '14px', fontWeight: 600
  },
}

export default function NoteModal({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), content: content.trim() })
  }

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.title}>{note ? 'Edit note' : 'New note'}</div>
        <label style={styles.label}>Title</label>
        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title..."
          autoFocus
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <label style={styles.label}>Content</label>
        <textarea
          style={styles.textarea}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your note..."
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <div style={styles.row}>
          <button style={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button style={styles.btnSave} onClick={handleSubmit} disabled={!title.trim()}>
            {note ? 'Save changes' : 'Create note'}
          </button>
        </div>
      </div>
    </div>
  )
}
