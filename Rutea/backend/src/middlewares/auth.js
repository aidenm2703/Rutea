import { HttpError } from './errors.js'

export function requireSession(service) {
  return async (req, res, next) => {
    const token = /^Bearer (\S+)$/i.exec(req.get('Authorization') ?? '')?.[1]
    if (!token) throw new HttpError(401, 'Inicia sesión para continuar.')
    req.session = await service.authenticate(token)
    next()
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      throw new HttpError(403, 'Tu rol no tiene acceso a esta vista.')
    }
    next()
  }
}
