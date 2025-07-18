import { atom } from 'jotai'
import type { StabletokenTransaction } from '@/server/schema'

const BALANCE_KEY = 'stabletoken_balance'

const getStoredBalance = (): number => {
  try {
    const val = localStorage.getItem(BALANCE_KEY)
    return val ? Number(val) : 0
  } catch {
    return 0
  }
}

const setStoredBalance = (balance: number) => {
  try {
    localStorage.setItem(BALANCE_KEY, String(balance))
  } catch {
    // ignore
  }
}

export const stabletokenBalanceAtom = atom<number>(getStoredBalance())

export const setStabletokenBalanceAtom = atom(
  null,
  (_get, set, balance: number) => {
    set(stabletokenBalanceAtom, balance)
    setStoredBalance(balance)
  }
)

export const transactionsAtom = atom<StabletokenTransaction[]>([])

export const setTransactionsAtom = atom(
  null,
  (_get, set, txs: StabletokenTransaction[]) => {
    set(transactionsAtom, txs)
  }
)
