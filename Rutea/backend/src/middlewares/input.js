import { HttpError } from './errors.js'

function invalid(label) {
  throw new HttpError(400, `Revisa el campo ${label}.`)
}

export function string(value, label, max, min = 1) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) invalid(label)
  return value.trim()
}

export function choice(value, label, values) {
  if (!values.includes(value)) invalid(label)
  return value
}

export function number(value, label, min, max, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max ||
      (integer && !Number.isInteger(value))) invalid(label)
  return value
}

export function uuid(value) {
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value ?? '')) invalid('identificador')
  return value
}

export function date(value) {
  const parsed = new Date(value)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '') || !Number.isFinite(+parsed) ||
      parsed.toISOString().slice(0, 10) !== value || value < '1900-01-01' ||
      value > new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Costa_Rica' }).format(new Date())) invalid('fecha')
  return value
}

export function webUrl(value) {
  const input = string(value, 'fuente', 2048)
  let parsed
  try {
    parsed = new URL(input)
  } catch {
    invalid('fuente')
  }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) invalid('fuente')
  return parsed.href
}
