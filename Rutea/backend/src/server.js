import { createPool } from './config/database.js'
import { createRuntime } from './config/runtime.js'

const { DATABASE_URL, PORT = '3000' } = process.env
if (!DATABASE_URL) throw new Error('Configura DATABASE_URL para iniciar el backend.')

const pool = createPool(DATABASE_URL)
pool.on('error', (error) => console.error('Error de conexión PostgreSQL', error.code ?? error.name))
const app = createRuntime(pool, process.env)
app.listen(Number(PORT), () => console.log(`Rutea API escucha en el puerto ${PORT}`))
