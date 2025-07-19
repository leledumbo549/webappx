// loginAtoms.ts
import type { User } from '@/server/schema';
import { atom } from 'jotai';
import { clearWalletAtom } from './walletAtoms';

// Helper functions for localStorage
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const setStoredToken = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  } catch {
    // Ignore localStorage errors
  }
};

const setStoredUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  } catch {
    // Ignore localStorage errors
  }
};

export const tokenAtom = atom<string | null>(getStoredToken());
export const userAtom = atom<User | null>(getStoredUser());

export const loginAtom = atom(
  null,
  (_get, set, { token, user }: { token: string; user: User }) => {
    set(tokenAtom, token);
    set(userAtom, user);
    setStoredToken(token);
    setStoredUser(user);
  }
);

export const logoutAtom = atom(null, (_get, set) => {
  set(tokenAtom, null);
  set(userAtom, null);
  set(clearWalletAtom);
  setStoredToken(null);
  setStoredUser(null);
});

export const isAuthenticatedAtom = atom(
  (get) => !!get(tokenAtom) && !!get(userAtom)
);
