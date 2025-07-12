import type { InferSelectModel } from 'drizzle-orm';
import {
  sqliteTable,
  integer,
  text,
  real,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

//
// USERS TABLE
//
export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    name: text('name'),
    username: text('username').notNull(),
    password: text('password'),
    role: text('role'), // 'admin' | 'buyer' | 'seller'
    status: text('status'), // 'active' | 'banned' | 'inactive'
  },
  (table) => ({
    usernameIndex: uniqueIndex('username_unique').on(table.username),
  })
);

//
// SELLERS TABLE
//
export const sellers = sqliteTable('sellers', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  logo: text('logo'),
  bio: text('bio'),
  contact: text('contact'),
  status: text('status'), // 'active' | 'inactive' | 'pending'
});

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
});

//
// SELLER ORDERS TABLE
//
export const sellerOrders = sqliteTable('sellerOrders', {
  id: integer('id').primaryKey(),
  productId: integer('productId').notNull(),
  productName: text('productName').notNull(),
  quantity: integer('quantity').notNull(),
  total: real('total').notNull(),
  status: text('status'), // 'pending' | 'shipped' | 'delivered'
  sellerId: integer('sellerId'),
  createdAt: text('createdAt'),
});

//
// SELLER PAYOUTS TABLE
//
export const sellerPayouts = sqliteTable('sellerPayouts', {
  id: integer('id').primaryKey(),
  amount: real('amount').notNull(),
  date: text('date').notNull(),
  sellerId: integer('sellerId'),
  status: text('status'), // 'pending' | 'completed' | 'failed'
});

//
// REPORTS TABLE
//
export const reports = sqliteTable('reports', {
  id: integer('id').primaryKey(),
  message: text('message'),
  status: text('status'), // 'open' | 'closed' | 'resolved'
});

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
);

//
// CART TABLE
//
export const cart = sqliteTable('cart', {
  productId: integer('productId').primaryKey(),
  quantity: integer('quantity'),
});

//
// ORDERS TABLE
//
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  items: text('items'), // Stored as JSON string
  total: real('total'),
  status: text('status'), // 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: text('createdAt'),
});

//
// Type helpers
//
export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalSales: number;
  openReports: number;
}

// Export all types from drizzle schemas
export type User = InferSelectModel<typeof users>;
export type PublicUser = Omit<User, 'password'>;
export type Product = InferSelectModel<typeof products>;
export type Seller = InferSelectModel<typeof sellers>;
export type SellerOrder = InferSelectModel<typeof sellerOrders>;
export type SellerPayout = InferSelectModel<typeof sellerPayouts>;
export type Report = InferSelectModel<typeof reports>;
export type Setting = InferSelectModel<typeof settings>;

// Type aliases for backward compatibility
export type SellerProduct = Product;
export type SellerProfile = Seller;
export type AdminUser = User;
export type AdminSeller = Seller;
export type AdminProduct = Product;
export type AdminReport = Report;
export type AdminSettings = Record<string, string>;

//
// Raw SQL DDL — always keep in sync with your Drizzle schema!
//
export const createTableStatements = [
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT,
    role TEXT,
    status TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    bio TEXT,
    contact TEXT,
    status TEXT
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
    status TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS sellerOrders (
    id INTEGER PRIMARY KEY,
    productId INTEGER NOT NULL,
    productName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT,
    sellerId INTEGER,
    createdAt TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS sellerPayouts (
    id INTEGER PRIMARY KEY,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    sellerId INTEGER,
    status TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY,
    message TEXT,
    status TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS cart (
    productId INTEGER PRIMARY KEY,
    quantity INTEGER
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    items TEXT,
    total REAL,
    status TEXT,
    createdAt TEXT
  );
  `,
];
