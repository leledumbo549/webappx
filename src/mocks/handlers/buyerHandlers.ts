// cartHandlers.ts
import { rest } from 'msw'
import cartData from '../data/cart.json'
import ordersData from '../data/orders.json'
import { runAndSave, exec } from './db'

// === SEED CART & ORDERS ===
const seed = () => {
  // CART TABLE
  runAndSave(`CREATE TABLE IF NOT EXISTS cart (
    productId INTEGER PRIMARY KEY,
    quantity INTEGER
  )`)

  cartData.forEach((item) => {
    runAndSave(
      `INSERT OR IGNORE INTO cart (productId, quantity) VALUES (?, ?)`,
      [item.productId, item.quantity]
    )
  })

  // ORDERS TABLE
  runAndSave(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    items TEXT,  -- JSON string of items
    total REAL,
    status TEXT,
    createdAt TEXT
  )`)

  ordersData.forEach((order) => {
    runAndSave(
      `INSERT OR IGNORE INTO orders (id, items, total, status, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [
        order.id,
        JSON.stringify(order.items),
        order.total,
        order.status,
        order.createdAt,
      ]
    )
  })

  console.log('[seed] Seeded cart and orders')
}

seed()

// === TYPES ===
interface CartItem {
  productId: number
  quantity: number
}
interface Order {
  id: number
  items: CartItem[]
  total: number
  status: string
  createdAt: string
}

// === HANDLERS ===
export const handlers = [
  // GET CART
  rest.get('/api/cart', (_req, res, ctx) => {
    const rows = exec(`SELECT * FROM cart`)
    return res(ctx.status(200), ctx.json(rows))
  }),

  // GET ORDERS
  rest.get('/api/orders', (_req, res, ctx) => {
    const rows = exec(`SELECT * FROM orders`).map((row) => ({
      ...row,
      items: JSON.parse(row.items as string),
    }))
    return res(ctx.status(200), ctx.json(rows))
  }),

  // CREATE ORDER
  rest.post('/api/orders', async (req, res, ctx) => {
    const orderInput = (await req.json()) as Omit<Order, 'id'>
    const allOrders = exec(`SELECT * FROM orders`)
    const newId = allOrders.length
      ? Math.max(...allOrders.map((o) => o.id as number)) + 1
      : 1

    runAndSave(
      `INSERT INTO orders (id, items, total, status, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [
        newId,
        JSON.stringify(orderInput.items),
        orderInput.total,
        orderInput.status,
        orderInput.createdAt,
      ]
    )

    // Clear cart
    runAndSave(`DELETE FROM cart`)

    const newOrder: Order = {
      id: newId,
      ...orderInput,
    }

    return res(ctx.status(201), ctx.json(newOrder))
  }),
]
