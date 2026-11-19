import { useState } from 'react'
import { api } from '../../lib/api.js'
import { useResource } from '../../lib/useResource.js'
import { ActionForm, Resource } from '../../components/Request.jsx'

const roles = { traveler: 'Viajero', moderator: 'Moderador', auditor: 'Auditor', admin: 'Administrador' }

export default function Users({ token }) {
  const [page, setPage] = useState(0)
  const users = useResource('/admin/users?page=' + page, token)
  return <section className="surface"><h1>Usuarios y roles</h1>
    <Resource resource={users}>{(accounts) => <>
      {!accounts.length && <p>No hay cuentas en esta página.</p>}
      <div className="results-grid">{accounts.map((user) => <article key={user.id} className="place-result">
        <h2>{user.display_name || user.email}</h2>
        {user.display_name && <p>{user.email}</p>}
        {user.role === 'admin' ? <p>{roles.admin}</p> :
          <ActionForm label="Guardar rol" reset={false} onSubmit={async (body) => {
            await api('/admin/users/' + user.id + '/role', { method: 'PATCH', token, body })
            users.reload()
          }}>
            <label>Rol <select name="role" defaultValue={user.role}>
              {Object.entries(roles).filter(([role]) => role !== 'admin').map(([role,label]) =>
                <option value={role} key={role}>{label}</option>)}
            </select></label>
          </ActionForm>}
      </article>)}</div>
      <div className="actions">
        {page > 0 && <button onClick={() => setPage(page - 1)}>Anterior</button>}
        {accounts.length === 50 && page < 200 && <button onClick={() => setPage(page + 1)}>Siguiente</button>}
      </div>
    </>}</Resource>
  </section>
}
