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

  // INSERT_YOUR_CODE
  // Detect if running in a test environment (Jest, Vitest, etc.)
  const isTestEnv =
    typeof process !== 'undefined' &&
    (process.env.NODE_ENV === 'test' ||
      process.env.VITEST ||
      process.env.JEST_WORKER_ID !== undefined ||
      process.env.JEST !== undefined ||
      process.env.TEST === 'true' ||
      // fallback for browser-based test runners
      (typeof window !== 'undefined' && (window as any).__TEST__));

  const sqlWasmLocation = isTestEnv ? './public/sql-wasm.wasm' : '/webappx/sql-wasm.wasm'
  
  const SQL = await initSqlJs({
    locateFile: (file) => {
      void file
      return sqlWasmLocation
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
