import { HttpError } from '../middlewares/errors.js'

const messages = {
  welcome: ['Bienvenido a Rutea', 'Explora el catálogo, guarda lugares y registra tus visitas desde el pasaporte.'],
  reset: ['Recupera tu acceso a Rutea', 'Abre el siguiente enlace en los próximos 30 minutos:'],
  deletion: ['Confirmación de baja de Rutea', 'La cuenta y sus datos asociados fueron eliminados.'],
}

export function createMailer({ key, from, fetcher = fetch }) {
  if (!key || !from) return
  return async (job) => {
    const [subject, message] = messages[job.kind]
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'rutea/' + job.id,
      },
      body: JSON.stringify({ from, to: [job.recipient], subject, text: job.payload ? message + '\n\n' + job.payload : message }),
    })
    if (!response.ok) throw new HttpError(503, 'El proveedor de correo no aceptó el mensaje.')
  }
}

export function createWelcomeHook({ url, secret, onFailure, fetcher = fetch }) {
  if (!url || !secret) return
  return async () => {
    try {
      const response = await fetcher(url, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(4000),
        headers: { 'X-Workflow-Secret': secret },
      })
      if (!response.ok) throw new Error('Webhook error')
    } catch {
      await onFailure('onboarding.webhook_failure')
    }
  }
}
