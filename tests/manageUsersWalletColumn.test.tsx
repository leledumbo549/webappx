/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
import { HashRouter } from 'react-router-dom';
import ManageUsers from '@/pages/admin/ManageUsers';

// Mock axios for this test
jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({
      data: [
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
      ]
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

test('shows ethereum address column', async () => {
  render(
    <HashRouter>
      <ManageUsers />
    </HashRouter>
  );
  expect(await screen.findByText('Address')).toBeInTheDocument();
  expect((await screen.findAllByText('0xabc')).length).toBeGreaterThan(0);
});
