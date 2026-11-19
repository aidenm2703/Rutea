import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'

export default function AuthForm({ onLogin, notice }) {
  const [register, setRegister] = useState(false)
  const [policies, setPolicies] = useState(null)
  const [policyError, setPolicyError] = useState('')
  const [policyAttempt, setPolicyAttempt] = useState(0)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!register) return
    const controller = new AbortController()
    api('/auth/policies', { signal: controller.signal }).then(setPolicies).catch((error) => {
      if (error.name !== 'AbortError') setPolicyError(error.message)
    })
    return () => controller.abort()
  }, [register, policyAttempt])

  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const body = { email: fields.get('email'), password: fields.get('password') }
    if (register) {
      body.acceptedPolicies = fields.has('acceptance')
      body.policyVersion = policies?.version
    }
    setPending(true)
    setError('')
    setSuccess('')
    try {
      const data = await api(register ? '/auth/register' : '/auth/login', { method: 'POST', body })
      if (register) {
        form.reset()
        setRegister(false)
        setSuccess(data.message)
      } else {
        onLogin(data)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="card" aria-labelledby="auth-title">
      <h1 id="auth-title">{register ? 'Crea tu cuenta' : 'Inicia sesión'}</h1>
      {(success || notice) && <p role="status">{success || notice}</p>}
      <form onSubmit={submit} key={String(register)}>
        <label htmlFor="email">Correo electrónico</label>
        <input id="email" name="email" type="email" autoComplete="username" maxLength={254} required />
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" minLength={register ? 12 : undefined}
          autoComplete={register ? 'new-password' : 'current-password'} required />
        {register && <small>Usa al menos 12 caracteres y hasta 72 bytes en UTF-8.</small>}
        {register && (policies ? (
          <div className="policies">
            <details><summary>Términos de prueba</summary><p>{policies.terms}</p></details>
            <details><summary>Privacidad de prueba</summary><p>{policies.privacy}</p></details>
            <label className="checkbox"><input name="acceptance" type="checkbox" required />Acepto ambos documentos.</label>
          </div>
        ) : policyError ? (
          <div>
            <p role="alert">{policyError}</p>
            <button type="button" className="secondary" onClick={() => {
              setPolicyError('')
              setPolicyAttempt((attempt) => attempt + 1)
            }}>Reintentar</button>
          </div>
        ) : <p role="status">Cargando documentos…</p>)}
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={pending || (register && !policies)}>
          {pending ? 'Enviando…' : register ? 'Crear cuenta' : 'Entrar'}
        </button>
      </form>
      <button type="button" className="secondary" disabled={pending} onClick={() => {
        setRegister(!register)
        setPolicies(null)
        setPolicyError('')
        setError('')
        setSuccess('')
      }}>{register ? 'Ya tengo cuenta' : 'Crear una cuenta'}</button>
    </section>
  )
}
