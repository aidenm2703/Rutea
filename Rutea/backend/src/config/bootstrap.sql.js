import { readdir, readFile } from 'node:fs/promises'

export async function initializeEmptyDatabase(execute, { catalog = true } = {}) {
  const base = new URL('../../../database/', import.meta.url)
  const migrations = (await readdir(new URL('migrations/', base)))
    .filter((file) => file.endsWith('.sql')).sort().map((file) => 'migrations/' + file)
  const files = ['schema.sql', 'seed.sql', ...migrations]
  if (catalog) files.push('seed_catalog.sql')
  for (const file of files) await execute(await readFile(new URL(file, base), 'utf8'))
}
