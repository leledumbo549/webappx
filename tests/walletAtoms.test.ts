import { getDefaultStore } from 'jotai'
import { loadWalletAtom, walletAtom } from '@/atoms/walletAtoms'
import axios from '@/lib/axios'

jest.mock('@/lib/axios', () => ({ __esModule: true, default: { get: jest.fn() } }))

const mockedGet = axios.get as jest.Mock

/**
 * @jest-environment jsdom
 */

test('loadWalletAtom fetches and stores wallet', async () => {
  const store = getDefaultStore()
  mockedGet.mockResolvedValueOnce({ data: { id: 1, userId: 1, balance: '10' } })
  await store.set(loadWalletAtom)
  expect(store.get(walletAtom)).toEqual({ id: 1, userId: 1, balance: '10' })
})
