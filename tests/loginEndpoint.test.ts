import { beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import axios from 'axios';
import { drizzleDb } from '@/server/db';
import { promises as fs } from 'fs';
import path from 'node:path';
import { Wallet, getAddress } from 'ethers';
import { SiweMessage } from 'siwe';
import { resetSiweRateLimit, loginWithSiwe } from '@/server/controllers';

const server = setupServer(
  rest.post('http://localhost/api/login/siwe', async (req, res, ctx) => {
    const body = await req.json();
    const result = await loginWithSiwe(body);
    if ('MESSAGE' in result) {
      return res(ctx.status(400), ctx.json(result));
    }
    return res(ctx.status(200), ctx.json(result));
  }),
);

function buildMessage(
  address: string,
  nonce: string = Math.random().toString(36).substring(2, 10),
): string {
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

async function ensureSqlWasm() {
  try {
    await fs.access('/webappx/sql-wasm.wasm');
  } catch {
    await fs.mkdir('/webappx', { recursive: true });
    await fs.copyFile(
      path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm'),
      '/webappx/sql-wasm.wasm',
    );
  }
}

beforeAll(async () => {
  await ensureSqlWasm();
  await drizzleDb();
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  resetSiweRateLimit();
});

afterAll(() => {
  server.close();
});

test('POST /api/login/siwe returns token and user', async () => {
  const wallet = Wallet.createRandom();
  const message = buildMessage(wallet.address);
  const signature = await wallet.signMessage(message);
  const res = await axios.post('http://localhost/api/login/siwe', {
    message,
    signature,
  });
  expect(res.status).toBe(200);
  expect(res.data).toHaveProperty('token');
  expect(res.data.user.ethereumAddress).toBe(wallet.address.toLowerCase());
});

test('test users authenticate regardless of signature', async () => {
  const message = buildMessage(
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  );
  const res = await axios.post('http://localhost/api/login/siwe', {
    message,
    signature: '0x0',
  });
  expect(res.status).toBe(200);
  expect(res.data.user.username).toBe('alice');
});

test('invalid signature returns error', async () => {
  const wallet = Wallet.createRandom();
  const message = buildMessage(wallet.address);
  const badMessage = message.replace('WebAppX', 'Other');
  const signature = await wallet.signMessage(message);
  try {
    await axios.post('http://localhost/api/login/siwe', {
      message: badMessage,
      signature,
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      expect(err.response.status).toBe(400);
      expect(err.response.data).toHaveProperty('MESSAGE');
      return;
    }
    throw err;
  }
  throw new Error('Request should have failed');
});

