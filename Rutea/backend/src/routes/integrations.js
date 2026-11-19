import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireRole, requireSession } from '../middlewares/auth.js'
import { createIntegrationController } from '../controllers/integrations.js'

export function createIntegrationRouter(auth, profiles, agents, exchange, model) {
  const route = Router()
  const session = requireSession(auth)
  const limit = rateLimit({ windowMs: 60_000, limit: 10, message: { error: 'Espera un momento entre consultas.' } })
  const c = createIntegrationController(profiles, agents, exchange, model)
  route.get('/exchange', c.latest)
  route.post('/internal/exchange/refresh', c.refresh)
  route.get('/agents', session, c.agents)
  route.post('/agents/:id', session, limit, c.run)
  route.get('/audit/agents', session, requireRole('auditor','admin'), c.logs)
  return route
}
