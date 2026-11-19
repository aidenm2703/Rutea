import { validateCredentials } from '../middlewares/credentials.js'
import { policies } from '../services/policies.js'

export function createAuthController(service) {
  return {
    policies: (req, res) => res.json(policies),
    async register(req, res) {
      await service.register(validateCredentials(req.body, true))
      res.status(201).json({ message: 'Cuenta creada. Ya puedes iniciar sesión.' })
    },
    async login(req, res) {
      res.json(await service.login(validateCredentials(req.body)))
    },
    me(req, res) {
      res.json(req.session.user)
    },
    async logout(req, res) {
      await service.logout(req.session.sessionId)
      res.sendStatus(204)
    },
  }
}
