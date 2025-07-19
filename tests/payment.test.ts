import { beforeAll, test, expect } from '@jest/globals';
import { drizzleDb } from '@/server/db';
import { promises as fs } from 'fs';
import path from 'node:path';
import {
  mintStabletoken,
  getStabletokenBalance,
  handlePaymentWebhook,
  getTransactionsForUser,
} from '@/server/controllers';

const USER_ID = 8;

beforeAll(async () => {
  try {
    await fs.access('/webappx/sql-wasm.wasm');
  } catch {
    await fs.mkdir('/webappx', { recursive: true });
    await fs.copyFile(
      path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm'),
      '/webappx/sql-wasm.wasm',
    );
  }
  await drizzleDb();
});

test('mintStabletoken increases balance', async () => {
  const before = await getStabletokenBalance(USER_ID);
  const balance = await mintStabletoken(USER_ID, 10);
  expect(balance).toBe(before + 10);
  const after = await getStabletokenBalance(USER_ID);
  expect(after).toBe(balance);
});

test('payment webhook success mints and records transaction', async () => {
  const before = await getStabletokenBalance(USER_ID);
  await handlePaymentWebhook({ paymentId: 'pay_test', userId: USER_ID, amount: 5, status: 'success' });
  const after = await getStabletokenBalance(USER_ID);
  expect(after).toBe(before + 5);
  const txs = await getTransactionsForUser(USER_ID);
  const tx = txs.find(t => t.reference === 'pay_test');
  expect(tx).toBeTruthy();
  expect(tx?.amount).toBe(5);
});

test('getTransactionsForUser returns history', async () => {
  const txs = await getTransactionsForUser(USER_ID);
  expect(txs.length).toBeGreaterThan(0);
});
