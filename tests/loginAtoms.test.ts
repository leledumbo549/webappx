import { getDefaultStore } from 'jotai'
import { loginAtom, logoutAtom, tokenAtom, userAtom } from '@/atoms/loginAtoms'
import type { User } from '@/server/schema'

test('loginAtom sets token and user then logout clears them', () => {
  const store = getDefaultStore()
  const user: User = {
    id: 1,
    name: 'Alice',
    username: 'alice',
    ethereumAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    authMethod: 'siwe',
    role: 'buyer',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  store.set(loginAtom, { token: 't', user })

  expect(store.get(tokenAtom)).toBe('t')
  expect(store.get(userAtom)?.username).toBe('alice')

  store.set(logoutAtom)
  expect(store.get(tokenAtom)).toBeNull()
  expect(store.get(userAtom)).toBeNull()
})
