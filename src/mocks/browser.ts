// src/mocks/browser.ts
import { setupWorker } from 'msw'
import { handlers } from './handlers/publicHandlers'
import { handlers as buyerHandlers } from './handlers/buyerHandler'
import { handlers as adminHandlers } from './handlers/adminHandlers'
import { handlers as sellerHandlers } from './handlers/sellerHandlers'

export const worker = setupWorker(
  ...handlers,
  ...adminHandlers,
  ...buyerHandlers,
  ...sellerHandlers
)
