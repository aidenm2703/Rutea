import assert from 'node:assert/strict'
import { once } from 'node:events'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { PGlite } from '@electric-sql/pglite'
import { createApp } from '../src/app.js'
import { createAccountModel } from '../src/models/accounts.js'
import { createTravelModel } from '../src/models/travel.js'
import { createProfileModel } from '../src/models/profiles.js'
import { createIntegrationModel } from '../src/models/integrations.js'
import { createAuthService } from '../src/services/auth.js'
import { createTravelService } from '../src/services/travel.js'
import { createProfileService } from '../src/services/profiles.js'
import { createOutboxCrypto } from '../src/services/outbox-crypto.js'
import { createAgentService } from '../src/services/agents/index.js'
import { createExchangeService, parseBccr } from '../src/services/exchange.js'

const password = 'contraseña inicial'
const secret = 'test-secret-that-is-at-least-32-bytes'

test('parses the numeric and dated BCCR fields from its XML envelope', () => {
  assert.deepEqual(parseBccr('<string>&lt;DES_FECHA&gt;2026-11-19T00:00:00-06:00&lt;/DES_FECHA&gt;&lt;NUM_VALOR&gt;503.12&lt;/NUM_VALOR&gt;</string>'),
    { observed_on: '2026-11-19', rate: 503.12 })
  assert.throws(() => parseBccr('<string>Error</string>'))
})

test('travel, private account, audit, outbox and integration flows with PostgreSQL', async (t) => {
  const db = new PGlite()
  t.after(() => db.close())
  for (const filename of ['schema.sql','seed.sql','migrations/002_travel.sql','migrations/003_accounts.sql','migrations/004_integrations.sql']) {
    await db.exec(await readFile(new URL('../../database/' + filename, import.meta.url), 'utf8'))
  }
  const auth = createAuthService(createAccountModel(db, true), secret)
  const travel = createTravelService(createTravelModel(db))
  const profiles = createProfileService(createProfileModel(db), {
    appOrigin: 'https://example.test', workflowSecret: secret, mailKey: createOutboxCrypto(secret),
  })
  const integrations = createIntegrationModel(db)
  const exchange = createExchangeService(integrations, { fetcher: async () =>
    Response.json({ result: 'success', base_code: 'USD', rates: { CRC: 509.3 },
      time_last_update_unix: Math.floor(Date.now() / 1000) }),
  })
  const agents = createAgentService(integrations, travel, exchange, async (task, payload) => {
    assert.ok(task)
    assert.doesNotMatch(payload, /persona@example\.test/)
    return 'Respuesta de prueba del proveedor.'
  })

  const server = createApp(auth, { travel, profiles, agents, exchange, integrations }).listen(0, '127.0.0.1')
  t.after(() => new Promise((resolve) => server.close(resolve)))
  await once(server, 'listening')
  async function request(path, { token, method = 'GET', body, workflow = false, status = 200 } = {}) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api` + path, {
      method, body: body === undefined ? undefined : JSON.stringify(body),
      headers: {
        ...(token && { Authorization: 'Bearer ' + token }),
        ...(workflow && { 'X-Workflow-Secret': secret }),
        'Content-Type': 'application/json',
      },
    })
    const data = response.status === 204 ? undefined : await response.json()
    assert.equal(response.status, status, `${method} ${path}: ${JSON.stringify(data)}`)
    return data
  }

  async function register(name, role = 'traveler') {
    const email = name + '@example.test'
    await request('/auth/register', {
      method: 'POST', status: 201, body: { email, password, acceptedPolicies: true, policyVersion: 'preview-1' },
    })
    if (role !== 'traveler') {
      await db.query('UPDATE users SET role_id=(SELECT id FROM roles WHERE code=$2) WHERE email=$1', [email,role])
    }
    return (await request('/auth/login', { method: 'POST', body: { email, password } })).token
  }

  const admin = await register('admin','admin')
  const traveler = await register('persona')
  const auditor = await register('audit','auditor')
  const moderator = await register('moderator','moderator')
  const fixture = {
    name: 'Lugar de prueba', description: 'Ejemplo cultural para la prueba automatizada.',
    province: 'sj', category: 'culture', food: 'Vegetariana', latitude: 10, longitude: -84,
    url: 'https://example.test/lugar', checkedOn: '2024-01-01', confidence: 'reported',
  }
  await request('/admin/places', { token: traveler, method: 'POST', body: fixture, status: 403 })
  const { id } = await request('/admin/places', { token: admin, method: 'POST', body: fixture, status: 201 })
  const { accessibility } = await request('/places/' + id)
  assert.ok(accessibility.every((feature) => feature.status === 'unknown'))
  await request('/admin/places/' + id + '/accessibility/entrance', {
    token: admin, method: 'PUT', status: 204, body: {
      status: 'confirmed', body: 'Dato de prueba', url: fixture.url, checkedOn: fixture.checkedOn,
    },
  })
  assert.equal((await request('/places?query=Prueba&province=sj&category=culture&food=Vegetariana&feature=entrance'))[0].id, id)
  assert.equal((await request('/places?feature=restroom')).length, 0)
  for (let count = 0; count < 2; count += 1) {
    await request('/favorites/' + id, { token: traveler, method: 'PUT', status: 204 })
    await request('/passport/' + id, { token: traveler, method: 'POST', status: 204, body: { visitedOn: '2024-01-02' } })
  }
  assert.equal((await request('/favorites', { token: traveler })).length, 1)
  await request('/favorites', { token: auditor, status: 403 })
  const passport = await request('/passport', { token: traveler })
  assert.equal(passport.visits.length, 1)
  assert.equal(passport.visits[0].stamp, true)
  assert.equal(passport.badges[0].earned, true)
  const review = await request('/places/' + id + '/reviews', {
    token: traveler, method: 'POST', status: 201, body: { body: 'Reseña de prueba', rating: 4 },
  })
  assert.equal((await request('/places/' + id)).reviews.length, 0)
  await request('/moderation/' + review.id, { token: auditor, method: 'PATCH', body: { status: 'approved' }, status: 403 })
  await request('/moderation/' + review.id, { token: moderator, method: 'PATCH', body: { status: 'approved' }, status: 204 })
  assert.equal((await request('/places/' + id)).reviews.length, 1)

  const body = { text: 'Consulta de persona@example.test', query: 'prueba', authorized: true }
  await request('/agents/moderation', { token: traveler, method: 'POST', body, status: 403 })
  const output = await request('/agents/culture', { token: traveler, method: 'POST', body })
  assert.deepEqual(output.sources, [fixture.url])
  assert.equal((await request('/audit/agents', { token: auditor }))[0].status, 'success')
  assert.equal((await request('/exchange')).rate, 509.3)
  await request('/audit', { token: traveler, status: 403 })
  assert.ok((await request('/audit', { token: auditor })).events.length)

  await request('/profile', { token: traveler, method: 'PATCH', body: { displayName: 'Nombre de prueba' } })
  assert.equal((await request('/profile', { token: traveler })).display_name, 'Nombre de prueba')
  const recovery = { method: 'POST', status: 202 }
  const known = await request('/password/recovery', { ...recovery, body: { email: 'persona@example.test' } })
  const unknown = await request('/password/recovery', { ...recovery, body: { email: 'unknown@example.test' } })
  assert.deepEqual(known, unknown)
  await request('/internal/outbox/reset/claim', { method: 'POST', status: 403 })
  const reset = await request('/internal/outbox/reset/claim', { method: 'POST', workflow: true })
  const resetToken = new URL(reset.payload).hash.slice(7)
  const newPassword = 'contraseña renovada'
  await request('/password/reset', { method: 'POST', status: 204, body: { token: resetToken, password: newPassword } })
  await request('/password/reset', { method: 'POST', status: 400, body: { token: resetToken, password: newPassword } })
  await request('/profile', { token: traveler, status: 401 })
  const renewed = await request('/auth/login', { method: 'POST', body: { email: 'persona@example.test', password: newPassword } })
  await request('/profile/deletion', { token: renewed.token, method: 'POST', body: { confirm: 'ELIMINAR', password }, status: 403 })
  await request('/profile/deletion', { token: renewed.token, method: 'POST', body: { confirm: 'ELIMINAR', password: newPassword } })
  await request('/profile', { token: renewed.token, status: 401 })
  assert.equal((await request('/places/' + id)).reviews.length, 0)
  const deletion = await request('/internal/outbox/deletion/claim', { method: 'POST', workflow: true })
  assert.equal(deletion.recipient, 'persona@example.test')
  await request('/internal/outbox/' + deletion.id + '/delivered', {
    method: 'POST', workflow: true, status: 204, body: { attemptId: deletion.attempt_id },
  })
  assert.deepEqual(await request('/internal/outbox/deletion/claim', { method: 'POST', workflow: true }), {})
})
