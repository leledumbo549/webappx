/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
import { HashRouter } from 'react-router-dom';
import AdminDashboard from '../client/pages/admin/AdminDashboard';

// Mock axios for this test
jest.mock('../client/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({
      data: {
        totalUsers: 1,
        totalSellers: 1,
        totalSales: 0,
        openReports: 0,
        totalWallets: 1
      }
    })),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  },
  API_BASE_URL: 'http://localhost:3000',
  isAxiosError: jest.fn()
}));

test('shows total wallets on dashboard', async () => {
  render(
    <HashRouter>
      <AdminDashboard />
    </HashRouter>
  );
  
  // Wait for the component to load and render
  const walletLabel = await screen.findByText('Total Wallets');
  expect(walletLabel).toBeInTheDocument();
  
  // Find the parent container and then the value element
  const container = walletLabel.closest('div');
  const valueElement = container?.querySelector('.text-2xl.font-bold');
  
  expect(valueElement).toBeInTheDocument();
  expect(valueElement?.textContent).toBe('1');
});
