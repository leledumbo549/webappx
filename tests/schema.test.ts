import { beforeAll, test, expect } from '@jest/globals';
import { drizzleDb } from '@/server/db';
import { users } from '@/server/schema';
import { promises as fs } from 'fs';
import path from 'node:path';

interface TableInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

let db: Awaited<ReturnType<typeof drizzleDb>>;

beforeAll(async () => {
  try {
    await fs.access('/webappx/sql-wasm.wasm');
  } catch {
    await fs.copyFile(
      path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm'),
      '/webappx/sql-wasm.wasm',
    );
  }
  db = await drizzleDb();
});

async function getTableInfo(table: string) {
  return await db.all(`PRAGMA table_info(${table})`);
}

test('users table schema updated', async () => {
  const info = (await getTableInfo('users')) as TableInfo[];
  const columns = Object.fromEntries(info.map(c => [c.name, c]));
  expect('password' in columns).toBe(false);
  expect((columns.ethereum_address as TableInfo).notnull).toBe(1);
  const def = (columns.auth_method as TableInfo).dflt_value;
  expect(def?.replace(/'/g, '')).toBe('siwe');
});

test('seed users preserved', async () => {
  const all = await db.select().from(users).all();
  expect(all.length).toBe(8);
  const alice = all.find(u => u.username === 'alice');
  const bob = all.find(u => u.username === 'bob');
  const carol = all.find(u => u.username === 'carol');
  expect(alice && alice.ethereumAddress === '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').toBe(true);
  expect(bob && bob.ethereumAddress === '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb').toBe(true);
  expect(carol && carol.ethereumAddress === '0xcccccccccccccccccccccccccccccccccccccccc').toBe(true);
});
