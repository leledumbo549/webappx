// loginAtoms.ts
import type { User } from '@/server/schema';
import { atom } from 'jotai';

export const tokenAtom = atom<string | null>(null);
export const userAtom = atom<User | null>(null);

export const loginAtom = atom(
  null,
  (_get, set, { token, user }: { token: string; user: User }) => {
    console.log('Login atom called with:', { token, user });
    set(tokenAtom, token);
    set(userAtom, user);
  }
);

export const logoutAtom = atom(
  null,
  (_get, set) => {
    console.log('Logout atom called');
    set(tokenAtom, null);
    set(userAtom, null);
  }
);

export const isAuthenticatedAtom = atom((get) => !!get(tokenAtom) && !!get(userAtom));
