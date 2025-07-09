import { rest } from 'msw'

export const handlers = [
  rest.get('/api/buyer/info', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ info: 'this is placeholder api/buyer/info' })
    )
  }),
]
