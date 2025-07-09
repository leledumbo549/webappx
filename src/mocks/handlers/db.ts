import initSqlJs, { type Database } from 'sql.js'

let db: Database

const STORAGE_KEY = 'my_sqljs_db'
const MEMORY_ONLY = true

// 1️⃣ Initialize + Load
export async function initDb() {
  const SQL = await initSqlJs({
    locateFile: (file) => {
      void file
      return `/webappx/sql-wasm.wasm`
    },
  })

  const saved = MEMORY_ONLY ? false : localStorage.getItem(STORAGE_KEY)

  if (saved) {
    const data = new Uint8Array(JSON.parse(saved))
    db = new SQL.Database(data)
    console.log('[sql.js] Loaded DB from localStorage')
  } else {
    db = new SQL.Database()
    console.log('[sql.js] Created new DB')
  }

  return db
}

// 2️⃣ Save to localStorage
function saveDb() {
  if (MEMORY_ONLY) return
  const data = db.export()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(data)))
  console.log('[sql.js] Saved DB to localStorage')
}

// 3️⃣ Run SQL that changes data & auto-save
export function runAndSave(
  sql: string,
  params: (number | string | null | Uint8Array)[] = []
) {
  db.run(sql, params)
  saveDb()
}

// 4️⃣ Execute SQL that returns data
export function exec(sql: string, params: (string | number | null)[] = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)

  const results: Record<string, unknown>[] = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }

  stmt.free()
  return results
}
