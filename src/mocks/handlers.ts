import { rest } from 'msw'
import productsData from './data/products.json'
import users from './data/users.json'
import type { Product } from '../types/Product'

let products: Product[] = [...productsData]

export const handlers = [
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { username, password } = await req.json()
    const user = users.find(
      (u) => u.username === username && u.password === password
    )
    if (!user) {
      return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }))
    }
    return res(
      ctx.status(200),
      ctx.json({ token: `token-${user.id}`, user: { id: user.id, name: user.name, role: user.role } })
    )
  }),
  rest.get('/api/users/me', (req, res, ctx) => {
    const auth = req.headers.get('authorization')
    if (!auth) return res(ctx.status(401))
    const token = auth.replace('Bearer ', '')
    const id = Number(token.split('token-')[1])
    const user = users.find((u) => u.id === id)
    if (!user) return res(ctx.status(401))
    return res(ctx.status(200), ctx.json({ id: user.id, name: user.name, role: user.role }))
  }),
  rest.get('/api/products', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(products))
  }),
  rest.post('/api/products', async (req, res, ctx) => {
    const data = (await req.json()) as Omit<Product, 'id' | 'createdAt'>
    const newProduct: Product = {
      id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      ...data,
    }
    products.push(newProduct)
    return res(ctx.status(201), ctx.json(newProduct))
  }),
  rest.put('/api/products/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ message: 'Product not found' }))
    }
    const data = (await req.json()) as Partial<Product>
    products[index] = { ...products[index], ...data }
    return res(ctx.status(200), ctx.json(products[index]))
  }),
  rest.delete('/api/products/:id', (req, res, ctx) => {
    const id = Number(req.params.id)
    products = products.filter((p) => p.id !== id)
    return res(ctx.status(204))
  }),
]
