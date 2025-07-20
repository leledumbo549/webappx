/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
import { HashRouter } from 'react-router-dom';
import { getDefaultStore } from 'jotai';
import Profile from '@/pages/buyer/Profile';
import { userAtom } from '@/atoms/loginAtoms';

jest.mock('@reown/appkit/react', () => ({
  useAppKit: () => ({ open: jest.fn() }),
  useAppKitAccount: () => ({ isConnected: true }),
}));

test('shows ethereum address on profile page', () => {
  const store = getDefaultStore();
  store.set(userAtom, {
    id: 1,
    name: 'Alice',
    username: 'alice',
    ethereumAddress: '0xabc',
    authMethod: 'siwe',
    role: 'buyer',
    status: 'active',
    createdAt: '',
    updatedAt: '',
  });

  render(
    <HashRouter>
      <Profile />
    </HashRouter>,
  );

  expect(screen.getByDisplayValue('0xabc')).toBeInTheDocument();
});
