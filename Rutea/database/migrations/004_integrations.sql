BEGIN;

CREATE TABLE exchange_rates (
  source text NOT NULL,
  observed_on date NOT NULL,
  kind text NOT NULL CHECK (kind IN ('market','buy','sell')),
  rate numeric(14,6) NOT NULL CHECK (rate > 0),
  fetched_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source,observed_on,kind)
);

CREATE TABLE ai_agent_runs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES users ON DELETE SET NULL,
  agent text NOT NULL,
  status text NOT NULL CHECK (status IN ('success','failure')),
  duration_ms integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMIT;
