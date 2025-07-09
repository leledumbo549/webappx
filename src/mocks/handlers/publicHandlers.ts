// authHandlers.ts
import { rest } from 'msw'
import productsData from '../data/products.json'
import usersData from '../data/users.json'
import { runAndSave, exec } from './db'

// === SEED ===
const seed = () => {
  // USERS TABLE
  runAndSave(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    username TEXT,
    password TEXT,
    role TEXT,
    status TEXT
  )`)

  usersData.forEach((u) => {
    runAndSave(
      `INSERT OR IGNORE INTO users (id, name, username, password, role) VALUES (?, ?, ?, ?, ?)`,
      [u.id, u.name, u.username, u.password, u.role]
    )
  })

  // PRODUCTS TABLE (optional: not used here but good to seed)
  runAndSave(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL,
    status TEXT
  )`)

  productsData.forEach((p) => {
    runAndSave(
      `INSERT OR IGNORE INTO products (id, name, price, status) VALUES (?, ?, ?, ?)`,
      [p.id, p.name, p.price, 'active']
    )
  })

  console.log('[seed] Seeded users and products')
}

seed()

// === HANDLERS ===
export const handlers = [
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { username, password } = await req.json()

    // Look up user in the DB
    const user = exec(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, password]
    )[0]

    if (!user) {
      return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }))
    }

    return res(
      ctx.status(200),
      ctx.json({
        token: `token-${user.id}`,
        user: { id: user.id, name: user.name, role: user.role },
      })
    )
  }),
]
