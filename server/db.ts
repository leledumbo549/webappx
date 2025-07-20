import initSqlJs from 'sql.js'
import { drizzle } from 'drizzle-orm/sql-js'
import * as schema from './schema'
import { createTableStatements } from './schema'
import { seedDb } from './seed'
let db: ReturnType<typeof drizzle> | null = null

/**
 * Initialize the in-memory SQLite database and return a drizzle instance.
 * The database is seeded on first initialization.
 */
export async function initDrizzle(): Promise<ReturnType<typeof drizzle>> {
  if (db) return db // Already initialized

  const SQL = await initSqlJs({
    locateFile: (file) => {
      void file
      return `./public/sql-wasm.wasm`
    },
  })

  const sqlite = new SQL.Database()
  db = drizzle(sqlite, { schema })

  for (const statement of createTableStatements) {
    await db.run(statement)
  }

  console.log('[sql.js] DB ready!')

  await seedDb(db)
  return db
}

// Always returns the same Promise if already running
let dbPromise: Promise<ReturnType<typeof drizzle>> | null = null

/**
 * Get the drizzle database instance, initializing it if necessary.
 */
export function drizzleDb(): Promise<ReturnType<typeof drizzle>> {
  if (!dbPromise) {
    dbPromise = initDrizzle()
  }
  return dbPromise
}
