import { rest } from 'msw'
import type { Product } from '../types/Product'

let products: Product[] = [
  {
    id: 1,
    name: 'Nasi Goreng',
    description: 'Nasi goreng spesial dengan ayam dan telur',
    price: 25000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Kopi Luwak',
    description: 'Kopi premium asli Indonesia',
    price: 75000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Sate Ayam',
    description: 'Sate ayam bumbu kacang lezat',
    price: 20000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Teh Botol',
    description: 'Minuman teh manis dalam botol',
    price: 5000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Keripik Pisang',
    description: 'Camilan keripik pisang renyah',
    price: 10000,
    createdAt: new Date().toISOString(),
  },
]

export const handlers = [
  rest.post('/api/login', async (req, res, ctx) => {
    const { username, password } = await req.json()
    // Example: accept any username/password, return a fake token
    if (username && password) {
      return res(ctx.status(200), ctx.json({ token: 'my-secret-token' }))
    }
    return res(ctx.status(400), ctx.json({ message: 'access denied' }))
  }),
  rest.get('/api/version', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({ value: 1 }))
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
