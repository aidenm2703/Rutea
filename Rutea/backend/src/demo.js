import { randomBytes } from 'node:crypto'
import { PGlite } from '@electric-sql/pglite'
import { initializeEmptyDatabase } from './config/bootstrap.sql.js'
import { createRuntime } from './config/runtime.js'

const port = Number(process.env.PORT ?? 3000)
const db = new PGlite()
await initializeEmptyDatabase((sql) => db.exec(sql))
const app = createRuntime(db, { JWT_SECRET: randomBytes(32).toString('hex') })
app.listen(port, '127.0.0.1', () => {
  console.log(`Rutea demo en http://127.0.0.1:${port}. Los datos se reinician al cerrar el proceso.`)
})
