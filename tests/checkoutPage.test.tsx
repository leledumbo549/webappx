/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
import { HashRouter } from 'react-router-dom';
import { getDefaultStore } from 'jotai';
import Checkout from '@/pages/buyer/Checkout';
import { cartAtom } from '@/atoms/cartAtoms';
import { tokenAtom, userAtom } from '@/atoms/loginAtoms';

const navigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

test('redirects to login when placing order while not authenticated', () => {
  const store = getDefaultStore();
  store.set(cartAtom, [
    {
      id: 1,
      userId: 0,
      productId: 1,
      quantity: 1,
      product: {
        id: 1,
        name: 'Prod',
        price: 10,
        description: '',
        imageUrl: '',
        sellerId: 1,
        status: '',
        createdAt: '',
        updatedAt: '',
      },
    },
  ]);
  store.set(tokenAtom, null);
  store.set(userAtom, null);

  render(
    <HashRouter>
      <Checkout />
    </HashRouter>,
  );

  fireEvent.click(screen.getByRole('button', { name: /place order/i }));
  expect(navigate).toHaveBeenCalledWith('/login');
});
