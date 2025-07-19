import { atom } from 'jotai';
import type { Wallet } from '@/server/schema';
import axios from '@/lib/axios';

const WALLET_KEY = 'wallet_info';

const getStoredWallet = (): Wallet | null => {
  try {
    const data = localStorage.getItem(WALLET_KEY);
    return data ? (JSON.parse(data) as Wallet) : null;
  } catch {
    return null;
  }
};

const setStoredWallet = (wallet: Wallet | null) => {
  try {
    if (wallet) {
      localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
    } else {
      localStorage.removeItem(WALLET_KEY);
    }
  } catch {
    // ignore storage errors
  }
};

export const walletAtom = atom<Wallet | null>(getStoredWallet());

export const balanceAtom = atom((get) => get(walletAtom)?.balance || '0');

export const loadWalletAtom = atom(null, async (_get, set) => {
  try {
    const res = await axios.get<Wallet>('/api/wallet');
    set(walletAtom, res.data);
    setStoredWallet(res.data);
  } catch {
    // ignore errors for now
  }
});

export const clearWalletAtom = atom(null, async (_get, set) => {
  set(walletAtom, null);
  setStoredWallet(null);
});
