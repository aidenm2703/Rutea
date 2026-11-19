export async function api(path, { body, token, method = 'GET', signal } = {}) {
  const headers = { Accept: 'application/json' }
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`/api${path}`, {
      method, headers, signal, body: body && JSON.stringify(body),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('No pudimos conectar con Rutea. Inténtalo de nuevo.', { cause: error })
  }

  if (response.status === 204) return
  const data = await response.json().catch(() => null)
  if (!response.ok || !data) {
    const error = new Error(data?.error ?? 'El servicio no está disponible.')
    error.status = response.status
    throw error
  }
  return data
}

