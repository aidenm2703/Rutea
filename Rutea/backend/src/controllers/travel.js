const user = (req) => req.session.user.id

export function createTravelController(service) {
  return {
    metadata: async (req, res) => res.json(await service.metadata()),
    list: async (req, res) => res.json(await service.list(req.query)),
    detail: async (req, res) => res.json(await service.detail(req.params.id)),
    favorites: async (req, res) => res.json(await service.favorites(user(req))),
    favorite: async (req, res) => {
      await service.favorite(user(req), req.params.id)
      res.sendStatus(204)
    },
    unfavorite: async (req, res) => {
      await service.unfavorite(user(req), req.params.id)
      res.sendStatus(204)
    },
    review: async (req, res) => res.status(201).json(await service.submit(user(req), req.params.id, 'review', req.body)),
    report: async (req, res) => res.status(201).json(await service.submit(user(req), req.params.id, 'report', req.body)),
    passport: async (req, res) => res.json(await service.passport(user(req))),
    visit: async (req, res) => {
      await service.visit(user(req), req.params.id, req.body?.visitedOn)
      res.sendStatus(204)
    },
    queue: async (req, res) => res.json(await service.queue()),
    moderate: async (req, res) => {
      await service.moderate(user(req), req.params.id, req.body?.status)
      res.sendStatus(204)
    },
    adminList: async (req, res) => res.json(await service.list(req.query, true)),
    createPlace: async (req, res) => res.status(201).json(await service.savePlace(user(req), null, req.body)),
    updatePlace: async (req, res) => res.json(await service.savePlace(user(req), req.params.id, req.body)),
    archive: async (req, res) => {
      await service.archive(user(req), req.params.id, req.body?.archived)
      res.sendStatus(204)
    },
    evidence: async (req, res) => {
      await service.evidence(user(req), req.params.id, req.params.feature, req.body)
      res.sendStatus(204)
    },
    badge: async (req, res) => {
      await service.saveRule(user(req), req.body)
      res.sendStatus(204)
    },
    category: async (req, res) => {
      await service.saveCategory(user(req), req.body)
      res.sendStatus(204)
    },
  }
}
