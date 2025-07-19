import { atom } from 'jotai';
import type { StabletokenTransaction } from '@/server/schema';
import axios from '@/lib/axios';

export const stabletokenBalanceAtom = atom(0);
export const transactionsAtom = atom<StabletokenTransaction[]>([]);

export const refreshBalanceAtom = atom(null, async (_get, set) => {
  const res = await axios.get<{ balance: number }>('/api/balance');
  set(stabletokenBalanceAtom, res.data.balance);
});

export const refreshTransactionsAtom = atom(null, async (_get, set) => {
  const res = await axios.get<{ transactions: StabletokenTransaction[] }>(
    '/api/transactions'
  );
  set(transactionsAtom, res.data.transactions);
});
