export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function handleError(error, req, res, next) {
  if (res.headersSent) return next(error)
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message })
  }
  if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') {
    return res.status(error.status).json({ error: 'El cuerpo de la solicitud no es válido o excede el límite.' })
  }
  if (error.code === '23503' || error.code === '23514') {
    return res.status(400).json({ error: 'Alguno de los valores seleccionados no es válido.' })
  }
  if (error.code === '23505') return res.status(409).json({ error: 'Ya existe un registro con esos datos.' })
  console.error('Error interno', error.code ?? error.name)
  return res.status(500).json({ error: 'No pudimos completar la solicitud.' })
}
