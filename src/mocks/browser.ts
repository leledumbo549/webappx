// src/mocks/browser.ts
import { setupWorker } from 'msw'
import { handlers } from './handlers/publicHandlers'
import { handlers as adminHandlers } from './handlers/adminHandler'
import { handlers as buyerHandlers } from './handlers/buyerHandlers'
import { handlers as sellerHandlers } from './handlers/sellerHandlers'

export const worker = setupWorker(
  ...handlers,
  ...adminHandlers,
  ...buyerHandlers,
  ...sellerHandlers
)
