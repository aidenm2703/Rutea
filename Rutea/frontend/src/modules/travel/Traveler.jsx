import { api } from '../../lib/api.js'
import { useResource } from '../../lib/useResource.js'
import { ActionForm, Resource } from '../../components/Request.jsx'

export function Favorites({ token, selectPlace }) {
  const results = useResource('/favorites', token)
  return <section className="surface"><h1>Favoritos</h1>
    <Resource resource={results}>{(places) => places.length ? (
      <ul className="stack">{places.map((place) => <li key={place.id}>
        <button className="secondary" onClick={() => selectPlace(place.id)}>{place.name}</button>
        <ActionForm label="Quitar" onSubmit={async () => {
          await api('/favorites/' + place.id, { method: 'DELETE', token })
          results.reload()
        }} />
      </li>)}</ul>
    ) : <p>Todavía no guardaste lugares.</p>}</Resource>
  </section>
}

export function Passport({ token }) {
  const passport = useResource('/passport', token)
  return <section className="surface"><h1>Mi pasaporte</h1><p>Estas visitas son privadas y autorreportadas.</p>
    <Resource resource={passport}>{({ visits, badges }) => <>
      <h2>Insignias</h2><ul>{badges.map((badge) => <li key={badge.code}>{badge.name} · {
        badge.earned ? 'Obtenida' : `${badge.total}/${badge.unique_places} lugares`
      }</li>)}</ul>
      <h2>Visitas y sellos</h2>
      {visits.length ? <ul>{visits.map((visit) => <li key={visit.place_id + visit.visited_on}>
        {visit.name} · {visit.visited_on}{visit.stamp ? ' · Sello' : ''}
      </li>)}</ul> : <p>Registra una visita desde la ficha de un lugar.</p>}
    </>}</Resource>
  </section>
}
