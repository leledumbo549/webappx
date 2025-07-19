// client/mocks/browser.ts
import { setupWorker } from 'msw';
import { handlers } from '../../server/handlers';

export const worker = setupWorker(...handlers);
