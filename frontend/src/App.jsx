import { useState, useEffect, useCallback } from 'react'
import { getNotes, createNote, updateNote, toggleArchive, deleteNote, getCategories } from './services/api'
import NoteModal from './components/NoteModal'
import NoteCard from './components/NoteCard'
import CategoryManager from './components/CategoryManager'
import CategoryPicker from './components/CategoryPicker'
import LoginPage from './components/LoginPage'

const s = {
  app: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: '220px', flexShrink: 0, background: 'var(--surface)',
    borderRight: '1px solid var(--border)', padding: '28px 18px',
    display: 'flex', flexDirection: 'column'
  },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700,
    color: 'var(--accent)', letterSpacing: '-0.02em', marginBottom: '28px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '2px' },
  navItem: {
    padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '13px', fontWeight: 500, transition: 'all 0.15s', border: 'none',
    background: 'transparent', textAlign: 'left', width: '100%'
  },
  main: { flex: 1, padding: '36px 40px', overflow: 'auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700 },
  newBtn: {
    padding: '10px 22px', borderRadius: '8px', border: 'none',
    background: 'var(--accent)', color: '#0f0e0c', fontSize: '14px',
    fontWeight: 600, transition: 'opacity 0.15s'
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  empty: { color: 'var(--text3)', fontSize: '14px', marginTop: '60px', textAlign: 'center' },
  editPanel: {
    position: 'fixed', right: 0, top: 0, bottom: 0, width: '340px',
    background: 'var(--surface)', borderLeft: '1px solid var(--border)',
    padding: '28px', overflowY: 'auto', zIndex: 50, animation: 'slideIn 0.2s ease'
  },
  panelTitle: { fontFamily: "'Playfair Display', serif", fontSize: '16px', marginBottom: '16px', color: 'var(--text2)' },
  input: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', marginBottom: '12px'
  },
  textarea: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '9px 12px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', resize: 'vertical', minHeight: '140px', marginBottom: '16px'
  },
  saveBtn: {
    width: '100%', padding: '10px', borderRadius: '6px', border: 'none',
    background: 'var(--accent)', color: '#0f0e0c', fontWeight: 600, fontSize: '14px'
  },
  closeBtn: {
    position: 'absolute', top: '16px', right: '16px', background: 'none',
    border: 'none', color: 'var(--text3)', fontSize: '22px', cursor: 'pointer'
  },
  logoutBtn: {
    marginTop: 'auto', padding: '8px 12px', borderRadius: '6px',
    border: '1px solid var(--border)', background: 'transparent',
    color: 'var(--text3)', fontSize: '12px', cursor: 'pointer', width: '100%'
  }
}

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'))
  const [tab, setTab] = useState('active')
  const [notes, setNotes] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    const data = await getNotes(tab === 'archived', selectedCategory)
    setNotes(data)
    setLoading(false)
  }, [tab, selectedCategory])

  const fetchCategories = useCallback(async () => {
    const data = await getCategories()
    setCategories(data)
  }, [])

  useEffect(() => { if (authed) fetchNotes() }, [fetchNotes, authed])
  useEffect(() => { if (authed) fetchCategories() }, [fetchCategories, authed])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setAuthed(false)
  }

  const handleCreate = async (data) => {
    await createNote(data)
    setShowCreate(false)
    fetchNotes()
  }

  const openEdit = (note) => {
    setEditingNote(note)
    setEditTitle(note.title)
    setEditContent(note.content || '')
  }

  const handleSaveEdit = async () => {
    await updateNote(editingNote.id, { title: editTitle, content: editContent })
    setEditingNote(null)
    fetchNotes()
  }

  const handleNoteUpdate = (updatedNote) => {
    setEditingNote(updatedNote)
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n))
  }

  const handleArchive = async (id) => {
    await toggleArchive(id)
    fetchNotes()
  }

  const handleDelete = async (id) => {
    await deleteNote(id)
    if (editingNote?.id === id) setEditingNote(null)
    fetchNotes()
  }

  const navStyle = (t) => ({
    ...s.navItem,
    background: tab === t ? 'var(--surface2)' : 'transparent',
    color: tab === t ? 'var(--accent)' : 'var(--text2)'
  })

  if (!authed) return <LoginPage onAuth={() => setAuthed(true)} />

  return (
    <div style={s.app}>
      <aside style={s.sidebar}>
        <div style={s.logo}>✦ Notes</div>
        <nav style={s.nav}>
          <button style={navStyle('active')} onClick={() => { setTab('active'); setSelectedCategory(null) }}>
            Active notes
          </button>
          <button style={navStyle('archived')} onClick={() => { setTab('archived'); setSelectedCategory(null) }}>
            Archived notes
          </button>
        </nav>
        <CategoryManager
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
          onRefresh={fetchCategories}
        />
        <button
          style={s.logoutBtn}
          onClick={handleLogout}
          onMouseEnter={e => { e.target.style.color = 'var(--danger)'; e.target.style.borderColor = 'var(--danger)' }}
          onMouseLeave={e => { e.target.style.color = 'var(--text3)'; e.target.style.borderColor = 'var(--border)' }}
        >
          Sign out
        </button>
      </aside>

      <main style={{ ...s.main, marginRight: editingNote ? '340px' : '0' }}>
        <div style={s.header}>
          <h1 style={s.pageTitle}>
            {tab === 'active' ? 'Active Notes' : 'Archived Notes'}
            <span style={{ fontSize: '15px', color: 'var(--text3)', fontFamily: "'DM Sans'", fontWeight: 300, marginLeft: '12px' }}>
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
          </h1>
          {tab === 'active' && (
            <button style={s.newBtn} onClick={() => setShowCreate(true)}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}>
              + New note
            </button>
          )}
        </div>

        {loading ? (
          <div style={s.empty}>Loading...</div>
        ) : notes.length === 0 ? (
          <div style={s.empty}>
            {tab === 'active' ? 'No active notes yet. Create your first one!' : 'No archived notes.'}
          </div>
        ) : (
          <div style={s.grid}>
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                categories={categories}
                onEdit={openEdit}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onUpdate={handleNoteUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {editingNote && (
        <div style={s.editPanel}>
          <button style={s.closeBtn} onClick={() => setEditingNote(null)}>×</button>
          <div style={s.panelTitle}>Editing note</div>
          <input
            style={s.input}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Title"
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <textarea
            style={s.textarea}
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            placeholder="Content"
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button style={s.saveBtn} onClick={handleSaveEdit}>Save changes</button>
          <CategoryPicker
            note={editingNote}
            categories={categories}
            onUpdate={handleNoteUpdate}
          />
        </div>
      )}

      {showCreate && <NoteModal onSave={handleCreate} onClose={() => setShowCreate(false)} />}
    </div>
  )
}