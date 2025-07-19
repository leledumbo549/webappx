/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
import { HashRouter } from 'react-router-dom';
import { jest } from '@jest/globals';
jest.mock('@/lib/axios', () => ({ __esModule: true, default: { post: jest.fn(), get: jest.fn() } }));
jest.mock('@reown/appkit-adapter-ethers', () => ({ EthersAdapter: function () {} }));
jest.mock('@reown/appkit/networks', () => ({ arbitrum: {}, mainnet: {} }));
import Login from '@/pages/Login';

const mockedOpen = jest.fn(async () => {});

jest.mock('@reown/appkit/react', () => ({
  createAppKit: jest.fn(),
  useAppKit: () => ({ open: mockedOpen }),
  useAppKitAccount: () => ({ address: undefined, isConnected: false }),
  useAppKitNetworkCore: () => ({ chainId: 1 }),
  useAppKitProvider: () => ({ walletProvider: null }),
}));

test('shows error when wallet connection fails', async () => {
  mockedOpen.mockRejectedValueOnce(new Error('fail'));
  render(
    <HashRouter>
      <Login />
    </HashRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
  await waitFor(() => {
    expect(screen.getByText('fail')).toBeInTheDocument();
  });
});

test('shows loading indicator when connecting', async () => {
  mockedOpen.mockImplementation(() => new Promise((res) => setTimeout(res, 50)));
  render(
    <HashRouter>
      <Login />
    </HashRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
  expect(screen.getByText(/connecting/i)).toBeInTheDocument();
  await waitFor(() => expect(mockedOpen).toHaveBeenCalled());
});
