import { api } from '../../lib/api.js'
import { useResource } from '../../lib/useResource.js'
import { ActionForm, Resource } from '../../components/Request.jsx'

export function Recovery({ onBack, resetToken }) {
  return <section className="card">
    <h1>{resetToken ? 'Nueva contraseña' : 'Recuperar contraseña'}</h1>
    <ActionForm label={resetToken ? 'Cambiar contraseña' : 'Solicitar enlace'} success={
      resetToken ? 'Contraseña actualizada. Ya puedes iniciar sesión.' :
        'Si existe una cuenta asociada, se enviará un enlace de recuperación.'
    } onSubmit={(body) => api(resetToken ? '/password/reset' : '/password/recovery', {
      method: 'POST', body: resetToken ? { ...body, token: resetToken } : body,
    })}>
      {resetToken ? <label>Nueva contraseña <input name="password" autoComplete="new-password" type="password" minLength="12" required /></label>
        : <label>Correo electrónico <input name="email" type="email" autoComplete="username" maxLength="254" required /></label>}
    </ActionForm>
    <button type="button" className="secondary" onClick={onBack}>Volver al inicio de sesión</button>
  </section>
}

export function Profile({ token, onDeleted }) {
  const profile = useResource('/profile', token)
  return <section className="surface"><h1>Perfil y privacidad</h1>
    <Resource resource={profile}>{(user) => <>
      <p>{user.email}</p>
      <ActionForm label="Guardar perfil" reset={false} onSubmit={async (body) => {
        await api('/profile', { method: 'PATCH', token, body })
        profile.reload()
      }}>
        <label>Nombre visible <input name="displayName" maxLength="100" defaultValue={user.display_name ?? ''} required /></label>
      </ActionForm>
      <h2>Políticas aceptadas</h2>
      <ul>{user.policies.map((policy) => <li key={policy.version}>
        {policy.version} · {new Date(policy.acceptedAt).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })}
      </li>)}</ul>
      <details><summary>Eliminar mi cuenta</summary>
        <p>Se eliminarán el perfil, las sesiones, las visitas y tus publicaciones. Conservaremos un comprobante sin tu identidad y usaremos tu correo para enviarte una confirmación.</p>
        <ActionForm label="Eliminar cuenta" onSubmit={async (body) => {
          const { id } = await api('/profile/deletion', { method: 'POST', token, body })
          onDeleted(id)
        }}>
          <label>Contraseña actual <input name="password" type="password" autoComplete="current-password" required /></label>
          <label>Escribe ELIMINAR <input name="confirm" pattern="ELIMINAR" autoComplete="off" required /></label>
        </ActionForm>
      </details>
    </>}</Resource>
  </section>
}

export function Legal() {
  const policies = useResource('/auth/policies')
  return <section className="surface"><h1>Términos y privacidad</h1>
    <Resource resource={policies}>{(data) => <>
      <p>Versión {data.version}</p>
      <h2>Términos de prueba</h2><p>{data.terms}</p>
      <h2>Privacidad de prueba</h2><p>{data.privacy}</p>
    </>}</Resource>
  </section>
}

export function Audit({ token }) {
  const audit = useResource('/audit', token)
  const agents = useResource('/audit/agents', token)
  return <section className="surface"><h1>Auditoría</h1>
    <Resource resource={audit}>{({ events, acceptances, deletions }) => <>
      <h2>Eventos recientes</h2>
      {events.length ? <ul>{events.map((item) => <li key={item.id}>{item.action} · {item.created_at}</li>)}</ul> : <p>Sin eventos.</p>}
      <h2>Aceptaciones recientes</h2>
      <ul>{acceptances.map((item, index) => <li key={index}>{item.policy_version} · {item.accepted_at}</li>)}</ul>
      <h2>Bajas completadas</h2>
      <ul>{deletions.map((item) => <li key={item.id}>{item.id} · {item.completed_at}</li>)}</ul>
    </>}</Resource>
    <h2>Ejecuciones de asistentes</h2>
    <Resource resource={agents}>{(rows) => rows.length ? <ul>{rows.map((row) => <li key={row.id}>
      {row.agent} · {row.status} · {row.duration_ms} ms · {row.created_at}
    </li>)}</ul> : <p>Sin ejecuciones.</p>}</Resource>
  </section>
}
