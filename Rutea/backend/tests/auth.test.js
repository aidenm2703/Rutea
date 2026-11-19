import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test } from 'node:test'
import jwt from 'jsonwebtoken'
import { createApp } from '../src/app.js'
import { validateCredentials } from '../src/middlewares/credentials.js'
import { createAuthService } from '../src/services/auth.js'

const secret = 'test-secret-that-is-at-least-32-bytes'

test('normalizes email and rejects missing acceptance or passwords over the bcrypt limit', () => {
  assert.equal(validateCredentials({ email: ' ALGUIEN@example.test ', password: 'valid password' }).email,
    'alguien@example.test')
  assert.throws(() => validateCredentials({ email: 'alguien@example.test', password: 'valid password' }, true),
    { status: 400 })
  assert.throws(() => validateCredentials({ email: 'alguien@example.test', password: 'é'.repeat(37) }),
    { status: 400 })
})

test('registration, authentication, role checks, expiration and logout through HTTP', async (context) => {
  let account
  const sessions = new Map()
  const model = {
    async register(email, passwordHash, policyVersion) {
      if (account?.email === email) return
      account = { id: 'test-user', email, password_hash: passwordHash, role: 'traveler', policyVersion }
      return { id: account.id }
    },
    async findByEmail(email) {
      return account?.email === email ? account : undefined
    },
    async createSession(id, userId) {
      sessions.set(id, userId)
      return true
    },
    async findSession(id, userId) {
      if (sessions.get(id) !== userId) return
      return { id: account.id, email: account.email, role: account.role }
    },
    async deleteSession(id) {
      sessions.delete(id)
    },
  }
  const server = createApp(createAuthService(model, secret)).listen(0, '127.0.0.1')
  context.after(() => new Promise((resolve) => server.close(resolve)))
  await once(server, 'listening')

  const root = `http://127.0.0.1:${server.address().port}/api/auth`
  const get = (path, token) => fetch(root + path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const post = (path, body, token) => fetch(root + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: JSON.stringify(body),
  })

  const credentials = { email: 'persona@example.test', password: 'una contraseña de prueba' }
  const { version } = await (await get('/policies')).json()
  const accepted = { ...credentials, acceptedPolicies: true, policyVersion: version, role: 'admin' }
  assert.equal((await post('/register', { ...accepted, policyVersion: 'old' })).status, 409)
  assert.equal((await post('/register', accepted)).status, 201)
  assert.match(account.password_hash, /^\$2[aby]\$/)
  assert.equal(account.role, 'traveler')
  assert.equal(account.policyVersion, version)
  assert.equal((await post('/register', accepted)).status, 409)
  assert.equal((await post('/login', { ...credentials, password: 'incorrect' })).status, 401)
  assert.equal((await get('/me')).status, 401)

  const login = await post('/login', credentials)
  assert.equal(login.status, 200)
  const { token, user } = await login.json()
  assert.deepEqual(Object.keys(user).sort(), ['email', 'id', 'role'])
  assert.equal((await get('/traveler', token)).status, 200)
  account.role = 'auditor'
  assert.equal((await get('/traveler', token)).status, 403)
  assert.equal((await (await get('/me', token)).json()).role, 'auditor')

  const expired = jwt.sign({}, secret, {
    issuer: 'rutea', audience: 'rutea-api', subject: user.id,
    jwtid: jwt.decode(token).jti, expiresIn: -1,
  })
  assert.equal((await get('/me', expired)).status, 401)
  assert.equal((await post('/logout', {}, token)).status, 204)
  assert.equal((await get('/me', token)).status, 401)
})
