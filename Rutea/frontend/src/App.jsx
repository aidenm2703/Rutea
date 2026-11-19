import { useEffect, useState } from 'react'
import { api } from './lib/api.js'
import Portal from './navigation/Portal.jsx'

function currentPage() {
  return window.location.hash.slice(1) || 'explorar'
}

export default function App() {
  const [page, setPage] = useState(currentPage)
  const [session, setSession] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const navigate = (path) => {
    if (window.location.hash.startsWith('#reset=')) {
      window.history.replaceState(null, '', '#' + path)
    } else {
      window.location.hash = path
    }
    setPage(path)
  }

  useEffect(() => {
    const update = () => setPage(currentPage())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  useEffect(() => {
    if (!session) return
    const timer = setTimeout(() => {
      setSession(null)
      setNotice('Tu sesión expiró. Vuelve a ingresar.')
      window.location.hash = 'cuenta'
    }, Math.max(0, Date.parse(session.expiresAt) - Date.now()))
    return () => clearTimeout(timer)
  }, [session])

  function closeSession(message) {
    setSession(null)
    setNotice(message)
    navigate('cuenta')
  }

  async function logout() {
    setPending(true)
    setError('')
    try {
      await api('/auth/logout', { method: 'POST', token: session.token })
      closeSession('Sesión cerrada.')
    } catch (error) {
      if (error.status === 401) closeSession('Tu sesión expiró. Vuelve a ingresar.')
      else setError(error.message)
    } finally {
      setPending(false)
    }
  }

  return <Portal page={page} navigate={navigate} session={session} notice={notice} pending={pending} error={error}
    onLogin={(data) => {
      setNotice('')
      setError('')
      setSession(data)
      navigate('cuenta')
    }} onLogout={logout}
    onDeleted={(id) => closeSession(`Cuenta eliminada. Comprobante ${id}.`)} />
}
