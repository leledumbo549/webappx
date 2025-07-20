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
import AdminDashboard from '@/pages/admin/AdminDashboard';

const server = setupServer(
  rest.get('/api/admin/dashboard', (_req, res, ctx) =>
    res(
      ctx.json({ totalUsers: 1, totalSellers: 1, totalSales: 0, openReports: 0, totalWallets: 1 })
    )
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('shows total wallets on dashboard', async () => {
  render(
    <HashRouter>
      <AdminDashboard />
    </HashRouter>
  );
  const label = await screen.findByText('Total Wallets');
  expect(label).toBeInTheDocument();
  expect(label.nextSibling?.textContent).toBe('1');
});
