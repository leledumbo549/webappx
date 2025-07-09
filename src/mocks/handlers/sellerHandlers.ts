// sellerHandlers.ts
import { rest } from 'msw'
import productsData from '../data/seller-products.json'
import profileData from '../data/seller-profile.json'
import { runAndSave, exec } from './db'

// === SEED ===
const seed = () => {
  // PRODUCTS
  runAndSave(`CREATE TABLE IF NOT EXISTS seller_products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL,
    status TEXT
  )`)

  productsData.forEach((p) => {
    runAndSave(
      `INSERT OR IGNORE INTO seller_products (id, name, price, status) VALUES (?, ?, ?, ?)`,
      [p.id, p.name, p.price, 'active']
    )
  })

  // ORDERS
  runAndSave(`CREATE TABLE IF NOT EXISTS seller_orders (
    id INTEGER PRIMARY KEY,
    items TEXT,
    total REAL,
    status TEXT,
    createdAt TEXT
  )`)

  // PAYOUTS
  runAndSave(`CREATE TABLE IF NOT EXISTS seller_payouts (
    id INTEGER PRIMARY KEY,
    amount REAL,
    status TEXT,
    requestedAt TEXT
  )`)

  // PROFILE (stored as key-value pairs)
  runAndSave(`CREATE TABLE IF NOT EXISTS seller_profile (
    key TEXT PRIMARY KEY,
    value TEXT
  )`)

  Object.entries(profileData).forEach(([key, value]) => {
    runAndSave(
      `INSERT OR REPLACE INTO seller_profile (key, value) VALUES (?, ?)`,
      [key, JSON.stringify(value)]
    )
  })

  console.log('[seed] Seeded seller tables.')
}

seed()

// === HANDLERS ===
export const handlers = [
  // PRODUCTS ====
  rest.get('/api/seller/products', (_req, res, ctx) => {
    const products = exec(`SELECT * FROM seller_products`)
    return res(ctx.status(200), ctx.json(products))
  }),

  rest.post('/api/seller/products', async (req, res, ctx) => {
    const data = await req.json()
    const rows = exec(`SELECT id FROM seller_products`)
    const newId = rows.length
      ? Math.max(...rows.map((p) => Number(p.id))) + 1
      : 1
    runAndSave(
      `INSERT INTO seller_products (id, name, price, status) VALUES (?, ?, ?, ?)`,
      [newId, data.name, data.price, data.status || 'pending']
    )
    const newProduct = { id: newId, ...data }
    return res(ctx.status(201), ctx.json(newProduct))
  }),

  rest.get('/api/seller/products/:id', (req, res, ctx) => {
    const id = Number(req.params.id)
    const product = exec(`SELECT * FROM seller_products WHERE id = ?`, [id])[0]
    if (!product) return res(ctx.status(404))
    return res(ctx.status(200), ctx.json(product))
  }),

  rest.put('/api/seller/products/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const product = exec(`SELECT * FROM seller_products WHERE id = ?`, [id])[0]
    if (!product) return res(ctx.status(404))

    const data = await req.json()
    runAndSave(
      `UPDATE seller_products SET name = ?, price = ?, status = ? WHERE id = ?`,
      [data.name, data.price, data.status || product.status, id]
    )
    const updated = exec(`SELECT * FROM seller_products WHERE id = ?`, [id])[0]
    return res(ctx.status(200), ctx.json(updated))
  }),

  rest.delete('/api/seller/products/:id', (req, res, ctx) => {
    const id = Number(req.params.id)
    runAndSave(`DELETE FROM seller_products WHERE id = ?`, [id])
    return res(ctx.status(200))
  }),

  // ORDERS ====
  rest.get('/api/seller/orders', (_req, res, ctx) => {
    const rows = exec(`SELECT * FROM seller_orders`).map((o) => ({
      ...o,
      items: JSON.parse(o.items as string),
    }))
    return res(ctx.status(200), ctx.json(rows))
  }),

  rest.patch('/api/seller/orders/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const order = exec(`SELECT * FROM seller_orders WHERE id = ?`, [id])[0]
    if (!order) return res(ctx.status(404))

    const { action } = await req.json()
    let newStatus = order.status
    if (action === 'ship') newStatus = 'shipped'
    if (action === 'deliver') newStatus = 'delivered'

    runAndSave(`UPDATE seller_orders SET status = ? WHERE id = ?`, [
      newStatus as string,
      id,
    ])
    order.status = newStatus

    return res(
      ctx.status(200),
      ctx.json({
        ...order,
        items: JSON.parse(order.items as string),
      })
    )
  }),

  // PAYOUTS ====
  rest.get('/api/seller/payouts', (_req, res, ctx) => {
    const payouts = exec(`SELECT * FROM seller_payouts`)
    return res(ctx.status(200), ctx.json(payouts))
  }),

  // PROFILE ====
  rest.get('/api/seller/profile', (_req, res, ctx) => {
    const rows = exec(`SELECT * FROM seller_profile`)
    const profile: Record<string, string> = {}
    rows.forEach((row) => {
      profile[row.key as string] = JSON.parse(row.value as string)
    })
    return res(ctx.status(200), ctx.json(profile))
  }),

  rest.put('/api/seller/profile', async (req, res, ctx) => {
    const newProfile = await req.json()
    for (const key in newProfile) {
      runAndSave(
        `INSERT OR REPLACE INTO seller_profile (key, value) VALUES (?, ?)`,
        [key, JSON.stringify(newProfile[key])]
      )
    }
    return res(ctx.status(200), ctx.json(newProfile))
  }),
]
