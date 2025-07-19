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
jest.mock('@/lib/axios', () => ({ __esModule: true, default: { post: jest.fn(), put: jest.fn() } }));
jest.mock('@reown/appkit-adapter-ethers', () => ({ EthersAdapter: function () {} }));
jest.mock('@reown/appkit/networks', () => ({ arbitrum: {}, mainnet: {} }));
import Register from '@/pages/Register';

const mockedOpen = jest.fn(async () => {});

jest.mock('@reown/appkit/react', () => ({
  createAppKit: jest.fn(),
  useAppKit: () => ({ open: mockedOpen }),
  useAppKitAccount: () => ({ address: undefined, isConnected: false }),
  useAppKitNetworkCore: () => ({ chainId: 1 }),
  useAppKitProvider: () => ({ walletProvider: null }),
}));

test.skip('shows connect button when wallet not connected', async () => {
  render(
    <HashRouter>
      <Register />
    </HashRouter>,
  );
  const btn = screen.getByRole('button', { name: /connect wallet/i });
  fireEvent.click(btn);
  await waitFor(() => expect(mockedOpen).toHaveBeenCalled());
});
