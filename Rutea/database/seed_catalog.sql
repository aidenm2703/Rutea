-- Fichas iniciales. Fuentes de cartografía y contexto en docs/catalogo.md.
BEGIN;
INSERT INTO places (id,name,description,province,category,latitude,longitude)
VALUES
  ('c723a77c-fbb2-486a-b38c-9a8d99006f10','Museo Nacional de Costa Rica · Bellavista',
   'En el antiguo Cuartel Bellavista, el museo presenta colecciones de historia, arqueología e historia natural de Costa Rica.',
   'sj','culture',9.93274,-84.07144),
  ('6f90af96-ae57-4858-b706-edd9ed0e5c03','Teatro Nacional de Costa Rica',
   'Teatro de San José que ofrece actividades escénicas y visitas guiadas. Consulta la programación oficial antes de planear tu visita.',
   'sj','culture',9.93316,-84.07697)
ON CONFLICT (id) DO NOTHING;

INSERT INTO place_sources (place_id,url,checked_on,confidence) VALUES
  ('c723a77c-fbb2-486a-b38c-9a8d99006f10','https://www.museocostarica.go.cr/visitar/',DATE '2026-11-19','confirmed'),
  ('6f90af96-ae57-4858-b706-edd9ed0e5c03','https://www.teatronacional.go.cr/Visitenos/planee',DATE '2026-11-19','confirmed')
ON CONFLICT (place_id) DO NOTHING;
COMMIT;
