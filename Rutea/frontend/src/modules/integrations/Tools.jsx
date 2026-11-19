import { useState } from 'react'
import { api } from '../../lib/api.js'
import { useResource } from '../../lib/useResource.js'
import { ActionForm, Resource } from '../../components/Request.jsx'

export function Exchange() {
  const rate = useResource('/exchange')
  const format = (value) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(value)
  return <section className="surface"><h1>Tipo de cambio</h1>
    <Resource resource={rate}>{(data) => <>
      <p>1 USD = {format(data.rate)}{data.kind === 'sell' && ' · Venta'}</p>
      <p>Fecha de referencia: {data.observed_on}</p>
      {data.buyRate && <p>Compra: {format(data.buyRate)} · {data.buyDate}</p>}
      {data.fallback && <p role="status">Último dato disponible guardado.</p>}
      <a href={data.source === 'BCCR' ? 'https://www.bccr.fi.cr/' : 'https://www.exchangerate-api.com/'}
        target="_blank" rel="noreferrer">Fuente: {data.source}</a>
    </>}</Resource>
  </section>
}

function AgentForm({ agent, token }) {
  const [answer, setAnswer] = useState(null)
  const places = useResource(agent.context === 'place' ? '/places' : null)
  return <>
    <ActionForm label="Consultar" success="Consulta completada." reset={false} onSubmit={async (body) => {
      setAnswer(null)
      const data = await api('/agents/' + agent.id, { method: 'POST', token, body: { ...body, authorized: body.authorized === 'on' } })
      setAnswer(data)
    }}>
      {agent.context === 'catalog' && <label>Nombre o palabra para buscar en el catálogo <input name="query" maxLength="120" /></label>}
      {agent.context === 'place' && <Resource resource={places}>{(items) => <label>Lugar <select name="placeId" required>
        <option value="">Seleccionar</option>{items.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
      </select></label>}</Resource>}
      <label>{agent.input}<textarea name="text" maxLength="3500" required /></label>
      <label className="checkbox"><input type="checkbox" name="authorized" required /> Autorizo enviar este contenido al proveedor de IA.</label>
    </ActionForm>
    {answer && <div>
      <h2>Respuesta</h2>
      {agent.id === 'journal' ? <label>Borrador editable<textarea defaultValue={answer.answer} /></label> :
        <p className="response">{answer.answer}</p>}
      {answer.sources.length > 0 && <ul>{answer.sources.map((url) => <li key={url}>
        <a href={url} target="_blank" rel="noreferrer">{url}</a>
      </li>)}</ul>}
    </div>}
  </>
}

export function Assistants({ token }) {
  const agents = useResource('/agents', token)
  const [id, setId] = useState('')
  return <section className="surface"><h1>Asistentes Rutea</h1>
    <p>Las respuestas requieren revisión. Envía solo información que puedas compartir.</p>
    <Resource resource={agents}>{(items) => {
      const agent = items.find((item) => item.id === id)
      return <>
        <label>Asistente <select value={id} onChange={(event) => setId(event.target.value)}>
          <option value="">Seleccionar</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select></label>
        {agent && <AgentForm key={agent.id} agent={agent} token={token} />}
      </>
    }}</Resource>
  </section>
}
