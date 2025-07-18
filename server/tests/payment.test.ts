import test from 'node:test';
import assert from 'node:assert/strict';
import {
  drizzleDb
} from '../db.js';
import {
  mintStabletoken,
  getStabletokenBalance,
  handlePaymentWebhook,
  getTransactionsForUser,
} from '../controllers.js';

const USER_ID = 8;

// ensure db initialized
await drizzleDb();

test('mintStabletoken increases balance', async () => {
  const before = await getStabletokenBalance(USER_ID);
  const balance = await mintStabletoken(USER_ID, 10);
  assert.equal(balance, before + 10);
  const after = await getStabletokenBalance(USER_ID);
  assert.equal(after, balance);
});

test('payment webhook success mints and records transaction', async () => {
  const before = await getStabletokenBalance(USER_ID);
  await handlePaymentWebhook({ paymentId: 'pay_test', userId: USER_ID, amount: 5, status: 'success' });
  const after = await getStabletokenBalance(USER_ID);
  assert.equal(after, before + 5);
  const txs = await getTransactionsForUser(USER_ID);
  const tx = txs.find(t => t.reference === 'pay_test');
  assert.ok(tx);
  assert.equal(tx?.amount, 5);
});

test('getTransactionsForUser returns history', async () => {
  const txs = await getTransactionsForUser(USER_ID);
  assert.ok(txs.length > 0);
});
