export function createProfileModel(db) {
  const rows = async (sql, args = []) => (await db.query(sql, args)).rows
  const one = async (sql, args) => (await rows(sql, args))[0]

  return {
    get: (id) => one(`SELECT id,email,display_name,created_at,
      (SELECT coalesce(json_agg(json_build_object('version',policy_version,'acceptedAt',accepted_at)
        ORDER BY accepted_at DESC),'[]') FROM policy_acceptances WHERE user_id=users.id) AS policies
      FROM users WHERE id=$1`, [id]),
    update: (id, name) => one('UPDATE users SET display_name=$2 WHERE id=$1 RETURNING id,email,display_name', [id,name]),
    credentials: (id) => one('SELECT password_hash FROM users WHERE id=$1', [id]),
    async createReset(email, digest, message) {
      await rows(`WITH reset AS (
        INSERT INTO password_resets (user_id,digest,expires_at)
        SELECT id,$2,now()+interval '30 minutes' FROM users WHERE email=$1
        ON CONFLICT (user_id) DO UPDATE SET digest=excluded.digest,expires_at=excluded.expires_at
        RETURNING user_id
      ), expire AS (
        UPDATE notification_outbox SET expires_at=now()
        WHERE kind='reset' AND user_id IN (SELECT user_id FROM reset)
      ) INSERT INTO notification_outbox(kind,user_id,recipient,payload,expires_at)
        SELECT 'reset',reset.user_id,users.email,$3,now()+interval '30 minutes'
        FROM reset JOIN users ON users.id=reset.user_id`, [email,digest,message])
    },
    reset: (digest, hash) => one(`WITH consumed AS (
      DELETE FROM password_resets WHERE digest=$1 AND expires_at>now() RETURNING user_id
    ), changed AS (
      UPDATE users SET password_hash=$2 FROM consumed WHERE id=consumed.user_id RETURNING id
    ), revoked AS (
      DELETE FROM sessions WHERE user_id IN (SELECT id FROM changed)
    ) SELECT id FROM changed`, [digest,hash]),
    erase: (id, hash) => one(`WITH erased AS (
      DELETE FROM users WHERE id=$1 AND password_hash=$2 RETURNING email
    ), notice AS (
      INSERT INTO notification_outbox(kind,recipient) SELECT 'deletion',email FROM erased
    ) INSERT INTO deletion_records(completed_at) SELECT now() FROM erased RETURNING id`, [id,hash]),
    log: () => rows('SELECT id,action,target,created_at FROM activity_log ORDER BY id DESC LIMIT 100'),
    acceptances: () => rows(`SELECT policy_version,accepted_at FROM policy_acceptances
      ORDER BY accepted_at DESC LIMIT 100`),
    deletions: () => rows('SELECT id,completed_at FROM deletion_records ORDER BY completed_at DESC LIMIT 100'),
    claim: (kind, attempt) => one(`WITH expired AS (
      DELETE FROM notification_outbox WHERE expires_at<=now()
    ), queued AS (
      SELECT id FROM notification_outbox WHERE kind=$1 AND expires_at>now()
      AND (leased_until IS NULL OR leased_until<=now())
      ORDER BY created_at,id FOR UPDATE SKIP LOCKED LIMIT 1
    ) UPDATE notification_outbox SET attempt_id=$2,leased_until=now()+interval '5 minutes'
      WHERE id=(SELECT id FROM queued) RETURNING id,kind,recipient,payload,attempt_id`, [kind,attempt]),
    delivered: (id, attempt) => one(`WITH sent AS (
      DELETE FROM notification_outbox WHERE id=$1 AND attempt_id=$2 RETURNING kind
    ) INSERT INTO activity_log(action) SELECT 'email.sent.' || kind FROM sent RETURNING id`, [id,attempt]),
  }
}
