import pg from 'pg'

export function createPool(connectionString) {
  return new pg.Pool({ connectionString, connectionTimeoutMillis: 5000 })
}
