import { createApp } from '../app.js'
import { createAccountModel } from '../models/accounts.js'
import { createTravelModel } from '../models/travel.js'
import { createProfileModel } from '../models/profiles.js'
import { createIntegrationModel } from '../models/integrations.js'
import { createAuthService } from '../services/auth.js'
import { createTravelService } from '../services/travel.js'
import { createProfileService } from '../services/profiles.js'
import { createOutboxCrypto } from '../services/outbox-crypto.js'
import { createExchangeService } from '../services/exchange.js'
import { createAgentService, createChatProvider } from '../services/agents/index.js'
import { createMailer, createWelcomeHook } from '../services/mail.js'
import { createWeatherService } from '../services/weather.js'

export function createRuntime(db, env) {
  const {
    JWT_SECRET, APP_ORIGIN, WORKFLOW_SECRET, OUTBOX_SECRET, BCCR_NAME, BCCR_EMAIL, BCCR_TOKEN,
    AI_CHAT_URL, AI_API_KEY, AI_MODEL, RESEND_API_KEY, MAIL_FROM, N8N_WELCOME_WEBHOOK,
  } = env
  if (Buffer.byteLength(JWT_SECRET ?? '') < 32) throw new Error('JWT_SECRET requiere al menos 32 bytes.')
  if (WORKFLOW_SECRET && Buffer.byteLength(WORKFLOW_SECRET) < 32) throw new Error('WORKFLOW_SECRET requiere al menos 32 bytes.')
  if (OUTBOX_SECRET && Buffer.byteLength(OUTBOX_SECRET) < 32) throw new Error('OUTBOX_SECRET requiere al menos 32 bytes.')
  if (APP_ORIGIN && !['https:', 'http:'].includes(new URL(APP_ORIGIN).protocol)) throw new Error('APP_ORIGIN inválido.')
  if (AI_CHAT_URL && new URL(AI_CHAT_URL).protocol !== 'https:') throw new Error('AI_CHAT_URL requiere HTTPS.')
  if (N8N_WELCOME_WEBHOOK && !['https:', 'http:'].includes(new URL(N8N_WELCOME_WEBHOOK).protocol)) {
    throw new Error('N8N_WELCOME_WEBHOOK inválido.')
  }

  const sendMail = createMailer({ key: RESEND_API_KEY, from: MAIL_FROM })
  const profiles = createProfileService(createProfileModel(db), {
    appOrigin: APP_ORIGIN,
    workflowSecret: WORKFLOW_SECRET,
    mailKey: OUTBOX_SECRET ? createOutboxCrypto(OUTBOX_SECRET) : undefined,
    sendMail,
  })
  const travel = createTravelService(createTravelModel(db))
  const integrations = createIntegrationModel(db)
  const exchange = createExchangeService(integrations, { bccr: { name: BCCR_NAME, email: BCCR_EMAIL, token: BCCR_TOKEN } })
  const agents = createAgentService(integrations, travel, exchange, createChatProvider({
    url: AI_CHAT_URL, key: AI_API_KEY, model: AI_MODEL,
  }), createWeatherService())
  const welcomeHook = sendMail && createWelcomeHook({
    url: N8N_WELCOME_WEBHOOK, secret: WORKFLOW_SECRET, onFailure: integrations.event,
  })
  const auth = createAuthService(createAccountModel(db, Boolean(WORKFLOW_SECRET && sendMail)), JWT_SECRET, welcomeHook)
  return createApp(auth, { travel, profiles, exchange, agents, integrations })
}
