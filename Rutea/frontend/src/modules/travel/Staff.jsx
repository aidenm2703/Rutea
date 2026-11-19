import { useState } from 'react'
import { api } from '../../lib/api.js'
import { useResource } from '../../lib/useResource.js'
import { ActionForm, Resource } from '../../components/Request.jsx'

export function Moderation({ token }) {
  const queue = useResource('/moderation', token)
  return <section className="surface"><h1>Moderación</h1>
    <Resource resource={queue}>{(items) => items.length ? items.map((item) => <article className="place-result" key={item.id}>
      <h2>{item.name}</h2><p>{item.kind === 'review' ? 'Reseña' : 'Reporte'}{item.rating && ` · ${item.rating}/5`}</p>
      <p>{item.body}</p>
      <ActionForm label="Guardar decisión" onSubmit={async (body) => {
        await api('/moderation/' + item.id, { method: 'PATCH', token, body })
        queue.reload()
      }}>
        <label>Decisión <select name="status" required>
          <option value="">Seleccionar</option><option value="approved">Aprobar</option><option value="rejected">Rechazar</option>
        </select></label>
      </ActionForm>
    </article>) : <p>No hay publicaciones por revisar.</p>}</Resource>
  </section>
}

function PlaceForm({ selected, options, save }) {
  return <ActionForm label={selected ? 'Guardar cambios' : 'Publicar lugar'} onSubmit={save} reset={!selected}>
    <label>Nombre <input name="name" defaultValue={selected?.name} required maxLength="160" /></label>
    <label>Descripción y contexto cultural <textarea name="description" defaultValue={selected?.description} required maxLength="4000" /></label>
    <label>Provincia <select name="province" defaultValue={selected?.province} required>{options.provinces.map((p) =>
      <option key={p.code} value={p.code}>{p.name}</option>)}</select></label>
    <label>Categoría <select name="category" defaultValue={selected?.category} required>{options.categories.map((p) =>
      <option key={p.code} value={p.code}>{p.name}</option>)}</select></label>
    <label>Alimentación <input name="food" defaultValue={selected?.food ?? ''} maxLength="500" /></label>
    <label>Latitud <input name="latitude" type="number" step="any" min="-90" max="90" defaultValue={selected?.latitude} required /></label>
    <label>Longitud <input name="longitude" type="number" step="any" min="-180" max="180" defaultValue={selected?.longitude} required /></label>
    <label>Fuente HTTPS <input name="url" type="url" defaultValue={selected?.url} required /></label>
    <label>Fecha de verificación <input name="checkedOn" type="date" defaultValue={selected?.checked_on} required /></label>
    <label>Confianza <select name="confidence" defaultValue={selected?.confidence}>
      <option value="reported">Reportado</option><option value="confirmed">Confirmado</option>
    </select></label>
  </ActionForm>
}

export function Admin({ token }) {
  const metadata = useResource('/catalog/metadata')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  const places = useResource('/admin/places?page=' + page, token)
  const request = (path, method, body) => api('/admin' + path, { method, body, token })

  return <section className="surface"><h1>Administración del catálogo</h1>
    <Resource resource={metadata}>{(options) => <>
      <details open><summary>{selected ? `Editar ${selected.name}` : 'Nuevo lugar'}</summary>
        {selected && <button className="secondary" onClick={() => setSelected(null)}>Nuevo lugar</button>}
        <PlaceForm key={selected?.id ?? 'new'} options={options} selected={selected} save={async (body) => {
          await request(selected ? '/places/' + selected.id : '/places', selected ? 'PUT' : 'POST',
            { ...body, latitude: Number(body.latitude), longitude: Number(body.longitude) })
          places.reload()
        }} />
      </details>
      {selected && <details key={selected.id}><summary>Evidencia de accesibilidad</summary>
        <ActionForm label="Guardar evidencia" onSubmit={({ feature, ...body }) =>
          request('/places/' + selected.id + '/accessibility/' + feature, 'PUT', body)}>
          <label>Característica <select name="feature">{options.features.map((feature) =>
            <option key={feature.code} value={feature.code}>{feature.name}</option>)}</select></label>
          <label>Estado <select name="status"><option value="reported">Reportado</option>
            <option value="confirmed">Confirmado</option><option value="unavailable">Ausencia documentada</option></select></label>
          <label>Evidencia <textarea name="body" required maxLength="2000" /></label>
          <label>Fuente HTTPS <input name="url" type="url" required /></label>
          <label>Fecha de verificación <input name="checkedOn" type="date" required /></label>
        </ActionForm>
      </details>}
      <details><summary>Categorías</summary>
        <ActionForm label="Guardar categoría" onSubmit={async (body) => {
          await request('/categories', 'PUT', body)
          metadata.reload()
        }}>
          <label>Código <input name="code" required pattern="[a-z][a-z0-9\-]*" maxLength="32" /></label>
          <label>Nombre <input name="name" required maxLength="120" /></label>
        </ActionForm>
      </details>
      <details><summary>Reglas de insignias</summary>
        <ActionForm label="Guardar regla" onSubmit={(body) => request('/badges', 'PUT', { ...body, uniquePlaces: Number(body.uniquePlaces) })}>
          <label>Código <input name="code" required pattern="[a-z][a-z0-9\-]*" maxLength="32" /></label>
          <label>Nombre <input name="name" required maxLength="120" /></label>
          <label>Lugares distintos <input name="uniquePlaces" type="number" min="1" max="10000" required /></label>
        </ActionForm>
      </details>
    </>}</Resource>
    <h2>Lugares</h2>
    <Resource resource={places}>{(items) => <>
      {!items.length && <p>No hay lugares en esta página.</p>}
      <ul>{items.map((place) => <li key={place.id}>
        {place.name}{place.archived ? ' · Archivado' : ''}
        {!place.archived && <button className="secondary" onClick={() => setSelected(place)}>Editar</button>}
        <ActionForm label={place.archived ? 'Restaurar' : 'Archivar'} onSubmit={async () => {
          await request('/places/' + place.id + '/archive', 'PATCH', { archived: !place.archived })
          if (selected?.id === place.id) setSelected(null)
          places.reload()
        }} />
      </li>)}</ul>
      <div className="actions">
        {page > 0 && <button onClick={() => setPage(page - 1)}>Anterior</button>}
        {items.length === 50 && page < 200 && <button onClick={() => setPage(page + 1)}>Siguiente</button>}
      </div>
    </>}</Resource>
  </section>
}
