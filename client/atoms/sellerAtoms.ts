import { atom } from 'jotai';

// Refresh counter for seller products list
export const sellerProductsRefreshAtom = atom(0);

// Function to trigger refresh
export const refreshSellerProductsAtom = atom(null, (get, set) => {
  const current = get(sellerProductsRefreshAtom);
  set(sellerProductsRefreshAtom, current + 1);
});
