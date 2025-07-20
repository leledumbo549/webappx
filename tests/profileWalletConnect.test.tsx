/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
import { HashRouter } from 'react-router-dom';
import { getDefaultStore } from 'jotai';
import Profile from '@/pages/buyer/Profile';
import { userAtom } from '@/atoms/loginAtoms';

const mockedOpen = jest.fn();

jest.mock('@reown/appkit/react', () => ({
  useAppKit: () => ({ open: mockedOpen }),
  useAppKitAccount: () => ({ isConnected: false }),
}));

test('connect wallet button triggers open', async () => {
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

  fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
  await waitFor(() => expect(mockedOpen).toHaveBeenCalled());
});
