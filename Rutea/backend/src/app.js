import express from 'express'
import { handleError, HttpError } from './middlewares/errors.js'
import { createAuthRouter } from './routes/auth.js'
import { createIntegrationRouter } from './routes/integrations.js'
import { createProfileRouter } from './routes/profiles.js'
import { createTravelRouter } from './routes/travel.js'

export function createApp(authService, { travel, profiles, agents, exchange, integrations } = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use(express.json({ limit: '16kb' }))
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
  app.use('/api/auth', createAuthRouter(authService))
  if (travel) app.use('/api', createTravelRouter(authService, travel))
  if (profiles) app.use('/api', createProfileRouter(authService, profiles))
  if (integrations) app.use('/api', createIntegrationRouter(authService, profiles, agents, exchange, integrations))
  app.use((req, res, next) => next(new HttpError(404, 'Ruta no encontrada.')))
  app.use(handleError)
  return app
}
