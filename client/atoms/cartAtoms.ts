import { atom } from 'jotai';
import type { Product } from '@/types/Product';

export interface CartItemWithProduct {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product;
}

const CART_KEY = 'cart_items';

const getStoredCart = (): CartItemWithProduct[] => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? (JSON.parse(data) as CartItemWithProduct[]) : [];
  } catch {
    return [];
  }
};

const setStoredCart = (items: CartItemWithProduct[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const cartAtom = atom<CartItemWithProduct[]>(getStoredCart());

export const cartTotalAtom = atom((get) =>
  get(cartAtom).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
);

export const loadCartAtom = atom(null, async (_get, set) => {
  const stored = getStoredCart();
  set(cartAtom, stored);
});

export const addToCartAtom = atom(null, async (get, set, product: Product) => {
  const cart = get(cartAtom);
  const existing = cart.find((i) => i.productId === product.id);
  let updated: CartItemWithProduct[];
  if (existing) {
    updated = cart.map((i) =>
      i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  } else {
    const newItem: CartItemWithProduct = {
      id: product.id,
      userId: 0,
      productId: product.id,
      quantity: 1,
      product,
    };
    updated = [...cart, newItem];
  }
  set(cartAtom, updated);
  setStoredCart(updated);
});

export const removeFromCartAtom = atom(
  null,
  async (get, set, productId: number) => {
    const updated = get(cartAtom).filter((i) => i.productId !== productId);
    set(cartAtom, updated);
    setStoredCart(updated);
  }
);

export const updateCartQuantityAtom = atom(
  null,
  async (
    get,
    set,
    { productId, quantity }: { productId: number; quantity: number }
  ) => {
    let updated: CartItemWithProduct[];
    if (quantity <= 0) {
      updated = get(cartAtom).filter((i) => i.productId !== productId);
    } else {
      updated = get(cartAtom).map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
    }
    set(cartAtom, updated);
    setStoredCart(updated);
  }
);

export const clearCartAtom = atom(null, async (_get, set) => {
  set(cartAtom, []);
  setStoredCart([]);
});
