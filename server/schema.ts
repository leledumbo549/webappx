import type { InferSelectModel } from 'drizzle-orm'
import {
  sqliteTable,
  integer,
  text,
  real,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

//
// USERS TABLE
//
export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    name: text('name'),
    username: text('username').notNull(),
    ethereumAddress: text('ethereum_address').notNull().unique(),
    authMethod: text('auth_method').default('siwe'),
    role: text('role'), // 'admin' | 'buyer' | 'seller'
    status: text('status'), // 'active' | 'banned' | 'inactive'
    createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    usernameIndex: uniqueIndex('username_unique').on(table.username),
    nameIndex: uniqueIndex('name_unique').on(table.name),
    authMethodIndex: index('auth_method_idx').on(table.authMethod),
    ethereumAddressIndex: index('ethereum_address_idx').on(table.ethereumAddress),
  })
)

//
// STABLETOKEN BALANCES TABLE
//
export const stabletokenBalances = sqliteTable('stabletokenBalances', {
  userId: integer('userId').primaryKey(),
  balance: real('balance').default(0).notNull(),
})

//
// STABLETOKEN TRANSACTIONS TABLE
//
export const stabletokenTransactions = sqliteTable('stabletokenTransactions', {
  id: integer('id').primaryKey(),
  userId: integer('userId').notNull(),
  amount: real('amount').notNull(),
  type: text('type').notNull(), // 'payment' | 'mint' | 'burn'
  reference: text('reference'),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
})

//
// SELLERS TABLE
//
export const sellers = sqliteTable('sellers', {
  id: integer('id').primaryKey(),
  userId: integer('userId').notNull().unique(), // ID of the user who owns this seller profile (unique - one seller per user)
  name: text('name').notNull(),
  logo: text('logo'),
  bio: text('bio'),
  contact: text('contact'),
  address: text('address'),
  website: text('website'),
  status: text('status'), // 'active' | 'inactive' | 'pending'
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
})

//
// PRODUCTS TABLE
//
export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  description: text('description'),
  imageUrl: text('imageUrl'),
  sellerId: integer('sellerId'),
  status: text('status'), // 'active' | 'inactive' | 'pending' | 'flagged'
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
})

//
// WALLETS TABLE
//
export const wallets = sqliteTable('wallets', {
  id: integer('id').primaryKey(),
  userId: integer('userId').notNull().unique(),
  balance: text('balance').notNull().default('0'),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
})

//
// ORDERS TABLE (Unified for both buyer and seller views)
//
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  productId: integer('productId').notNull(),
  productName: text('productName').notNull(),
  quantity: integer('quantity').notNull(),
  items: text('items'), // JSON string of cart items
  total: real('total').notNull(),
  status: text('status'), // 'pending' | 'processing' | 'shipped' | 'delivered'
  shippingAddress: text('shippingAddress'),
  paymentMethod: text('paymentMethod'),
  trackingNumber: text('trackingNumber'),
  buyerId: integer('buyerId'), // ID of the buyer who placed the order
  sellerId: integer('sellerId'), // ID of the seller who owns the product
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
})

//
// SELLER PAYOUTS TABLE
//
export const sellerPayouts = sqliteTable('sellerPayouts', {
  id: integer('id').primaryKey(),
  amount: real('amount').notNull(),
  bankAccount: text('bankAccount'),
  processedAt: text('processedAt'),
  sellerId: integer('sellerId'),
  status: text('status'), // 'pending' | 'completed' | 'failed'
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
})

//
// REPORTS TABLE
//
export const reports = sqliteTable('reports', {
  id: integer('id').primaryKey(),
  message: text('message'),
  status: text('status'), // 'open' | 'closed' | 'resolved'
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
})

//
// SETTINGS TABLE
//
export const settings = sqliteTable(
  'settings',
  {
    key: text('key').notNull(),
    value: text('value'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.key] }),
  })
)

//
// Type helpers
//

export interface DashboardStats {
  totalUsers: number
  totalSellers: number
  totalSales: number
  openReports: number
  totalWallets: number
}

// Export all types from drizzle schemas
export type User = InferSelectModel<typeof users>
export type PublicUser = User
export type Product = InferSelectModel<typeof products>
export type Seller = InferSelectModel<typeof sellers>
export type Wallet = InferSelectModel<typeof wallets>
export type Order = InferSelectModel<typeof orders>
export type SellerPayout = InferSelectModel<typeof sellerPayouts>
export type Report = InferSelectModel<typeof reports>
export type Setting = InferSelectModel<typeof settings>
export type StabletokenBalance = InferSelectModel<typeof stabletokenBalances>
export type StabletokenTransaction = InferSelectModel<
  typeof stabletokenTransactions
>

// Type aliases for backward compatibility
export type SellerProduct = Product
export type SellerProfile = Seller
export type AdminUser = User
export type AdminSeller = Seller
export type AdminProduct = Product
export type AdminReport = Report
export type AdminSettings = Record<string, string>

//
// Raw SQL DDL — always keep in sync with your Drizzle schema!
//
export const createTableStatements = [
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    username TEXT NOT NULL UNIQUE,
    ethereum_address TEXT NOT NULL UNIQUE,
    auth_method TEXT DEFAULT 'siwe',
    role TEXT,
    status TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo TEXT,
    bio TEXT,
    contact TEXT,
    address TEXT,
    website TEXT,
    status TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    imageUrl TEXT,
    sellerId INTEGER,
    status TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL UNIQUE,
    balance TEXT NOT NULL DEFAULT '0',
    createdAt TEXT,
    updatedAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    productId INTEGER NOT NULL,
    productName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    items TEXT,
    total REAL NOT NULL,
    status TEXT,
    shippingAddress TEXT,
    paymentMethod TEXT,
    trackingNumber TEXT,
    buyerId INTEGER,
    sellerId INTEGER,
    createdAt TEXT,
    updatedAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS sellerPayouts (
    id INTEGER PRIMARY KEY,
    amount REAL NOT NULL,
    bankAccount TEXT,
    processedAt TEXT,
    sellerId INTEGER,
    status TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS stabletokenBalances (
    userId INTEGER PRIMARY KEY,
    balance REAL NOT NULL
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS stabletokenTransactions (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    reference TEXT,
    createdAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY,
    message TEXT,
    status TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  `,
]
