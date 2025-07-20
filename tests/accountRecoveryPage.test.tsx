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
import AccountRecovery from '@/pages/AccountRecovery';
import { userAtom } from '@/atoms/loginAtoms';

test('displays registered address', () => {
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
      <AccountRecovery />
    </HashRouter>,
  );

  expect(screen.getByDisplayValue('0xabc')).toBeInTheDocument();
  expect(screen.getByText(/contact support/i)).toBeInTheDocument();
});
