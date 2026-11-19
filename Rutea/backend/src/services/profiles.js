import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { HttpError } from '../middlewares/errors.js'
import { choice, string, uuid } from '../middlewares/input.js'

const digest = (token) => createHash('sha256').update(token).digest('hex')

export function createProfileService(model, { appOrigin, workflowSecret, mailKey } = {}) {
  return {
    get: model.get,
    update: (id, body) => model.update(id, string(body?.displayName, 'nombre', 100)),
    async requestReset(body) {
      const email = string(body?.email, 'correo', 254).toLowerCase()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Ingresa un correo válido.')
      if (!appOrigin || !workflowSecret || !mailKey) throw new HttpError(503, 'La recuperación de acceso no está disponible.')
      const token = randomBytes(32).toString('hex')
      const link = new URL('/#reset=' + token, appOrigin)
      await model.createReset(email, digest(token), mailKey.seal(link.href))
    },
    async reset(body) {
      const token = string(body?.token, 'enlace de recuperación', 64, 64)
      if (!/^[a-f0-9]{64}$/.test(token)) throw new HttpError(400, 'Enlace de recuperación inválido.')
      const password = body.password
      if (typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password) > 72) {
        throw new HttpError(400, 'Usa al menos 12 caracteres y hasta 72 bytes.')
      }
      const updated = await model.reset(digest(token), await bcrypt.hash(password, 12))
      if (!updated) throw new HttpError(400, 'El enlace de recuperación ya no es válido.')
    },
    async erase(id, body) {
      const password = body?.password
      if (typeof password !== 'string' || !password || Buffer.byteLength(password) > 72 ||
          body?.confirm !== 'ELIMINAR') throw new HttpError(400, 'Confirma la baja con tu contraseña y la palabra ELIMINAR.')
      if (!workflowSecret) throw new HttpError(503, 'La baja no está disponible mientras se configura el servicio de notificaciones.')
      const account = await model.credentials(id)
      if (!account || !await bcrypt.compare(password, account.password_hash)) throw new HttpError(403, 'La contraseña no coincide.')
      const record = await model.erase(id, account.password_hash)
      if (!record) throw new HttpError(409, 'La cuenta cambió. Vuelve a confirmar tu identidad.')
      return record
    },
    async audit() {
      const [events, acceptances, deletions] = await Promise.all([model.log(), model.acceptances(), model.deletions()])
      return { events, acceptances, deletions }
    },
    authorizeWorkflow(raw) {
      const provided = Buffer.from(raw ?? '')
      const expected = Buffer.from(workflowSecret ?? '')
      if (!expected.length || provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
        throw new HttpError(403, 'Automatización no autorizada.')
      }
    },
    async claim(kind) {
      const job = await model.claim(choice(kind, 'proceso', ['welcome','reset','deletion']), randomUUID())
      if (!job) return null
      return { ...job, payload: job.payload ? mailKey.open(job.payload) : null }
    },
    delivered: (id, body) => model.delivered(uuid(id), uuid(body?.attemptId)),
  }
}
