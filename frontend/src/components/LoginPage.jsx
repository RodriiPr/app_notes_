import { useState } from 'react'
import { login, register } from '../services/api'

const s = {
  wrap: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'var(--bg)'
  },
  box: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '40px', width: '100%', maxWidth: '400px',
    boxShadow: 'var(--shadow)', animation: 'fadeIn 0.3s ease'
  },
  logo: {
    fontFamily: "'Playfair Display', serif", fontSize: '28px',
    fontWeight: 700, color: 'var(--accent)', textAlign: 'center', marginBottom: '8px'
  },
  sub: { textAlign: 'center', color: 'var(--text3)', fontSize: '13px', marginBottom: '32px' },
  tabs: { display: 'flex', marginBottom: '24px', borderBottom: '1px solid var(--border)' },
  tab: {
    flex: 1, padding: '10px', background: 'none', border: 'none',
    fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s'
  },
  label: {
    display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--text2)', marginBottom: '6px'
  },
  input: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '11px 14px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', marginBottom: '16px', boxSizing: 'border-box'
  },
  btn: {
    width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
    background: 'var(--accent)', color: '#0f0e0c', fontSize: '15px',
    fontWeight: 700, cursor: 'pointer', marginTop: '8px', transition: 'opacity 0.15s'
  },
  error: {
    background: 'rgba(224,85,85,0.1)', border: '1px solid var(--danger)',
    borderRadius: '6px', padding: '10px 14px', color: 'var(--danger)',
    fontSize: '13px', marginBottom: '16px', textAlign: 'center'
  }
}

export default function LoginPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        const data = await login(username, password)
        localStorage.setItem('token', data.access_token)
        onAuth()
      } else {
        await register(username, password)
        const data = await login(username, password)
        localStorage.setItem('token', data.access_token)
        onAuth()
      }
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.logo}>✦ Notes</div>
        <div style={s.sub}>Your personal notes, organized.</div>

        <div style={s.tabs}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              style={{
                ...s.tab,
                color: mode === m ? 'var(--accent)' : 'var(--text3)',
                borderBottom: mode === m ? '2px solid var(--accent)' : '2px solid transparent'
              }}
              onClick={() => { setMode(m); setError('') }}
            >
              {m === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        {error && <div style={s.error}>{error}</div>}

        <label style={s.label}>Username</label>
        <input
          style={s.input}
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="your username"
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <label style={s.label}>Password</label>
        <input
          style={s.input}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <button
          style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </div>
    </div>
  )
}