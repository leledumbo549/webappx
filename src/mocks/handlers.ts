import { rest } from 'msw'

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
]
