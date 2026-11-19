export function createAccountModel(pool, welcomeEnabled = false) {
  return {
    async register(email, passwordHash, policyVersion) {
      const { rows } = await pool.query(`
        WITH account AS (
          INSERT INTO users (email, password_hash, role_id)
          VALUES ($1, $2, (SELECT id FROM roles WHERE code = 'traveler'))
          ON CONFLICT (email) DO NOTHING
          RETURNING id, email
        )${welcomeEnabled ? `, notice AS (
          INSERT INTO notification_outbox(kind,user_id,recipient)
          SELECT 'welcome',id,email FROM account
        )` : ''}
        INSERT INTO policy_acceptances (user_id, policy_version)
        SELECT id, $3 FROM account
        RETURNING user_id AS id
      `, [email, passwordHash, policyVersion])
      return rows[0]
    },
    async findByEmail(email) {
      const { rows } = await pool.query(`
        SELECT users.id, email, password_hash, credential_version, roles.code AS role
        FROM users JOIN roles ON roles.id = users.role_id WHERE email = $1
      `, [email])
      return rows[0]
    },
    async createSession(id, userId, expiresAt, credentialVersion) {
      const { rowCount, affectedRows } = await pool.query(`INSERT INTO sessions (id,user_id,expires_at,credential_version)
        SELECT $1,id,$3,credential_version FROM users WHERE id=$2 AND credential_version=$4`,
      [id, userId, expiresAt, credentialVersion])
      return (rowCount ?? affectedRows) > 0
    },
    async findSession(id, userId) {
      const { rows } = await pool.query(`
        SELECT users.id, email, roles.code AS role
        FROM sessions JOIN users ON users.id = sessions.user_id
        JOIN roles ON roles.id = users.role_id
        WHERE sessions.id = $1 AND users.id = $2 AND sessions.expires_at > now()
          AND sessions.credential_version=users.credential_version
      `, [id, userId])
      return rows[0]
    },
    async deleteSession(id) {
      await pool.query('DELETE FROM sessions WHERE id = $1', [id])
    },
  }
}
