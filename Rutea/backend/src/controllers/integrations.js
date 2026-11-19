export function createIntegrationController(profiles, agents, exchange, model) {
  return {
    latest: async (req,res) => res.json(await exchange.latest()),
    async refresh(req,res) {
      profiles.authorizeWorkflow(req.get('X-Workflow-Secret'))
      res.json(await exchange.refreshBank())
    },
    agents: (req,res) => res.json(agents.list(req.session.user.role)),
    run: async (req,res) => res.json(await agents.run(req.session.user,req.params.id,req.body)),
    logs: async (req,res) => res.json(await model.agentRuns()),
  }
}
