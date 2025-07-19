// Import Wallet type from schema.ts as the single source of truth
export type { Wallet } from '@/server/schema';

// Balance is stored as a string representing stablecoin amount
export type Balance = string;
