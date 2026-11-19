const active = 'NOT p.archived'
const fields = 'p.*, provinces.name AS province_name, categories.name AS category_name, s.url, s.checked_on::text, s.confidence'
const entries = `
  FROM places p
  JOIN provinces ON provinces.code=p.province
  JOIN categories ON categories.code=p.category
  JOIN place_sources s ON s.place_id=p.id
`

export function createTravelModel(db) {
  const rows = async (sql, args = []) => (await db.query(sql, args)).rows
  const one = async (sql, args) => (await rows(sql, args))[0]
  return {
    async metadata() {
      const [provinces, categories, features] = await Promise.all([
        rows('SELECT * FROM provinces ORDER BY name'), rows('SELECT * FROM categories ORDER BY name'),
        rows('SELECT * FROM accessibility_features ORDER BY name'),
      ])
      return { provinces, categories, features }
    },
    list: ({ query, province, category, food, feature, page, includeArchived }) => rows(`
      SELECT ${fields} ${entries}
      WHERE (${active} OR $7::boolean)
        AND ($1='' OR strpos(lower(p.name || ' ' || p.description), lower($1))>0)
        AND ($2='' OR p.province=$2) AND ($3='' OR p.category=$3)
        AND ($4='' OR strpos(lower(p.food), lower($4))>0)
        AND ($5='' OR EXISTS (SELECT 1 FROM place_accessibility a
          WHERE a.place_id=p.id AND a.feature=$5 AND a.status='confirmed'))
      ORDER BY p.name, p.id LIMIT 50 OFFSET $6
    `, [query, province, category, food, feature, page * 50, includeArchived]),
    async detail(id) {
      const place = await one(`SELECT ${fields} ${entries} WHERE p.id=$1 AND ${active}`, [id])
      if (!place) return
      const [accessibility, reviews] = await Promise.all([
        rows(`SELECT f.code, f.name, coalesce(a.status,'unknown') AS status, a.evidence, a.source_url, a.checked_on::text
          FROM accessibility_features f LEFT JOIN place_accessibility a ON a.feature=f.code AND a.place_id=$1
          ORDER BY f.name`, [id]),
        rows(`SELECT id, body, rating, created_at FROM submissions
          WHERE place_id=$1 AND kind='review' AND status='approved' ORDER BY created_at DESC LIMIT 50`, [id]),
      ])
      return { ...place, accessibility, reviews }
    },
    favorites: (user) => rows(`SELECT p.id, p.name FROM favorites f JOIN places p ON p.id=f.place_id
      WHERE f.user_id=$1 AND ${active} ORDER BY p.name`, [user]),
    favorite: (user, place) => one(`INSERT INTO favorites SELECT $1, id FROM places WHERE id=$2 AND NOT archived
      ON CONFLICT DO NOTHING RETURNING place_id`, [user, place]),
    unfavorite: (user, place) => rows('DELETE FROM favorites WHERE user_id=$1 AND place_id=$2', [user, place]),
    submit: (user, place, kind, body, rating) => one(`INSERT INTO submissions (user_id, place_id, kind, body, rating)
      SELECT $1,id,$3,$4,$5 FROM places WHERE id=$2 AND NOT archived RETURNING id,status`, [user, place, kind, body, rating]),
    queue: () => rows(`SELECT s.id, s.kind, s.body, s.rating, p.name, s.created_at FROM submissions s
      JOIN places p ON p.id=s.place_id WHERE s.status='pending' ORDER BY s.created_at, s.id LIMIT 100`),
    moderate: (actor, id, status) => one(`WITH changed AS (
      UPDATE submissions SET status=$3, moderator_id=$1, moderated_at=now()
      WHERE id=$2 AND status='pending' RETURNING id
    ) INSERT INTO activity_log(actor_id, action, target)
      SELECT $1,'moderation.' || $3,id::text FROM changed RETURNING id`, [actor, id, status]),
    visit: (user, place, day) => one(`INSERT INTO visits SELECT $1,id,$3 FROM places WHERE id=$2 AND NOT archived
      ON CONFLICT DO NOTHING RETURNING place_id`, [user, place, day]),
    async passport(user) {
      const [visits, badges] = await Promise.all([
        rows(`SELECT p.id AS place_id,p.name,v.visited_on::text,
          row_number() OVER(PARTITION BY p.id ORDER BY v.visited_on)=1 AS stamp
          FROM visits v JOIN places p ON p.id=v.place_id WHERE user_id=$1
          ORDER BY visited_on DESC, p.name LIMIT 100`, [user]),
        rows(`WITH progress AS (SELECT count(DISTINCT place_id)::integer AS total FROM visits WHERE user_id=$1)
          SELECT r.*, total, total>=unique_places AS earned FROM achievement_rules r CROSS JOIN progress ORDER BY unique_places`, [user]),
      ])
      return { visits, badges }
    },
    savePlace: (actor, id, place) => one(`WITH changed AS (
      INSERT INTO places (id,name,description,province,category,food,latitude,longitude)
      VALUES (coalesce($2,gen_random_uuid()),$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (id) DO UPDATE SET name=excluded.name,description=excluded.description,province=excluded.province,
      category=excluded.category,food=excluded.food,latitude=excluded.latitude,longitude=excluded.longitude
      RETURNING id
    ), source AS (
      INSERT INTO place_sources SELECT id,$10,$11,$12 FROM changed
      ON CONFLICT ON CONSTRAINT place_sources_pkey DO UPDATE SET url=excluded.url,checked_on=excluded.checked_on,confidence=excluded.confidence
    ), log AS (
      INSERT INTO activity_log(actor_id, action,target) SELECT $1,'place.saved',id::text FROM changed
    ) SELECT id FROM changed`, [actor,id,place.name,place.description,place.province,place.category,place.food,
      place.latitude,place.longitude,place.url,place.checkedOn,place.confidence]),
    archive: (actor, id, archived) => one(`WITH changed AS (
      UPDATE places SET archived=$3 WHERE id=$2 RETURNING id
    ) INSERT INTO activity_log(actor_id,action,target) SELECT $1,'place.archive_changed',id::text FROM changed RETURNING id`, [actor,id,archived]),
    saveEvidence: (actor, id, feature, evidence) => one(`WITH changed AS (
      INSERT INTO place_accessibility SELECT id,$3,$4,$5,$6,$7 FROM places WHERE id=$2
      ON CONFLICT (place_id,feature) DO UPDATE SET status=excluded.status,evidence=excluded.evidence,
      source_url=excluded.source_url,checked_on=excluded.checked_on RETURNING place_id
    ) INSERT INTO activity_log(actor_id,action,target) SELECT $1,'place.evidence_saved',place_id::text FROM changed RETURNING id`,
    [actor,id,feature,evidence.status,evidence.body,evidence.url,evidence.checkedOn]),
    saveRule: (actor, rule) => rows(`WITH changed AS (
      INSERT INTO achievement_rules VALUES ($2,$3,$4) ON CONFLICT (code) DO UPDATE SET
      name=excluded.name,unique_places=excluded.unique_places RETURNING code
    ) INSERT INTO activity_log(actor_id,action,target) SELECT $1,'achievement.saved',code FROM changed`,
    [actor,rule.code,rule.name,rule.uniquePlaces]),
    saveCategory: (actor, code, name) => rows(`WITH changed AS (
      INSERT INTO categories VALUES ($2,$3) ON CONFLICT (code) DO UPDATE SET name=excluded.name RETURNING code
    ) INSERT INTO activity_log(actor_id,action,target) SELECT $1,'category.saved',code FROM changed`, [actor,code,name]),
  }
}
