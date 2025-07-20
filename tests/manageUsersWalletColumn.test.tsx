/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
import { HashRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import ManageUsers from '@/pages/admin/ManageUsers';

const server = setupServer(
  rest.get('/api/admin/users', (_req, res, ctx) =>
    res(
      ctx.json([
        {
          id: 1,
          name: 'Alice',
          username: 'alice',
          ethereumAddress: '0xabc',
          authMethod: 'siwe',
          role: 'buyer',
          status: 'active',
          createdAt: '',
          updatedAt: '',
        },
      ])
    )
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('shows ethereum address column', async () => {
  render(
    <HashRouter>
      <ManageUsers />
    </HashRouter>
  );
  expect(await screen.findByText('Address')).toBeInTheDocument();
  expect((await screen.findAllByText('0xabc')).length).toBeGreaterThan(0);
});
