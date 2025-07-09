import { rest } from 'msw'
import cartData from '../data/cart.json'
import ordersData from '../data/orders.json'

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

let cart: CartItem[] = [...cartData]
const orders: Order[] = [...ordersData]

export const handlers = [
  rest.get('/api/cart', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(cart))
  }),
  rest.get('/api/orders', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(orders))
  }),
  rest.post('/api/orders', async (req, res, ctx) => {
    const order = (await req.json()) as Omit<Order, 'id'>
    const newOrder: Order = {
      id: orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
      ...order,
    }
    orders.push(newOrder)
    cart = []
    return res(ctx.status(201), ctx.json(newOrder))
  }),
]
