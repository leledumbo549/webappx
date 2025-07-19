import test from 'node:test';
import assert from 'node:assert/strict';
import { drizzleDb } from '../db.js';
import { users } from '../schema.js';

interface TableInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

const db = await drizzleDb();

async function getTableInfo(table: string) {
  return await db.all(`PRAGMA table_info(${table})`);
}

test('users table schema updated', async () => {
  const info = (await getTableInfo('users')) as TableInfo[];
  const columns = Object.fromEntries(info.map(c => [c.name, c]));
  assert.ok(!('password' in columns));
  assert.ok((columns.ethereum_address as TableInfo).notnull === 1);
  const def = (columns.auth_method as TableInfo).dflt_value;
  assert.equal(def?.replace(/'/g, ''), 'siwe');
});

test('seed users preserved', async () => {
  const all = await db.select().from(users).all();
  assert.equal(all.length, 8);
  const alice = all.find(u => u.username === 'alice');
  const bob = all.find(u => u.username === 'bob');
  const carol = all.find(u => u.username === 'carol');
  assert.ok(alice && alice.ethereumAddress === '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  assert.ok(bob && bob.ethereumAddress === '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
  assert.ok(carol && carol.ethereumAddress === '0xcccccccccccccccccccccccccccccccccccccccc');
});
