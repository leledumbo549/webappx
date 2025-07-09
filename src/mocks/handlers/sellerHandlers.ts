import { rest } from 'msw'
import productsData from '../data/seller-products.json'
import ordersData from '../data/seller-orders.json'
import payoutsData from '../data/seller-payouts.json'
import profileData from '../data/seller-profile.json'

let products = [...productsData]
const orders = [...ordersData]
const payouts = [...payoutsData]
let profile = { ...profileData }

export const handlers = [
  rest.get('/api/seller/products', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(products))
  }),

  rest.post('/api/seller/products', async (req, res, ctx) => {
    const data = await req.json()
    const id = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1
    const newProduct = { id, ...data }
    products.push(newProduct)
    return res(ctx.status(201), ctx.json(newProduct))
  }),

  rest.get('/api/seller/products/:id', (req, res, ctx) => {
    const id = Number(req.params.id)
    const product = products.find((p) => p.id === id)
    if (!product) return res(ctx.status(404))
    return res(ctx.status(200), ctx.json(product))
  }),

  rest.put('/api/seller/products/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) return res(ctx.status(404))
    const data = await req.json()
    products[idx] = { ...products[idx], ...data, id }
    return res(ctx.status(200), ctx.json(products[idx]))
  }),

  rest.delete('/api/seller/products/:id', (req, res, ctx) => {
    const id = Number(req.params.id)
    products = products.filter((p) => p.id !== id)
    return res(ctx.status(200))
  }),

  rest.get('/api/seller/orders', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(orders))
  }),

  rest.patch('/api/seller/orders/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const order = orders.find((o) => o.id === id)
    if (!order) return res(ctx.status(404))
    const { action } = await req.json()
    if (action === 'ship') order.status = 'shipped'
    if (action === 'deliver') order.status = 'delivered'
    return res(ctx.status(200), ctx.json(order))
  }),

  rest.get('/api/seller/payouts', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(payouts))
  }),

  rest.get('/api/seller/profile', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(profile))
  }),

  rest.put('/api/seller/profile', async (req, res, ctx) => {
    profile = await req.json()
    return res(ctx.status(200), ctx.json(profile))
  }),
]
