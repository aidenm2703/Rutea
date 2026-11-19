export function createIntegrationModel(db) {
  return {
    async rate(source, kind) {
      const { rows } = await db.query(`SELECT source,kind,observed_on::text,rate::float8,fetched_at
        FROM exchange_rates WHERE source=$1 AND kind=$2 ORDER BY observed_on DESC LIMIT 1`, [source,kind])
      return rows[0]
    },
    async saveRates(source, rates) {
      await db.query(`INSERT INTO exchange_rates(source,observed_on,kind,rate)
        SELECT $1, observed_on,kind,rate FROM jsonb_to_recordset($2::jsonb) AS
        x(observed_on date,kind text,rate numeric)
        ON CONFLICT (source,observed_on,kind)
        DO UPDATE SET rate=excluded.rate,fetched_at=now()`, [source, JSON.stringify(rates)])
    },
    async event(action) {
      await db.query('INSERT INTO activity_log(action) VALUES ($1)', [action])
    },
    async agentRun(user, agent, status, duration) {
      await db.query('INSERT INTO ai_agent_runs(user_id,agent,status,duration_ms) VALUES ($1,$2,$3,$4)',
        [user,agent,status,duration])
    },
    async agentRuns() {
      const { rows } = await db.query(`SELECT id,user_id,agent,status,duration_ms,created_at FROM ai_agent_runs
        ORDER BY id DESC LIMIT 100`)
      return rows
    },
  }
}
