import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireRole, requireSession } from '../middlewares/auth.js'
import { createProfileController } from '../controllers/profiles.js'

export function createProfileRouter(auth, service) {
  const route = Router()
  const session = requireSession(auth)
  const c = createProfileController(service)
  const limit = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 10,
    message: { error: 'Demasiadas solicitudes. Inténtalo más tarde.' },
  })
  const internal = (req, res, next) => {
    service.authorizeWorkflow(req.get('X-Workflow-Secret'))
    next()
  }
  route.get('/profile', session, c.get)
  route.patch('/profile', session, c.update)
  route.post('/profile/deletion', limit, session, c.erase)
  route.post('/password/recovery', limit, c.resetRequest)
  route.post('/password/reset', limit, c.reset)
  route.get('/audit', session, requireRole('auditor','admin'), c.audit)
  route.post('/internal/outbox/:kind/claim', internal, c.claim)
  route.post('/internal/outbox/:id/delivered', internal, c.delivered)
  return route
}
