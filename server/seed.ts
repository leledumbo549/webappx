// seed.ts

import { drizzle } from 'drizzle-orm/sql-js'; // or drizzle-orm/better-sqlite3 for Node
import {
  users,
  sellers,
  products,
  reports,
  settings,
} from './schema';

// --- Seed data ---
const seedUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    username: 'alice',
    password: 'alice',
    role: 'admin',
    status: 'active',
  },
  {
    id: 2,
    name: 'Bob Smith',
    username: 'bob',
    password: 'bob',
    role: 'user',
    status: 'active',
  },
  {
    id: 3,
    name: 'Carol Williams',
    username: 'carol',
    password: 'carol',
    role: 'seller',
    status: 'active',
  },
  {
    id: 4,
    name: 'Dough Hart',
    username: 'doug',
    password: 'doug',
    role: 'seller',
    status: 'banned',
  }
];

const seedSellers = [
  { id: 1, name: 'Acme Co.', status: 'active' },
  { id: 2, name: 'FreshMart', status: 'pending' },
  { id: 3, name: 'GadgetHouse', status: 'active' },
];

const seedProducts = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, status: 'active' },
  { id: 2, name: 'Organic Avocados', price: 2.99, status: 'active' },
  { id: 3, name: 'Laptop Stand', price: 29.99, status: 'pending' },
];

const seedReports = [
  { id: 1, message: 'Spam product listing', status: 'open' },
  { id: 2, message: 'Fraudulent seller', status: 'resolved' },
  { id: 3, message: 'Inappropriate product image', status: 'open' },
];

const seedSettings = [
  { key: 'siteName', value: 'MyMarketplace' },
  { key: 'currency', value: 'USD' },
  { key: 'payoutDelayDays', value: '7' },
];

// --- Seed function ---
export async function seedDb(db: ReturnType<typeof drizzle>) {
  const existingUsers = await db.select().from(users).all();
  if (existingUsers.length > 0) {
    console.log('[seed] Already seeded.');
    return;
  }

  for (const u of seedUsers) {
    await db.insert(users).values(u).onConflictDoNothing().run();
  }

  for (const s of seedSellers) {
    await db.insert(sellers).values(s).onConflictDoNothing().run();
  }

  for (const p of seedProducts) {
    await db.insert(products).values(p).onConflictDoNothing().run();
  }

  for (const r of seedReports) {
    await db.insert(reports).values(r).onConflictDoNothing().run();
  }

  for (const s of seedSettings) {
    await db.insert(settings)
      .values(s)
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: s.value },
      })
      .run();
  }

  console.log('[seed] DB seeded successfully.');
}
