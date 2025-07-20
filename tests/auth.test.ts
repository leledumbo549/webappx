import { beforeAll, test, expect } from '@jest/globals';
import { drizzleDb } from '@/server/db';
import { promises as fs } from 'fs';
import path from 'node:path';
import { loginWithSiwe, validateToken, resetSiweRateLimit } from '@/server/controllers';
import { Wallet, getAddress } from 'ethers';
import { SiweMessage } from 'siwe';

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
});

function buildMessage(address: string, nonce: string = Math.random().toString(36).substring(2, 10)): string {
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
  return msg.prepareMessage();
}

test('loginWithSiwe creates user and returns token', async () => {
  const wallet = Wallet.createRandom();
  const message = buildMessage(wallet.address);
  const signature = await wallet.signMessage(message);
  const res = await loginWithSiwe({ message, signature });
  expect('token' in res).toBe(true);
  if ('token' in res) {
    const user = await validateToken(res.token);
    expect(user?.ethereumAddress).toBe(wallet.address.toLowerCase());
  }
});

test('invalid signature fails', async () => {
  const wallet = Wallet.createRandom();
  const message = buildMessage(wallet.address);
  const signature = await wallet.signMessage(message);
  const badMessage = message.replace('WebAppX', 'Other');
  const res = await loginWithSiwe({ message: badMessage, signature });
  expect('MESSAGE' in res).toBe(true);
});

test('test address bypasses signature check', async () => {
  const message = buildMessage('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  const res = await loginWithSiwe({ message, signature: '0x0' });
  expect('token' in res).toBe(true);
});

test('rate limiting', async () => {
  resetSiweRateLimit();
  const wallet = Wallet.createRandom();
  const message = buildMessage(wallet.address);
  const signature = await wallet.signMessage(message);
  let last: Awaited<ReturnType<typeof loginWithSiwe>> | undefined;
  for (let i = 0; i < 6; i++) {
     
    last = await loginWithSiwe({ message, signature });
  }
  if (last && typeof last === 'object' && 'MESSAGE' in last) {
    expect(last.MESSAGE).toBe('Too many requests');
  } else {
    throw new Error('Expected rate limit error');
  }
});
