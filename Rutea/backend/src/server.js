import { createApp } from './app.js'
import { createPool } from './config/database.js'
import { createAccountModel } from './models/accounts.js'
import { createAuthService } from './services/auth.js'
import { createTravelModel } from './models/travel.js'
import { createProfileModel } from './models/profiles.js'
import { createIntegrationModel } from './models/integrations.js'
import { createTravelService } from './services/travel.js'
import { createProfileService } from './services/profiles.js'
import { createOutboxCrypto } from './services/outbox-crypto.js'
import { createExchangeService } from './services/exchange.js'
import { createAgentService, createChatProvider } from './services/agents/index.js'

const {
  DATABASE_URL, JWT_SECRET, PORT = '3000', APP_ORIGIN, WORKFLOW_SECRET, OUTBOX_SECRET,
  BCCR_NAME, BCCR_EMAIL, BCCR_TOKEN, AI_CHAT_URL, AI_API_KEY, AI_MODEL,
} = process.env
if (!DATABASE_URL || Buffer.byteLength(JWT_SECRET ?? '') < 32) {
  throw new Error('Configura DATABASE_URL y JWT_SECRET (mínimo 32 bytes).')
}

const pool = createPool(DATABASE_URL)
pool.on('error', (error) => console.error('Error de conexión PostgreSQL', error.code ?? error.name))
if (WORKFLOW_SECRET && Buffer.byteLength(WORKFLOW_SECRET) < 32) throw new Error('WORKFLOW_SECRET requiere 32 bytes.')
if (OUTBOX_SECRET && Buffer.byteLength(OUTBOX_SECRET) < 32) throw new Error('OUTBOX_SECRET requiere 32 bytes.')
if (APP_ORIGIN && !['https:', 'http:'].includes(new URL(APP_ORIGIN).protocol)) throw new Error('APP_ORIGIN inválido.')
if (AI_CHAT_URL && new URL(AI_CHAT_URL).protocol !== 'https:') throw new Error('AI_CHAT_URL requiere HTTPS.')

const profiles = createProfileService(createProfileModel(pool), {
  appOrigin: APP_ORIGIN,
  workflowSecret: WORKFLOW_SECRET,
  mailKey: OUTBOX_SECRET ? createOutboxCrypto(OUTBOX_SECRET) : undefined,
})
const travel = createTravelService(createTravelModel(pool))
const integrations = createIntegrationModel(pool)
const exchange = createExchangeService(integrations, { bccr: { name: BCCR_NAME, email: BCCR_EMAIL, token: BCCR_TOKEN } })
const agents = createAgentService(integrations, travel, exchange, createChatProvider({
  url: AI_CHAT_URL, key: AI_API_KEY, model: AI_MODEL,
}))
const auth = createAuthService(createAccountModel(pool, Boolean(WORKFLOW_SECRET)), JWT_SECRET)
const app = createApp(auth, { travel, profiles, exchange, agents, integrations })
app.listen(Number(PORT), () => console.log(`Rutea API escucha en el puerto ${PORT}`))
