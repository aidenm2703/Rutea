import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createExchangeService } from '../src/services/exchange.js'
import { createChatProvider } from '../src/services/agents/index.js'
import { createMailer } from '../src/services/mail.js'

test('a failed rate refresh preserves the dated cached rate and suppresses immediate retries', async () => {
  const cached = { source: 'ExchangeRate-API', kind: 'market', observed_on: '2023-12-31',
    rate: 520, fetched_at: '2024-01-01T00:00:00Z' }
  const events = []
  let calls = 0
  const service = createExchangeService({
    rate: async (source) => source === cached.source ? cached : undefined,
    saveRates: async () => assert.fail('Do not save an invalid rate'),
    event: async (event) => events.push(event),
  }, {
    fetcher: async (url, { signal }) => {
      calls += 1
      assert.equal(url, 'https://open.er-api.com/v6/latest/USD')
      assert.ok(signal instanceof AbortSignal)
      throw new DOMException('Timeout', 'TimeoutError')
    },
  })
  assert.deepEqual(await service.latest(), { ...cached, fallback: true })
  assert.deepEqual(await service.latest(), { ...cached, fallback: true })
  assert.equal(calls, 1)
  assert.deepEqual(events, ['exchange.failure.ExchangeRate-API'])
})

test('BCCR refresh requests both indicators and saves both results together', async () => {
  let saved
  const requested = []
  const service = createExchangeService({
    rate: async (source, kind) => saved.find((row) => row.kind === kind),
    saveRates: async (source, rates) => {
      assert.equal(source, 'BCCR')
      saved = rates
    },
    async event() {},
  }, {
    bccr: { name: 'Fixture', email: 'fixture@example.test', token: 'fixture' },
    fetcher: async (url, { method, body, signal }) => {
      assert.ok(url.startsWith('https://gee.bccr.fi.cr/'))
      assert.equal(method, 'POST')
      assert.ok(signal instanceof AbortSignal)
      const indicator = body.get('Indicador')
      requested.push(indicator)
      assert.match(body.get('FechaInicio'), /^\d{2}\/\d{2}\/\d{4}$/)
      return new Response(`<DES_FECHA>2026-11-19T00:00:00</DES_FECHA><NUM_VALOR>${indicator === '317' ? 500 : 510}</NUM_VALOR>`)
    },
  })
  const { buy, sell } = await service.refreshBank()
  assert.deepEqual(requested.sort(), ['317','318'])
  assert.equal(buy.rate, 500)
  assert.equal(sell.rate, 510)
})

test('an invalid or failed AI response becomes a controlled service error', async () => {
  for (const fetcher of [
    async () => Response.json({ choices: [{ message: { content: [] } }] }),
    async () => new Response('', { status: 429 }),
    async () => { throw new DOMException('Timeout', 'TimeoutError') },
  ]) {
    const chat = createChatProvider({ url: 'https://example.test/chat', key: 'fixture', model: 'test', fetcher })
    await assert.rejects(chat('Task', 'Data'), { status: 503 })
  }
})

test('mail retries use the same idempotency key and payload', async () => {
  const deliveries = []
  const mail = createMailer({
    key: 'fixture', from: 'Rutea <fixture@example.test>',
    fetcher: async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails')
      deliveries.push([options.headers['Idempotency-Key'], options.body])
      return new Response('', { status: deliveries.length === 1 ? 503 : 200 })
    },
  })
  const job = { id: 'test-id', kind: 'deletion', recipient: 'recipient@example.test' }
  await assert.rejects(mail(job), { status: 503 })
  await mail(job)
  assert.deepEqual(deliveries[0], deliveries[1])
})
