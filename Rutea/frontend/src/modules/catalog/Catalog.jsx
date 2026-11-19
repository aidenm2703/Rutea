import { useState } from 'react'
import { api } from '../../lib/api.js'
import { useResource } from '../../lib/useResource.js'
import { ActionForm, Resource } from '../../components/Request.jsx'

const states = { confirmed: 'Confirmado', reported: 'Reportado', unavailable: 'Ausencia documentada', unknown: 'Desconocido' }

function MapView({ place }) {
  const [show, setShow] = useState(false)
  const { latitude: lat, longitude: lon } = place
  const url = new URL('https://www.openstreetmap.org/export/embed.html')
  url.search = new URLSearchParams({
    bbox: [Math.max(-180,lon-.04),Math.max(-90,lat-.03),Math.min(180,lon+.04),Math.min(90,lat+.03)].join(','),
    marker: [lat,lon].join(','), layer: 'mapnik',
  })
  return show
    ? <iframe className="map" title={`Mapa de ${place.name}`} src={url.href} referrerPolicy="no-referrer" loading="lazy" />
    : <button type="button" onClick={() => setShow(true)}>Mostrar mapa de OpenStreetMap</button>
}

function Place({ id, session, close }) {
  const place = useResource('/places/' + id)
  const traveler = session?.user.role === 'traveler'
  const token = session?.token
  const favorites = useResource(traveler ? '/favorites' : null, token)
  const isFavorite = favorites.data?.some((item) => item.id === id)

  return <article className="surface">
    <button className="secondary" onClick={close}>Volver a resultados</button>
    <Resource resource={place}>{(data) => <>
      <h2>{data.name}</h2>
      <p>{data.province_name} · {data.category_name}</p>
      <p>{data.description}</p>
      <p>Alimentación: {data.food || 'Desconocida'}</p>
      <p><a href={data.url} target="_blank" rel="noreferrer">Fuente de la ficha</a> · {data.checked_on} · {states[data.confidence]}</p>
      <MapView place={data} />
      <h3>Accesibilidad</h3>
      <dl>{data.accessibility.map((item) => <div key={item.code}>
        <dt>{item.name}</dt><dd>{states[item.status]}{item.evidence && ` · ${item.evidence}`}
          {item.source_url && <> · <a href={item.source_url} target="_blank" rel="noreferrer">Fuente</a> · {item.checked_on}</>}
        </dd>
      </div>)}</dl>
      <h3>Reseñas publicadas</h3>
      {data.reviews.length ? <ul>{data.reviews.map((review) => <li key={review.id}>{review.rating}/5 · {review.body}</li>)}</ul>
        : <p>Todavía no hay reseñas publicadas.</p>}
      {traveler && <div className="stack">
        <Resource resource={favorites}>{() => <ActionForm label={isFavorite ? 'Quitar favorito' : 'Guardar favorito'} onSubmit={async () => {
          await api('/favorites/' + id, { method: isFavorite ? 'DELETE' : 'PUT', token })
          favorites.reload()
        }} />}</Resource>
        <details><summary>Registrar visita</summary>
          <ActionForm label="Registrar visita" onSubmit={(body) => api('/passport/' + id, { method: 'POST', token, body })}>
            <label>Fecha <input type="date" name="visitedOn" required /></label>
          </ActionForm>
        </details>
        <details><summary>Escribir reseña</summary>
          <ActionForm label="Enviar a moderación" success="Reseña enviada a moderación." onSubmit={(body) => api('/places/' + id + '/reviews', {
            method: 'POST', token, body: { ...body, rating: Number(body.rating) },
          })}>
            <label>Calificación <input name="rating" type="number" min="1" max="5" required /></label>
            <label>Reseña <textarea name="body" minLength="5" maxLength="2000" required /></label>
          </ActionForm>
        </details>
        <details><summary>Reportar información</summary>
          <ActionForm label="Enviar reporte" success="Reporte enviado." onSubmit={(body) => api('/places/' + id + '/reports', {
            method: 'POST', token, body,
          })}>
            <label>¿Qué dato debemos revisar? <textarea name="body" minLength="5" maxLength="2000" required /></label>
          </ActionForm>
        </details>
      </div>}
    </>}</Resource>
  </article>
}

export default function Catalog({ session, placeId, selectPlace }) {
  const metadata = useResource('/catalog/metadata')
  const [criteria, setCriteria] = useState({})
  const [page, setPage] = useState(0)
  const results = useResource('/places?' + new URLSearchParams({ ...criteria, page }))
  if (placeId) return <Place key={placeId} id={placeId} session={session} close={() => selectPlace(null)} />

  return <section className="surface">
    <h1>Explora Costa Rica</h1>
    <Resource resource={metadata}>{(options) => <form className="filter-grid" onSubmit={(event) => {
      event.preventDefault()
      setCriteria(Object.fromEntries(new FormData(event.currentTarget)))
      setPage(0)
    }}>
      <label>Buscar <input name="query" placeholder="Nombre o descripción" maxLength="120" /></label>
      <label>Provincia <select name="province"><option value="">Todas</option>{options.provinces.map((p) =>
        <option key={p.code} value={p.code}>{p.name}</option>)}</select></label>
      <label>Categoría <select name="category"><option value="">Todas</option>{options.categories.map((p) =>
        <option key={p.code} value={p.code}>{p.name}</option>)}</select></label>
      <label>Alimentación <input name="food" maxLength="120" /></label>
      <label>Accesibilidad confirmada <select name="feature"><option value="">Cualquiera</option>{options.features.map((p) =>
        <option key={p.code} value={p.code}>{p.name}</option>)}</select></label>
      <button>Buscar lugares</button>
    </form>}</Resource>
    <Resource resource={results}>{(places) => <>
      {places.length === 0 && <p>No hay lugares con esos filtros.</p>}
      <div className="results-grid">{places.map((place) => <article key={place.id} className="place-result">
        <p>{place.province_name} · {place.category_name}</p>
        <h2>{place.name}</h2>
        <button onClick={() => selectPlace(place.id)}>Ver ficha</button>
      </article>)}</div>
      <div className="actions">
        {page > 0 && <button onClick={() => setPage(page - 1)}>Anterior</button>}
        {places.length === 50 && page < 200 && <button onClick={() => setPage(page + 1)}>Siguiente</button>}
      </div>
    </>}</Resource>
  </section>
}
