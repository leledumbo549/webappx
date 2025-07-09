import { rest } from 'msw'
import usersData from '../data/users.json'
import productsData from '../data/products.json'

// Types
type Role = 'buyer' | 'seller' | 'admin'
interface User {
  id: number
  name: string
  role: Role
  status: 'active' | 'banned'
}
interface Seller {
  id: number
  name: string
  status: 'pending' | 'active' | 'inactive'
}
interface Product {
  id: number
  name: string
  price: number
  status: 'pending' | 'active' | 'flagged'
}
interface Report {
  id: number
  message: string
  status: 'open' | 'closed'
}

const users: User[] = usersData.map((u) => ({
  id: u.id,
  name: u.name,
  role: u.role as Role,
  status: 'active',
}))

const sellers: Seller[] = [
  { id: 1, name: 'Sam Seller', status: 'active' },
  { id: 2, name: 'Jane Doe', status: 'pending' },
]

let products: Product[] = productsData.map((p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  status: 'pending',
}))

const reports: Report[] = [{ id: 1, message: 'Spam listing', status: 'open' }]

let settings = { fees: 5, payoutDelay: 7 }

export const handlers = [
  rest.get('/api/admin/dashboard', (_req, res, ctx) => {
    const totalUsers = users.length
    const totalSellers = sellers.filter((s) => s.status === 'active').length
    const totalSales = products.length * 10
    const openReports = reports.filter((r) => r.status === 'open').length
    return res(
      ctx.status(200),
      ctx.json({ totalUsers, totalSellers, totalSales, openReports })
    )
  }),

  rest.get('/api/admin/users', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users))
  }),

  rest.patch('/api/admin/users/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const user = users.find((u) => u.id === id)
    if (!user) return res(ctx.status(404))
    const { action } = await req.json()
    if (action === 'toggleBan') {
      user.status = user.status === 'banned' ? 'active' : 'banned'
    }
    return res(ctx.status(200), ctx.json(user))
  }),

  rest.get('/api/admin/sellers', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sellers))
  }),

  rest.patch('/api/admin/sellers/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const seller = sellers.find((s) => s.id === id)
    if (!seller) return res(ctx.status(404))
    const { action } = await req.json()
    if (action === 'approve' || action === 'activate') seller.status = 'active'
    if (action === 'reject' || action === 'deactivate')
      seller.status = 'inactive'
    return res(ctx.status(200), ctx.json(seller))
  }),

  rest.get('/api/admin/products', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(products))
  }),

  rest.patch('/api/admin/products/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const product = products.find((p) => p.id === id)
    if (!product) return res(ctx.status(404))
    const { action } = await req.json()
    if (action === 'approve') product.status = 'active'
    if (action === 'reject') product.status = 'flagged'
    if (action === 'flag') product.status = 'flagged'
    if (action === 'remove') {
      products = products.filter((p) => p.id !== id)
      return res(ctx.status(200))
    }
    return res(ctx.status(200), ctx.json(product))
  }),

  rest.get('/api/admin/reports', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(reports))
  }),

  rest.patch('/api/admin/reports/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const report = reports.find((r) => r.id === id)
    if (!report) return res(ctx.status(404))
    const { action } = await req.json()
    if (action === 'resolve') report.status = 'closed'
    return res(ctx.status(200), ctx.json(report))
  }),

  rest.get('/api/admin/settings', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(settings))
  }),

  rest.put('/api/admin/settings', async (req, res, ctx) => {
    settings = await req.json()
    return res(ctx.status(200), ctx.json(settings))
  }),
]
