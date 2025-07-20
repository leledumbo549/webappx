import { beforeAll, test, expect } from '@jest/globals';
import { drizzleDb } from '@/server/db';
import { loginWithSiwe, updateUserProfile } from '@/server/controllers';
import { sellers } from '@/server/schema';
import { promises as fs } from 'fs';
import path from 'node:path';
import { Wallet, getAddress } from 'ethers';
import { SiweMessage } from 'siwe';

let token: string;
let address: string;

beforeAll(async () => {
  try {
    await fs.access('./public/sql-wasm.wasm');
  } catch {
    await fs.mkdir('./public', { recursive: true });
    await fs.copyFile(
      path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm'),
      './public/sql-wasm.wasm'
    );
  }
  await drizzleDb();

  const wallet = Wallet.createRandom();
  address = wallet.address;
  const nonce = Math.random().toString(36).substring(2, 10);
  const msg = new SiweMessage({
    domain: 'localhost',
    address: getAddress(address),
    statement: 'Sign in with Ethereum to WebAppX',
    uri: 'http://localhost',
    version: '1',
    chainId: 1,
    nonce,
    issuedAt: new Date().toISOString(),
  });
  const message = msg.prepareMessage();
  const signature = await wallet.signMessage(message);
  const res = await loginWithSiwe({ message, signature });
  if ('token' in res) {
    token = res.token;
  } else {
    throw new Error('login failed');
  }
});

test('updateUserProfile sets role seller and creates seller record', async () => {
  const db = await drizzleDb();
  const count = (await db.select().from(sellers).all()).length;
  const user = await updateUserProfile(token, { role: 'seller', name: 'S', username: 's1' });
  expect(user?.role).toBe('seller');
  const newCount = (await db.select().from(sellers).all()).length;
  expect(newCount).toBeGreaterThan(count);
});

test('updateUserProfile updates name and username', async () => {
  const user = await updateUserProfile(token, { name: 'New', username: 'newuser' });
  expect(user?.name).toBe('New');
  expect(user?.username).toBe('newuser');
});
