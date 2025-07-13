// seed.ts

import { drizzle } from 'drizzle-orm/sql-js'; // or drizzle-orm/better-sqlite3 for Node
import {
  users,
  sellers,
  products,
  reports,
  settings,
  orders,
  sellerPayouts,
  cart,
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
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Bob Smith',
    username: 'bob',
    password: 'bob',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Carol Williams',
    username: 'carol',
    password: 'carol',
    role: 'seller',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Dough Hart',
    username: 'doug',
    password: 'doug',
    role: 'seller',
    status: 'banned',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Emma Davis',
    username: 'emma',
    password: 'emma',
    role: 'seller',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    name: 'Frank Miller',
    username: 'frank',
    password: 'frank',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 7,
    name: 'Grace Chen',
    username: 'grace',
    password: 'grace',
    role: 'seller',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }
];

const seedSellers = [
  { id: 1, userId: 3, name: 'Acme Co.', status: 'active', logo: 'https://via.placeholder.com/150', bio: 'Premium electronics and gadgets', contact: 'contact@acme.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Carol owns Acme Co.
  { id: 2, userId: 4, name: 'FreshMart', status: 'active', logo: 'https://via.placeholder.com/150', bio: 'Fresh organic produce and groceries', contact: 'hello@freshmart.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Doug owns FreshMart
  { id: 3, userId: 5, name: 'GadgetHouse', status: 'active', logo: 'https://via.placeholder.com/150', bio: 'Innovative tech solutions', contact: 'info@gadgethouse.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Emma owns GadgetHouse (changed from Carol)
  { id: 4, userId: 7, name: 'Grace\'s Boutique', status: 'active', logo: 'https://via.placeholder.com/150', bio: 'Fashion and lifestyle products', contact: 'grace@boutique.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Grace owns Grace's Boutique
];

const seedProducts = [
  // Acme Co. products (sellerId: 1)
  { id: 1, name: 'Wireless Headphones', price: 79.99, status: 'active', sellerId: 1, description: 'High-quality wireless headphones with noise cancellation', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Bluetooth Speaker', price: 49.99, status: 'active', sellerId: 1, description: 'Portable bluetooth speaker with amazing sound quality', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Smart Watch', price: 199.99, status: 'active', sellerId: 1, description: 'Feature-rich smartwatch with health tracking', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // FreshMart products (sellerId: 2)
  { id: 4, name: 'Organic Avocados', price: 2.99, status: 'active', sellerId: 2, description: 'Fresh organic avocados from local farms', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Fresh Strawberries', price: 4.99, status: 'active', sellerId: 2, description: 'Sweet and juicy strawberries', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 6, name: 'Organic Bananas', price: 1.99, status: 'active', sellerId: 2, description: 'Organic bananas rich in potassium', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // GadgetHouse products (sellerId: 3)
  { id: 7, name: 'Laptop Stand', price: 29.99, status: 'active', sellerId: 3, description: 'Adjustable laptop stand for better ergonomics', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 8, name: 'Mechanical Keyboard', price: 89.99, status: 'active', sellerId: 3, description: 'Premium mechanical keyboard with RGB lighting', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 9, name: 'Gaming Mouse', price: 59.99, status: 'active', sellerId: 3, description: 'High-precision gaming mouse with customizable buttons', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // Grace's Boutique products (sellerId: 4)
  { id: 10, name: 'Designer Handbag', price: 129.99, status: 'active', sellerId: 4, description: 'Elegant designer handbag made from premium leather', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 11, name: 'Silk Scarf', price: 39.99, status: 'active', sellerId: 4, description: 'Luxurious silk scarf with beautiful patterns', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 12, name: 'Leather Wallet', price: 24.99, status: 'active', sellerId: 4, description: 'Genuine leather wallet with multiple card slots', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

const seedReports = [
  { id: 1, message: 'Spam product listing', status: 'open', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, message: 'Fraudulent seller', status: 'resolved', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 3, message: 'Inappropriate product image', status: 'open', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

const seedSettings = [
  { key: 'siteName', value: 'MyMarketplace' },
  { key: 'currency', value: 'USD' },
  { key: 'payoutDelayDays', value: '7' },
];

const seedOrders = [
  // Bob's orders (buyerId: 2)
  { id: 1, productId: 1, productName: 'Wireless Headphones', quantity: 2, total: 159.98, status: 'pending', buyerId: 2, sellerId: 1, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
  { id: 2, productId: 4, productName: 'Organic Avocados', quantity: 5, total: 14.95, status: 'shipped', buyerId: 2, sellerId: 2, createdAt: '2024-01-14T09:15:00Z', updatedAt: '2024-01-14T09:15:00Z' },
  { id: 3, productId: 7, productName: 'Laptop Stand', quantity: 1, total: 29.99, status: 'delivered', buyerId: 2, sellerId: 3, createdAt: '2024-01-13T14:20:00Z', updatedAt: '2024-01-13T14:20:00Z' },
  
  // Frank's orders (buyerId: 6) - moved Emma's orders to Frank since Emma is now a seller
  { id: 4, productId: 10, productName: 'Designer Handbag', quantity: 1, total: 129.99, status: 'pending', buyerId: 6, sellerId: 4, createdAt: '2024-01-16T11:45:00Z', updatedAt: '2024-01-16T11:45:00Z' },
  { id: 5, productId: 8, productName: 'Mechanical Keyboard', quantity: 1, total: 89.99, status: 'processing', buyerId: 6, sellerId: 3, createdAt: '2024-01-15T16:30:00Z', updatedAt: '2024-01-15T16:30:00Z' },
  
  // Frank's orders (buyerId: 6)
  { id: 6, productId: 3, productName: 'Smart Watch', quantity: 1, total: 199.99, status: 'shipped', buyerId: 6, sellerId: 1, createdAt: '2024-01-14T13:10:00Z', updatedAt: '2024-01-14T13:10:00Z' },
  { id: 7, productId: 5, productName: 'Fresh Strawberries', quantity: 3, total: 14.97, status: 'delivered', buyerId: 6, sellerId: 2, createdAt: '2024-01-13T10:25:00Z', updatedAt: '2024-01-13T10:25:00Z' },
];

const seedCartItems = [
  // Bob's cart (userId: 2)
  { id: 1, userId: 2, productId: 2, quantity: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Bluetooth Speaker
  { id: 2, userId: 2, productId: 9, quantity: 2, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Gaming Mouse
  
  // Frank's cart (userId: 6)
  { id: 3, userId: 6, productId: 6, quantity: 4, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Organic Bananas
  { id: 4, userId: 6, productId: 11, quantity: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Silk Scarf
  { id: 5, userId: 6, productId: 12, quantity: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Leather Wallet
];

const seedSellerPayouts = [
  // Acme Co. payouts (sellerId: 1)
  { id: 1, amount: 500.00, date: '2024-01-15', sellerId: 1, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, amount: 750.00, date: '2024-01-10', sellerId: 1, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // FreshMart payouts (sellerId: 2)
  { id: 3, amount: 300.00, date: '2024-01-15', sellerId: 2, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 4, amount: 450.00, date: '2024-01-08', sellerId: 2, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // GadgetHouse payouts (sellerId: 3)
  { id: 5, amount: 600.00, date: '2024-01-15', sellerId: 3, status: 'pending', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 6, amount: 400.00, date: '2024-01-12', sellerId: 3, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // Grace's Boutique payouts (sellerId: 4)
  { id: 7, amount: 800.00, date: '2024-01-15', sellerId: 4, status: 'pending', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
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

  // Seed orders
  for (const o of seedOrders) {
    await db.insert(orders).values(o).onConflictDoNothing().run();
  }

  // Seed cart items
  for (const c of seedCartItems) {
    await db.insert(cart).values(c).onConflictDoNothing().run();
  }

  // Seed seller payouts
  for (const p of seedSellerPayouts) {
    await db.insert(sellerPayouts).values(p).onConflictDoNothing().run();
  }

  console.log('[seed] DB seeded successfully.');
}
