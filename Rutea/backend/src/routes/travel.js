import { Router } from 'express'
import { requireRole, requireSession } from '../middlewares/auth.js'
import { createTravelController } from '../controllers/travel.js'

export function createTravelRouter(auth, service) {
  const route = Router()
  const c = createTravelController(service)
  const session = requireSession(auth)
  const traveler = [session, requireRole('traveler')]
  const moderator = [session, requireRole('moderator', 'admin')]
  const admin = [session, requireRole('admin')]

  route.get('/catalog/metadata', c.metadata)
  route.get('/places', c.list)
  route.get('/places/:id', c.detail)
  route.get('/favorites', traveler, c.favorites)
  route.put('/favorites/:id', traveler, c.favorite)
  route.delete('/favorites/:id', traveler, c.unfavorite)
  route.post('/places/:id/reviews', traveler, c.review)
  route.post('/places/:id/reports', traveler, c.report)
  route.get('/passport', traveler, c.passport)
  route.post('/passport/:id', traveler, c.visit)
  route.get('/moderation', moderator, c.queue)
  route.patch('/moderation/:id', moderator, c.moderate)
  route.get('/admin/places', admin, c.adminList)
  route.post('/admin/places', admin, c.createPlace)
  route.put('/admin/places/:id', admin, c.updatePlace)
  route.patch('/admin/places/:id/archive', admin, c.archive)
  route.put('/admin/places/:id/accessibility/:feature', admin, c.evidence)
  route.put('/admin/badges', admin, c.badge)
  route.put('/admin/categories', admin, c.category)
  return route
}
