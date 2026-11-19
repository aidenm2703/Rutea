import { HttpError } from './errors.js'

export function validateCredentials(body, registration = false) {
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = body?.password
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'Ingresa un correo válido.')
  }
  if (typeof password !== 'string' || Buffer.byteLength(password) > 72 ||
      password.length < (registration ? 12 : 1)) {
    throw new HttpError(400, 'Ingresa una contraseña válida. Para registrarte usa al menos 12 caracteres y hasta 72 bytes.')
  }
  if (!registration) return { email, password }
  if (body.acceptedPolicies !== true || typeof body.policyVersion !== 'string') {
    throw new HttpError(400, 'Debes aceptar los términos y la política de privacidad.')
  }
  return { email, password, policyVersion: body.policyVersion }
}
