BEGIN;
ALTER TABLE users ADD COLUMN display_name text;
ALTER TABLE users ADD COLUMN credential_version integer NOT NULL DEFAULT 1;
ALTER TABLE sessions ADD COLUMN credential_version integer NOT NULL DEFAULT 1;

CREATE TABLE password_resets (
  user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE,
  digest text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL
);

CREATE TABLE deletion_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notification_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('welcome','reset','deletion')),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  recipient text NOT NULL,
  payload text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  attempt_id uuid,
  leased_until timestamptz,
  CHECK ((kind='deletion' AND user_id IS NULL) OR (kind<>'deletion' AND user_id IS NOT NULL))
);
CREATE INDEX outbox_queue ON notification_outbox(kind, created_at);

COMMIT;
