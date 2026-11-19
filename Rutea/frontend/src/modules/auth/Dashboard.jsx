const titles = {
  traveler: 'Panel de viajero',
  moderator: 'Panel de moderación',
  admin: 'Panel de administración',
  auditor: 'Panel de auditoría',
}

export default function Dashboard({ user, onLogout, pending, error }) {
  return (
    <section className="card">
      <h1>{titles[user.role] ?? 'Tu cuenta'}</h1>
      <p>{user.email}</p>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="button" onClick={onLogout} disabled={pending}>
        {pending ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>
    </section>
  )
}
