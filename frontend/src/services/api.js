import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (username, password) => {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  return api.post('/auth/login', form).then(r => r.data)
}

export const register = (username, password) =>
  api.post('/auth/register', { username, password }).then(r => r.data)

export const getMe = () =>
  api.get('/auth/me').then(r => r.data)

// Notes
export const getNotes = (archived = false, categoryId = null) => {
  const endpoint = archived ? '/notes/archived' : '/notes/active'
  const params = categoryId ? { category_id: categoryId } : {}
  return api.get(endpoint, { params }).then(r => r.data)
}

export const createNote = (data) =>
  api.post('/notes/', data).then(r => r.data)

export const updateNote = (id, data) =>
  api.patch(`/notes/${id}`, data).then(r => r.data)

export const toggleArchive = (id) =>
  api.patch(`/notes/${id}/archive`).then(r => r.data)

export const deleteNote = (id) =>
  api.delete(`/notes/${id}`)

// Categories
export const getCategories = () =>
  api.get('/categories/').then(r => r.data)

export const createCategory = (name, color = "#6ee7b7") =>
  api.post('/categories/', { name, color }).then(r => r.data)

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`)

export const addCategoryToNote = (noteId, categoryId) =>
  api.post(`/notes/${noteId}/categories/${categoryId}`).then(r => r.data)

export const removeCategoryFromNote = (noteId, categoryId) =>
  api.delete(`/notes/${noteId}/categories/${categoryId}`).then(r => r.data)