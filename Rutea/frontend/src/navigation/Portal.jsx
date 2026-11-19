import Catalog from '../modules/catalog/Catalog.jsx'
import { Audit, Legal, Profile, Recovery } from '../modules/account/Account.jsx'
import { Admin, Moderation } from '../modules/travel/Staff.jsx'
import { Favorites, Passport } from '../modules/travel/Traveler.jsx'
import { Assistants, Exchange } from '../modules/integrations/Tools.jsx'
import AuthForm from '../modules/auth/AuthForm.jsx'
import Dashboard from '../modules/auth/Dashboard.jsx'
import Users from '../modules/account/Users.jsx'
import Home from '../modules/home/Home.jsx'

export default function Portal({ page, navigate, session, notice, onLogin, onLogout, onDeleted, pending, error }) {
  const role = session?.user.role
  const token = session?.token
  const selectPlace = (id) => navigate(id ? 'lugar/' + id : 'explorar')
  const basic = [['inicio','Inicio'], ['explorar','Explorar'], ['cambio','Tipo de cambio'], ['legales','Términos y privacidad']]
  const traveler = role === 'traveler' ? [['favoritos','Favoritos'], ['pasaporte','Pasaporte']] : []
  const moderation = ['moderator','admin'].includes(role) ? [['moderacion','Moderación']] : []
  const administration = role === 'admin' ? [['administracion','Administración'], ['usuarios','Usuarios']] : []
  const audit = ['auditor','admin'].includes(role) ? [['auditoria','Auditoría']] : []
  const account = session ? [['asistentes','Asistentes'], ['perfil','Perfil'], ['cuenta','Mi cuenta']] : [['cuenta','Iniciar sesión']]
  const links = [...basic, ...traveler, ...moderation, ...administration, ...audit, ...account]
  const [view, id] = page.split('/')
  const allowed = links.some(([path]) => path === view)
  let body

  if (view === 'lugar' || view === 'explorar') {
    body = <Catalog session={session} placeId={view === 'lugar' ? id : null} selectPlace={selectPlace} />
  } else if (view === 'recuperar' || view.startsWith('reset=')) {
    body = <Recovery key={view} onBack={() => navigate('cuenta')} resetToken={view.startsWith('reset=') ? view.slice(6) : ''} />
  } else if (!allowed) {
    body = <section className="card"><h1>Vista no disponible</h1><p>Revisa el enlace o ingresa con una cuenta autorizada.</p></section>
  } else {
    const views = {
      inicio: <Home signedIn={Boolean(session)} />,
      cambio: <Exchange />, legales: <Legal />, favoritos: <Favorites token={token} selectPlace={selectPlace} />,
      pasaporte: <Passport token={token} />, moderacion: <Moderation token={token} />, administracion: <Admin token={token} />,
      usuarios: <Users token={token} />, auditoria: <Audit token={token} />,
      asistentes: <Assistants token={token} />, perfil: <Profile token={token} onDeleted={onDeleted} />,
      cuenta: session ? <Dashboard user={session.user} onLogout={onLogout} pending={pending} error={error} />
        : <AuthForm notice={notice} onLogin={onLogin} />,
    }
    body = views[view]
  }

  return <>
    <header className={session ? 'portal-header' : 'portal-header portal-header-public'}>
      <a className="wordmark" href="#inicio" aria-label="Rutea, inicio">RUTEA</a>
      <nav aria-label="Navegación principal">{links.map(([path,label]) =>
        <a key={path} href={'#' + path} className={!session && path === 'cuenta' ? 'portal-sign-in' : undefined}
          aria-current={path === view ? 'page' : undefined}>{label}</a>)}</nav>
    </header>
    <main>{body}</main>
  </>
}
