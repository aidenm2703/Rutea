import { choice, date, number, string, uuid, webUrl } from '../middlewares/input.js'
import { HttpError } from '../middlewares/errors.js'

function found(value, message = 'El lugar ya no está disponible.') {
  if (!value) throw new HttpError(404, message)
  return value
}

function key(value) {
  const code = string(value, 'código', 32)
  if (!/^[a-z][a-z0-9-]*$/.test(code)) throw new HttpError(400, 'Usa letras minúsculas, números o guiones para el código.')
  return code
}

function filters(input, includeArchived) {
  const data = { includeArchived }
  for (const field of ['query', 'province', 'category', 'food', 'feature']) {
    data[field] = input[field] === undefined ? '' : string(input[field], field, 120, 0)
  }
  data.page = number(Number(input.page ?? 0), 'página', 0, 200, true)
  return data
}

export function createTravelService(model) {
  return {
    metadata: model.metadata,
    list: (query, archived = false) => model.list(filters(query, archived)),
    async detail(id) { return found(await model.detail(uuid(id))) },
    favorites: model.favorites,
    async favorite(user, id) {
      await this.detail(id)
      await model.favorite(user, id)
    },
    unfavorite: (user, id) => model.unfavorite(user, uuid(id)),
    async submit(user, id, kind, input) {
      const body = string(input?.body, 'comentario', 2000, 5)
      const rating = kind === 'review' ? number(input?.rating, 'calificación', 1, 5, true) : null
      return found(await model.submit(user, uuid(id), kind, body, rating))
    },
    queue: model.queue,
    async moderate(user, id, status) {
      return found(await model.moderate(user, uuid(id), choice(status, 'decisión', ['approved','rejected'])),
        'La solicitud ya se resolvió o no existe.')
    },
    passport: model.passport,
    async visit(user, id, day) {
      const validDay = date(day)
      await this.detail(id)
      await model.visit(user, id, validDay)
    },
    async savePlace(user, id, data) {
      if (id) await this.detail(id)
      return model.savePlace(user, id, {
        name: string(data?.name, 'nombre', 160),
        description: string(data?.description, 'descripción', 4000),
        province: key(data?.province), category: key(data?.category),
        food: data?.food ? string(data.food, 'alimentación', 500) : null,
        latitude: number(data?.latitude, 'latitud', -90, 90),
        longitude: number(data?.longitude, 'longitud', -180, 180),
        url: webUrl(data?.url), checkedOn: date(data?.checkedOn),
        confidence: choice(data?.confidence, 'confianza', ['confirmed','reported']),
      })
    },
    async archive(user, id, archived) {
      return found(await model.archive(user, uuid(id), choice(archived, 'archivo', [true,false])))
    },
    async evidence(user, id, feature, data) {
      return found(await model.saveEvidence(user, uuid(id), key(feature), {
        status: choice(data?.status, 'estado', ['confirmed','reported','unavailable']),
        body: string(data?.body, 'evidencia', 2000),
        url: webUrl(data?.url), checkedOn: date(data?.checkedOn),
      }))
    },
    saveRule: (user, data) => model.saveRule(user, {
      code: key(data?.code), name: string(data?.name, 'nombre', 120),
      uniquePlaces: number(data?.uniquePlaces, 'lugares', 1, 10000, true),
    }),
    saveCategory: (user, data) => model.saveCategory(user, key(data?.code), string(data?.name, 'nombre', 120)),
  }
}
