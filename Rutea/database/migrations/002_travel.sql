BEGIN;

CREATE TABLE provinces (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE
);
INSERT INTO provinces VALUES ('sj','San José'),('al','Alajuela'),('ca','Cartago'),
('he','Heredia'),('gu','Guanacaste'),('pu','Puntarenas'),('li','Limón');

CREATE TABLE categories (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE
);
INSERT INTO categories VALUES ('nature','Naturaleza'),('culture','Cultura'),
('food','Gastronomía'),('beach','Playa');

CREATE TABLE places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  province text NOT NULL REFERENCES provinces(code),
  category text NOT NULL REFERENCES categories(code),
  food text,
  latitude double precision NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude double precision NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  archived boolean NOT NULL DEFAULT false
);

CREATE TABLE place_sources (
  place_id uuid PRIMARY KEY REFERENCES places ON DELETE CASCADE,
  url text NOT NULL,
  checked_on date NOT NULL,
  confidence text NOT NULL CHECK (confidence IN ('confirmed','reported'))
);
CREATE TABLE accessibility_features (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE
);
INSERT INTO accessibility_features VALUES ('entrance','Entrada sin escalones'),
('restroom','Baño accesible'),('parking','Estacionamiento accesible'),
('sensory','Información sensorial');

CREATE TABLE place_accessibility (
  place_id uuid REFERENCES places ON DELETE CASCADE,
  feature text REFERENCES accessibility_features(code),
  status text NOT NULL CHECK (status IN ('confirmed','reported','unavailable')),
  evidence text NOT NULL,
  source_url text NOT NULL,
  checked_on date NOT NULL,
  PRIMARY KEY (place_id, feature)
);

CREATE TABLE favorites (
  user_id uuid REFERENCES users ON DELETE CASCADE,
  place_id uuid REFERENCES places,
  PRIMARY KEY (user_id, place_id)
);

CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  place_id uuid REFERENCES places NOT NULL,
  kind text NOT NULL CHECK (kind IN ('review','report')),
  body text NOT NULL,
  rating smallint,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  moderated_at timestamptz,
  moderator_id uuid REFERENCES users ON DELETE SET NULL,
  CHECK ((kind = 'review' AND rating IS NOT NULL AND rating BETWEEN 1 AND 5)
    OR (kind = 'report' AND rating IS NULL))
);
CREATE INDEX submissions_queue ON submissions(status, created_at);

CREATE TABLE visits (
  user_id uuid REFERENCES users ON DELETE CASCADE,
  place_id uuid REFERENCES places,
  visited_on date NOT NULL,
  PRIMARY KEY (user_id, place_id, visited_on)
);

CREATE TABLE achievement_rules (
  code text PRIMARY KEY,
  name text NOT NULL,
  unique_places integer NOT NULL CHECK (unique_places > 0)
);
INSERT INTO achievement_rules VALUES ('first-route','Primera ruta',1),('explorer','Explorador',3);

CREATE TABLE activity_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid REFERENCES users ON DELETE SET NULL,
  action text NOT NULL,
  target text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMIT;
