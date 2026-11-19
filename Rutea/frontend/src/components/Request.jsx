import { useState } from 'react'

export function Resource({ resource, children }) {
  if (resource.error) return <div><p role="alert">{resource.error}</p><button onClick={resource.reload}>Reintentar</button></div>
  if (resource.data === undefined) return <p role="status">Cargando…</p>
  return children(resource.data)
}

export function ActionForm({ onSubmit, children, label, success = 'Guardado.', reset = true }) {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    setPending(true)
    setMessage('')
    setFailed(false)
    try {
      await onSubmit(Object.fromEntries(new FormData(form)))
      if (reset) form.reset()
      setMessage(success)
    } catch (error) {
      setFailed(true)
      setMessage(error.message)
    } finally {
      setPending(false)
    }
  }
  return <form onSubmit={submit}>
    <fieldset disabled={pending}>
      {children}
      <button type="submit">{pending ? 'Procesando…' : label}</button>
    </fieldset>
    {message && <p role={failed ? 'alert' : 'status'} className={failed ? 'error' : ''}>{message}</p>}
  </form>
}
