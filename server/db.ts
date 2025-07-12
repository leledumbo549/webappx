import initSqlJs from 'sql.js'
import { drizzle } from 'drizzle-orm/sql-js'
import * as schema from './schema'
import { createTableStatements } from './schema'
import { seedDb } from './seed'
let db: ReturnType<typeof drizzle> | null = null

export async function initDrizzle() {
  if (db) return db // Already initialized

  const SQL = await initSqlJs({
    locateFile: (file) => {
      void file
      return `/webappx/sql-wasm.wasm`
    },
  })

  const sqlite = new SQL.Database()
  db = drizzle(sqlite, { schema })

for (const statement of createTableStatements) {
    await db.run(statement);
  }
  // const tables = await db.all(
  //   "SELECT name FROM sqlite_master WHERE type='table';"
  // )
  console.log('[sql.js] DB ready!')

  await seedDb(db)
  return db
}

// Always returns the same Promise if already running
let dbPromise: Promise<ReturnType<typeof drizzle>> | null = null

export function drizzleDb(): Promise<ReturnType<typeof drizzle>> {
  if (!dbPromise) {
    dbPromise = initDrizzle()
  }
  return dbPromise
}
