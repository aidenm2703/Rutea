import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { HttpError } from '../middlewares/errors.js'
import { policies } from './policies.js'

const sessionSeconds = 3600
const issuer = 'rutea'
const audience = 'rutea-api'
const dummyHash = bcrypt.hashSync(randomUUID(), 12)

export function createAuthService(accounts, secret, welcomeHook) {
  return {
    async register({ email, password, policyVersion }) {
      if (policyVersion !== policies.version) {
        throw new HttpError(409, 'Las políticas cambiaron. Actualiza la página y revisa la versión vigente.')
      }
      const passwordHash = await bcrypt.hash(password, 12)
      const user = await accounts.register(email, passwordHash, policyVersion)
      if (!user) throw new HttpError(409, 'Ese correo ya está registrado.')
      welcomeHook?.().catch(() => console.error('No se pudo registrar el error del webhook de bienvenida'))
    },
    async login({ email, password }) {
      const user = await accounts.findByEmail(email)
      const valid = await bcrypt.compare(password, user?.password_hash ?? dummyHash)
      if (!user || !valid) throw new HttpError(401, 'Correo o contraseña incorrectos.')
      const sessionId = randomUUID()
      const expiresAt = new Date(Date.now() + sessionSeconds * 1000)
      const token = jwt.sign({}, secret, {
        algorithm: 'HS256', issuer, audience, subject: user.id,
        jwtid: sessionId, expiresIn: sessionSeconds,
      })
      await accounts.createSession(sessionId, user.id, expiresAt)
      return { token, expiresAt, user: { id: user.id, email: user.email, role: user.role } }
    },
    async authenticate(token) {
      let claims
      try {
        claims = jwt.verify(token, secret, { algorithms: ['HS256'], issuer, audience })
      } catch {
        throw new HttpError(401, 'La sesión expiró o no es válida.')
      }
      const user = await accounts.findSession(claims.jti, claims.sub)
      if (!user) throw new HttpError(401, 'La sesión expiró o no es válida.')