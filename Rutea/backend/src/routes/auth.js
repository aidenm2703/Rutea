import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { createAuthController } from '../controllers/auth.js'
import { requireRole, requireSession } from '../middlewares/auth.js'

export function createAuthRouter(service) {
  const router = Router()
  const controller = createAuthController(service)
  const authenticated = requireSession(service)
  const limit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
    message: { error: 'Demasiados intentos. Inténtalo más tarde.' },
  })

  router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  router.get('/policies', controller.policies)
  router.post('/register', limit, controller.register)
  router.post('/login', limit, controller.login)
  router.get('/me', authenticated, controller.me)
  router.post('/logout', authenticated, controller.logout)
  router.get('/traveler', authenticated, requireRole('traveler'), (req, res) => {
    res.json({ title: 'Panel de viajero' })
  })
  return router
}
