// adminHandlers.ts
import { rest } from 'msw'
import usersData from '../data/users.json'
import productsData from '../data/products.json'
import { runAndSave, exec } from './db'

// Seed function in this file
const seed = () => {
  // USERS TABLE
  runAndSave(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    role TEXT,
    status TEXT
  )`)

  usersData.forEach((u) => {
    runAndSave(
      `INSERT OR IGNORE INTO users (id, name, role, status) VALUES (?, ?, ?, ?)`,
      [u.id, u.name, u.role, 'active']
    )
  })

  // SELLERS TABLE
  runAndSave(`CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    status TEXT
  )`)

  const sellers = [
    { id: 1, name: 'Sam Seller', status: 'active' },
    { id: 2, name: 'Jane Doe', status: 'pending' },
  ]

  sellers.forEach((s) => {
    runAndSave(
      `INSERT OR IGNORE INTO sellers (id, name, status) VALUES (?, ?, ?)`,
      [s.id, s.name, s.status]
    )
  })

  // PRODUCTS TABLE
  runAndSave(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL,
    status TEXT
  )`)

  productsData.forEach((p) => {
    runAndSave(
      `INSERT OR IGNORE INTO products (id, name, price, status) VALUES (?, ?, ?, ?)`,
      [p.id, p.name, p.price, 'pending']
    )
  })

  // REPORTS TABLE
  runAndSave(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY,
    message TEXT,
    status TEXT
  )`)

  runAndSave(
    `INSERT OR IGNORE INTO reports (id, message, status) VALUES (?, ?, ?)`,
    [1, 'Spam listing', 'open']
  )

  // SETTINGS TABLE
  runAndSave(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`)

  runAndSave(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [
    'fees',
    '5',
  ])
  runAndSave(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [
    'payoutDelay',
    '7',
  ])

  console.log('[seed] Seeded all tables.')
}

// ✅ Seed on module load
seed()

export const handlers = [
  // DASHBOARD
  rest.get('/api/admin/dashboard', (_req, res, ctx) => {
    const totalUsers = exec(`SELECT COUNT(*) as count FROM users`)[0].count
    const totalSellers = exec(
      `SELECT COUNT(*) as count FROM sellers WHERE status = 'active'`
    )[0].count
    const totalSales =
      Number(exec(`SELECT COUNT(*) as count FROM products`)[0].count) * 10
    const openReports = exec(
      `SELECT COUNT(*) as count FROM reports WHERE status = 'open'`
    )[0].count

    return res(
      ctx.status(200),
      ctx.json({ totalUsers, totalSellers, totalSales, openReports })
    )
  }),

  // USERS
  rest.get('/api/admin/users', (_req, res, ctx) => {
    const users = exec(`SELECT * FROM users`)
    return res(ctx.status(200), ctx.json(users))
  }),

  rest.patch('/api/admin/users/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const user = exec(`SELECT * FROM users WHERE id = ?`, [id])[0]
    if (!user) return res(ctx.status(404))

    const { action } = await req.json()
    if (action === 'toggleBan') {
      const newStatus = user.status === 'banned' ? 'active' : 'banned'
      runAndSave(`UPDATE users SET status = ? WHERE id = ?`, [newStatus, id])
      user.status = newStatus
    }

    return res(ctx.status(200), ctx.json(user))
  }),

  // SELLERS
  rest.get('/api/admin/sellers', (_req, res, ctx) => {
    const sellers = exec(`SELECT * FROM sellers`)
    return res(ctx.status(200), ctx.json(sellers))
  }),

  rest.patch('/api/admin/sellers/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const seller = exec(`SELECT * FROM sellers WHERE id = ?`, [id])[0]
    if (!seller) return res(ctx.status(404))

    const { action } = await req.json()
    let newStatus = seller.status
    if (action === 'approve' || action === 'activate') newStatus = 'active'
    if (action === 'reject' || action === 'deactivate') newStatus = 'inactive'

    runAndSave(`UPDATE sellers SET status = ? WHERE id = ?`, [
      newStatus as string,
      id,
    ])
    seller.status = newStatus

    return res(ctx.status(200), ctx.json(seller))
  }),

  // PRODUCTS
  rest.get('/api/admin/products', (_req, res, ctx) => {
    const products = exec(`SELECT * FROM products`)
    return res(ctx.status(200), ctx.json(products))
  }),

  rest.patch('/api/admin/products/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const product = exec(`SELECT * FROM products WHERE id = ?`, [id])[0]
    if (!product) return res(ctx.status(404))

    const { action } = await req.json()
    let newStatus = product.status

    if (action === 'approve') newStatus = 'active'
    if (action === 'reject' || action === 'flag') newStatus = 'flagged'

    if (action === 'remove') {
      runAndSave(`DELETE FROM products WHERE id = ?`, [id])
      return res(ctx.status(200))
    }

    runAndSave(`UPDATE products SET status = ? WHERE id = ?`, [
      newStatus as string,
      id,
    ])
    product.status = newStatus

    return res(ctx.status(200), ctx.json(product))
  }),

  // REPORTS
  rest.get('/api/admin/reports', (_req, res, ctx) => {
    const reports = exec(`SELECT * FROM reports`)
    return res(ctx.status(200), ctx.json(reports))
  }),

  rest.patch('/api/admin/reports/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const report = exec(`SELECT * FROM reports WHERE id = ?`, [id])[0]
    if (!report) return res(ctx.status(404))

    const { action } = await req.json()
    if (action === 'resolve') {
      runAndSave(`UPDATE reports SET status = 'closed' WHERE id = ?`, [id])
      report.status = 'closed'
    }

    return res(ctx.status(200), ctx.json(report))
  }),

  // SETTINGS
  rest.get('/api/admin/settings', (_req, res, ctx) => {
    const rows = exec(`SELECT * FROM settings`) as {
      key: string
      value: string
    }[]
    const settings: Record<string, string> = {}
    rows.forEach((row) => {
      settings[row.key] = row.value
    })
    return res(ctx.status(200), ctx.json(settings))
  }),

  rest.put('/api/admin/settings', async (req, res, ctx) => {
    const newSettings = await req.json()
    for (const key in newSettings) {
      runAndSave(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [
        key,
        String(newSettings[key]),
      ])
    }
    return res(ctx.status(200), ctx.json(newSettings))
  }),
]
