export function createProfileController(service) {
  return {
    get: async (req, res) => res.json(await service.get(req.session.user.id)),
    update: async (req, res) => res.json(await service.update(req.session.user.id, req.body)),
    resetRequest: async (req, res) => {
      await service.requestReset(req.body)
      res.status(202).json({ message: 'Si existe una cuenta asociada, se enviará un enlace de recuperación.' })
    },
    reset: async (req, res) => {
      await service.reset(req.body)
      res.sendStatus(204)
    },
    erase: async (req, res) => res.json(await service.erase(req.session.user.id, req.body)),
    audit: async (req, res) => res.json(await service.audit()),
    users: async (req, res) => res.json(await service.users(req.query.page)),
    changeRole: async (req, res) => {
      await service.changeRole(req.session.user.id, req.params.id, req.body?.role)
      res.sendStatus(204)
    },
    process: async (req, res) => res.json(await service.process(req.params.kind)),
  }
}
