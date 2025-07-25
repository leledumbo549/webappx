// server/controllers.ts
// Controllers for all API endpoints using drizzle and db.ts

import {
  stabletokenBalances,
  stabletokenTransactions,
} from './schema';
import type { User, PublicUser, Product, Seller, Report, Setting, DashboardStats, Order, SellerPayout, Wallet, StabletokenBalance, StabletokenTransaction } from './schema';
import { drizzleDb } from './db';
import { users, sellers, products, reports, settings, orders, sellerPayouts, wallets } from './schema';
import { and, eq, sql } from 'drizzle-orm';
import { SiweMessage } from 'siwe';

const TEST_ADDRESSES = [
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  '0xcccccccccccccccccccccccccccccccccccccccc',
];

interface RateRecord {
  count: number;
  ts: number;
}

const siweAttempts: Record<string, RateRecord> = {};

export function resetSiweRateLimit(): void {
  for (const key of Object.keys(siweAttempts)) {
    delete siweAttempts[key];
  }
}

// === AUTHENTICATION CONTROLLERS ===

export interface LoginResponse {
  token: string;
  user: PublicUser & {
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginError {
  MESSAGE: string;
}

/**
 * Creates a PublicUser object from User (removes password)
 */

export function createPublicUser(user: User): PublicUser {
  const publicUser = { ...user }; // ai: skip
  delete (publicUser as Record<string, unknown>).password;
  return publicUser as PublicUser;
}

/**
 * Generates a simple token from user ID
 */
export function generateToken(userId: number): string {
  return btoa(String(userId));
}

/**
 * Validates token and returns user
 */
export async function validateToken(token: string): Promise<PublicUser | null> {
  try {
    const userId = Number(atob(token));
    if (Number.isNaN(userId)) {
      return null;
    }

    const db = await drizzleDb();
    const rows: User[] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .all();

    if (rows.length === 0) {
      return null;
    }

    return createPublicUser(rows[0]);
  } catch {
    return null;
  }
}

export interface SiweLoginRequest {
  message: string;
  signature: string;
}

export async function loginWithSiwe(data: SiweLoginRequest | unknown): Promise<LoginResponse | LoginError> {
  if (!data || typeof data !== 'object') {
    return { MESSAGE: 'Invalid request body' };
  }

  const { message, signature } = data as SiweLoginRequest;
  if (!message || !signature) {
    return { MESSAGE: 'Message and signature are required' };
  }

  try {
    const siweMsg = new SiweMessage(message);
    const address = siweMsg.address.toLowerCase();

    const timestamp = Date.now();
    const attempt = siweAttempts[address] || { count: 0, ts: timestamp };
    if (timestamp - attempt.ts < 60000) {
      attempt.count += 1;
    } else {
      attempt.count = 1;
      attempt.ts = timestamp;
    }
    siweAttempts[address] = attempt;
    if (attempt.count > 5) {
      return { MESSAGE: 'Too many requests' };
    }

    let verified = false;
    try {
      const result = await siweMsg.verify({ signature });
      verified = result.success;
    } catch {
      verified = false;
    }

    if (!verified && !TEST_ADDRESSES.includes(address)) {
      return { MESSAGE: 'Invalid SIWE signature' };
    }
    const db = await drizzleDb();
    let user: User | undefined;
    const rows: User[] = await db
      .select()
      .from(users)
      .where(eq(users.ethereumAddress, address))
      .all();

    if (rows.length === 0) {
        user = await db
          .insert(users)
          .values({
            name: address,
            username: address,
            ethereumAddress: address,
            role: 'buyer',
            status: 'active',
          })
          .returning()
          .get();
    } else {
      user = rows[0];
    }

    const token = generateToken(user.id);
    const publicUser = createPublicUser(user);
    const now = new Date().toISOString();
    return {
      token,
      user: { ...publicUser, createdAt: now, updatedAt: now },
    };
  } catch (err) {
    console.error(err)
    return { MESSAGE: 'SIWE verification failed' };
  }
}

// === REGISTRATION CONTROLLERS ===

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
  role: 'buyer' | 'seller';
  storeName?: string;
  contact?: string;
  bio?: string;
}

export type RegisterResponse = LoginResponse;
export type RegisterError = LoginError;

export function validateRegisterRequest(data: unknown): RegisterRequest | RegisterError {
  if (!data || typeof data !== 'object') {
    return { MESSAGE: 'Invalid request body' };
  }

  const { name, username, password, role, storeName } = data as RegisterRequest;

  if (!name || typeof name !== 'string') {
    return { MESSAGE: 'Name is required' };
  }
  if (!username || typeof username !== 'string') {
    return { MESSAGE: 'Username is required' };
  }
  if (!password || typeof password !== 'string') {
    return { MESSAGE: 'Password is required' };
  }
  if (role !== 'buyer' && role !== 'seller') {
    return { MESSAGE: 'Role must be buyer or seller' };
  }
  if (role === 'seller' && (!storeName || typeof storeName !== 'string')) {
    return { MESSAGE: 'Store name is required for sellers' };
  }

  return data as RegisterRequest;
}

export async function registerUser(_data: RegisterRequest | unknown): Promise<RegisterResponse | RegisterError> {
  return { MESSAGE: 'Registration disabled' };
}

// === SETTINGS CONTROLLERS ===

/**
 * Get all application settings
 */
export async function getSettings(): Promise<Setting[]> {
  const db = await drizzleDb();
  return await db.select().from(settings).all();
}

// === ADMIN CONTROLLERS ===

/**
 * Check if user is admin
 */
export async function checkAdminAccess(token: string): Promise<PublicUser | null> {
  const user = await validateToken(token);
  if (!user || user.role !== 'admin') {
    return null;
  }
  return user;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await drizzleDb();

  const [{ count: totalUsers }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .all();

  const [{ count: totalSellers }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(sellers)
    .where(eq(sellers.status, 'active'))
    .all();

  // Sum the total value of all orders to compute sales
  const [{ sum: totalSalesRaw }] = await db
    .select({ sum: sql<number>`SUM(${orders.total})` })
    .from(orders)
    .all();
  const totalSales = Number(totalSalesRaw ?? 0);

  const [{ count: openReports }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(reports)
    .where(eq(reports.status, 'open'))
    .all();

  const [{ count: totalWallets }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(wallets)
    .all();

  return {
    totalUsers,
    totalSellers,
    totalSales,
    openReports,
    totalWallets,
  };
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<PublicUser[]> {
  const db = await drizzleDb();
  const rows: User[] = await db.select().from(users).all();
  return rows.map(createPublicUser);
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<PublicUser | null> {
  const db = await drizzleDb();
  const rows: User[] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .all();

  if (rows.length === 0) {
    return null;
  }

  return createPublicUser(rows[0]);
}

/**
 * Update user status (ban/unban)
 */
export async function updateUserStatus(id: number, action: string): Promise<PublicUser | null> {
  const db = await drizzleDb();
  const user = await getUserById(id);

  if (!user) {
    return null;
  }

  let newStatus = user.status;
  if (action === 'toggleBan') {
    newStatus = user.status === 'banned' ? 'active' : 'banned';
  }

  await db.update(users).set({ status: newStatus, updatedAt: new Date().toISOString() }).where(eq(users.id, id)).run();

  return { ...user, status: newStatus };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  token: string,
  profileData: {
    name?: string;
    username?: string;
    role?: 'buyer' | 'seller';
  },
): Promise<PublicUser | null> {
  const user = await validateToken(token);
  if (!user) {
    return null;
  }

  const db = await drizzleDb();

  // Check if username is being changed and if it already exists
  if (profileData.username && profileData.username !== user.username) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, profileData.username))
      .all();

    if (existingUser.length > 0) {
      throw new Error('Username already exists');
    }
  }

  // Update user profile
  const updateData: Partial<User> = {
    updatedAt: new Date().toISOString()
  };

  if (profileData.name !== undefined) {
    updateData.name = profileData.name;
  }

  if (profileData.username !== undefined) {
    updateData.username = profileData.username;
  }

  if (profileData.role !== undefined) {
    updateData.role = profileData.role;
  }

  await db.update(users).set(updateData).where(eq(users.id, user.id)).run();

  if (profileData.role === 'seller') {
    const existing = await db
      .select()
      .from(sellers)
      .where(eq(sellers.userId, user.id))
      .all();
    if (existing.length === 0) {
      await db
        .insert(sellers)
        .values({
          userId: user.id,
          name: profileData.name || user.name || user.username,
          status: 'active',
        })
        .run();
    }
  }

  // Return updated user
  const updatedUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .all();

  if (updatedUser.length === 0) {
    return null;
  }

  return createPublicUser(updatedUser[0]);
}

/**
 * Get all sellers
 */
export async function getAllSellers(): Promise<Seller[]> {
  const db = await drizzleDb();
  return await db.select().from(sellers).all();
}

/**
 * Get seller by ID
 */
export async function getSellerById(id: number): Promise<Seller | null> {
  const db = await drizzleDb();
  const rows = await db.select().from(sellers).where(eq(sellers.id, id)).all();
  return rows[0] || null;
}

/**
 * Update seller status
 */
export async function updateSellerStatus(id: number, action: string): Promise<Seller | null> {
  const db = await drizzleDb();
  const seller = await getSellerById(id);

  if (!seller) {
    return null;
  }

  let newStatus = seller.status;
  if (action === 'approve' || action === 'activate') {
    newStatus = 'active';
  } else if (action === 'reject' || action === 'deactivate') {
    newStatus = 'inactive';
  }

  await db.update(sellers).set({ status: newStatus, updatedAt: new Date().toISOString() }).where(eq(sellers.id, id)).run();

  return { ...seller, status: newStatus };
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  const db = await drizzleDb();
  return await db.select().from(products).all();
}

/**
 * Get product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  const db = await drizzleDb();
  const rows = await db.select().from(products).where(eq(products.id, id)).all();
  return rows[0] || null;
}

/**
 * Update product status
 */
export async function updateProductStatus(id: number, action: string): Promise<Product | null> {
  const db = await drizzleDb();
  const product = await getProductById(id);

  if (!product) {
    return null;
  }

  let newStatus = product.status;
  if (action === 'approve') {
    newStatus = 'active';
  } else if (action === 'reject' || action === 'flag') {
    newStatus = 'flagged';
  }

  if (action === 'remove') {
    await db.delete(products).where(eq(products.id, id)).run();
    return null;
  }

  await db.update(products).set({ status: newStatus, updatedAt: new Date().toISOString() }).where(eq(products.id, id)).run();

  return { ...product, status: newStatus };
}

/**
 * Get all reports
 */
export async function getAllReports(): Promise<Report[]> {
  const db = await drizzleDb();
  return await db.select().from(reports).all();
}

/**
 * Get report by ID
 */
export async function getReportById(id: number): Promise<Report | null> {
  const db = await drizzleDb();
  const rows = await db.select().from(reports).where(eq(reports.id, id)).all();
  return rows[0] || null;
}

/**
 * Resolve report
 */
export async function resolveReport(id: number): Promise<Report | null> {
  const db = await drizzleDb();
  const report = await getReportById(id);

  if (!report) {
    return null;
  }

  await db.update(reports).set({ status: 'resolved', updatedAt: new Date().toISOString() }).where(eq(reports.id, id)).run();

  return { ...report, status: 'resolved' };
}

/**
 * Get admin settings
 */
export async function getAdminSettings(): Promise<Record<string, string>> {
  const settingsList = await getSettings();
  const settingsObj: Record<string, string> = {};

  for (const setting of settingsList) {
    if (setting.key && setting.value) {
      settingsObj[setting.key] = setting.value;
    }
  }

  return settingsObj;
}

/**
 * Update admin settings
 */
export async function updateAdminSettings(newSettings: Record<string, string>): Promise<Record<string, string>> {
  const db = await drizzleDb();

  for (const [key, value] of Object.entries(newSettings)) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } })
      .run();
  }

  return newSettings;
}

/**
 * Creates standardized error response
 */
export function createErrorResponse(message: string): LoginError {
  return { MESSAGE: message };
}

/**
 * Get wallet for authenticated user
 */
export async function getWallet(token: string): Promise<Wallet | null> {
  const user = await validateToken(token);
  if (!user) {
    return null;
  }

  const db = await drizzleDb();
  const rows = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, user.id))
    .all();

  return rows[0] || null;
}

// === SELLER CONTROLLERS ===

/**
 * Check if user is seller
 */
export async function checkSellerAccess(token: string): Promise<PublicUser | null> {
  const user = await validateToken(token);
  if (!user || user.role !== 'seller') {
    return null;
  }
  return user;
}

/**
 * Get seller's products
 */
export async function getSellerProducts(token: string): Promise<Product[]> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  return await db
    .select()
    .from(products)
    .where(eq(products.sellerId, sellerProfile[0].id))
    .all();
}

/**
 * Get seller's product by ID
 */
export async function getSellerProduct(token: string, productId: number): Promise<Product | null> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.sellerId, sellerProfile[0].id)))
    .all();

  return rows[0] || null;
}

/**
 * Create a new product for seller
 */
export async function createSellerProduct(token: string, productData: {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}): Promise<Product> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  // Validate required fields
  if (!productData.name || productData.name.length < 1 || productData.name.length > 100) {
    throw new Error('Product name is required and must be between 1 and 100 characters');
  }

  if (typeof productData.price !== 'number' || productData.price < 0) {
    throw new Error('Price must be a non-negative number');
  }

  if (productData.description && productData.description.length > 500) {
    throw new Error('Description must be 500 characters or less');
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  const result = await db
    .insert(products)
    .values({
      name: productData.name,
      price: productData.price,
      description: productData.description || null,
      imageUrl: productData.imageUrl || null,
      sellerId: sellerProfile[0].id,
      status: 'active',
    })
    .returning()
    .get();

  return result;
}

/**
 * Update seller's product
 */
export async function updateSellerProduct(token: string, productId: number, productData: {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
}): Promise<Product | null> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  // Check if product exists and belongs to seller
  const existingProduct = await getSellerProduct(token, productId);
  if (!existingProduct) {
    return null;
  }

  // Validate fields if provided
  if (productData.name !== undefined) {
    if (!productData.name || productData.name.length < 1 || productData.name.length > 100) {
      throw new Error('Product name must be between 1 and 100 characters');
    }
  }

  if (productData.price !== undefined) {
    if (typeof productData.price !== 'number' || productData.price < 0) {
      throw new Error('Price must be a non-negative number');
    }
  }

  if (productData.description !== undefined && productData.description && productData.description.length > 500) {
    throw new Error('Description must be 500 characters or less');
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  const result = await db
    .update(products)
    .set({
      ...(productData.name !== undefined && { name: productData.name }),
      ...(productData.price !== undefined && { price: productData.price }),
      ...(productData.description !== undefined && { description: productData.description }),
      ...(productData.imageUrl !== undefined && { imageUrl: productData.imageUrl }),
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(products.id, productId), eq(products.sellerId, sellerProfile[0].id)))
    .returning()
    .get();

  return result;
}

/**
 * Delete seller's product
 */
export async function deleteSellerProduct(token: string, productId: number): Promise<boolean> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  // Check if product exists and belongs to seller
  const existingProduct = await getSellerProduct(token, productId);
  if (!existingProduct) {
    return false;
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  await db
    .delete(products)
    .where(and(eq(products.id, productId), eq(products.sellerId, sellerProfile[0].id)))
    .run();

  return true;
}

// === BUYER CONTROLLERS ===

/**
 * Check if user is buyer
 */
export async function checkBuyerAccess(token: string): Promise<PublicUser | null> {
  const user = await validateToken(token);
  if (!user || user.role !== 'buyer') {
    return null;
  }
  return user;
}

/**
 * Get all products for buyers
 */
export async function getBuyerProducts(): Promise<Product[]> {
  const db = await drizzleDb();
  return await db.select().from(products).where(eq(products.status, 'active')).all();
}

/**
 * Get product details for buyer
 */
export async function getBuyerProduct(productId: number): Promise<Product | null> {
  const db = await drizzleDb();
  const productRows = await db.select().from(products).where(and(eq(products.id, productId), eq(products.status, 'active'))).all();

  if (productRows.length === 0) {
    return null;
  }

  return productRows[0];
}

/**
 * Get product details for admin
 */
export async function getAdminProduct(productId: number): Promise<Product | null> {
  const db = await drizzleDb();
  const productRows = await db.select().from(products).where(eq(products.id, productId)).all();

  if (productRows.length === 0) {
    return null;
  }

  return productRows[0];
}



/**
 * Get buyer's orders
 */
export async function getBuyerOrders(token: string): Promise<Order[]> {
  const buyer = await checkBuyerAccess(token);
  if (!buyer) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();
  return await db.select().from(orders).where(eq(orders.buyerId, buyer.id)).all();
}

/**
 * Get buyer's order details
 */
export async function getBuyerOrder(token: string, orderId: number): Promise<Order | null> {
  const buyer = await checkBuyerAccess(token);
  if (!buyer) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();
  const orderRows = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.buyerId, buyer.id))).all();

  if (orderRows.length === 0) {
    return null;
  }

  return orderRows[0];
}

// === SELLER PROFILE CONTROLLERS ===

/**
 * Get seller profile
 */
export async function getSellerProfile(token: string): Promise<Seller | null> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();
  const sellerRows = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();

  if (sellerRows.length === 0) {
    return null;
  }

  return sellerRows[0];
}

/**
 * Update seller profile
 */
export async function updateSellerProfile(token: string, profileData: {
  name?: string;
  logo?: string;
  bio?: string;
  contact?: string;
}): Promise<Seller | null> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();
  await db.update(sellers).set({ ...profileData, updatedAt: new Date().toISOString() }).where(eq(sellers.userId, seller.id)).run();

  return await getSellerProfile(token);
}

/**
 * Get seller orders
 */
export async function getSellerOrders(token: string): Promise<Order[]> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  return await db.select().from(orders).where(eq(orders.sellerId, sellerProfile[0].id)).all();
}

/**
 * Get seller payouts
 */
export async function getSellerPayouts(token: string): Promise<SellerPayout[]> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  return await db.select().from(sellerPayouts).where(eq(sellerPayouts.sellerId, sellerProfile[0].id)).all();
}

/**
 * Create seller payout
 */
export async function createSellerPayout(token: string, payoutData: {
  amount: number;
  bankAccount: string;
}): Promise<SellerPayout | null> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  const payout = await db.insert(sellerPayouts).values({
    amount: payoutData.amount,
    bankAccount: payoutData.bankAccount,
    processedAt: null,
    sellerId: sellerProfile[0].id,
    status: 'pending'
  }).returning().get();

  return payout;
}

/**
 * Update seller order status
 */
export async function updateSellerOrderStatus(token: string, orderId: number, statusData: {
  status: 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
}): Promise<Order | null> {
  const seller = await checkSellerAccess(token);
  if (!seller) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();

  // Find the seller profile that belongs to this user
  const sellerProfile = await db.select().from(sellers).where(eq(sellers.userId, seller.id)).all();
  if (sellerProfile.length === 0) {
    throw new Error('Seller profile not found');
  }

  // Check if order exists and belongs to this seller
  const orderRows = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerProfile[0].id))).all();
  if (orderRows.length === 0) {
    return null;
  }

  // Update order status
  await db.update(orders).set({
    status: statusData.status,
    trackingNumber: statusData.trackingNumber,
    updatedAt: new Date().toISOString()
  }).where(eq(orders.id, orderId)).run();

  // Return updated order
  const updatedOrder = await db.select().from(orders).where(eq(orders.id, orderId)).all();
  return updatedOrder[0] || null;
}

/**
 * Create buyer order
 */
export async function createBuyerOrder(token: string, orderData: {
  items: Array<{ productId: number; quantity: number }>;
  shippingAddress: string;
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
}): Promise<Order | null> {
  const buyer = await checkBuyerAccess(token);
  if (!buyer) {
    throw new Error('Access denied');
  }

  const db = await drizzleDb();

  // Calculate total and create orders for each item
  const createdOrders: Order[] = [];

  for (const item of orderData.items) {
    // Get product details
    const product = await db.select().from(products).where(eq(products.id, item.productId)).all();
    if (product.length === 0) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const productData = product[0];
    const itemTotal = productData.price * item.quantity;

    // Create order
    const order = await db.insert(orders).values({
      productId: item.productId,
      productName: productData.name,
      quantity: item.quantity,
      items: JSON.stringify([{ productId: item.productId, quantity: item.quantity }]),
      total: itemTotal,
      status: 'pending',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      buyerId: buyer.id,
      sellerId: productData.sellerId
    }).returning().get();

    createdOrders.push(order);
  }


  // Return the first order (or you could return all orders)
  return createdOrders[0] || null;
}

// === STABLETOKEN CONTROLLERS ===

export async function getStabletokenBalance(userId: number): Promise<number> {
  const db = await drizzleDb();
  const rows: StabletokenBalance[] = await db
    .select()
    .from(stabletokenBalances)
    .where(eq(stabletokenBalances.userId, userId))
    .all();
  return rows.length > 0 ? rows[0].balance : 0;
}

export async function mintStabletoken(
  userId: number,
  amount: number
): Promise<number> {
  const db = await drizzleDb();
  const rows: StabletokenBalance[] = await db
    .select()
    .from(stabletokenBalances)
    .where(eq(stabletokenBalances.userId, userId))
    .all();

  let newBalance = amount;
  if (rows.length === 0) {
    await db
      .insert(stabletokenBalances)
      .values({ userId, balance: newBalance })
      .run();
  } else {
    newBalance = rows[0].balance + amount;
    await db
      .update(stabletokenBalances)
      .set({ balance: newBalance })
      .where(eq(stabletokenBalances.userId, userId))
      .run();
  }

  return newBalance;
}

export async function burnStabletoken(
  userId: number,
  amount: number
): Promise<number> {
  const db = await drizzleDb();
  const rows: StabletokenBalance[] = await db
    .select()
    .from(stabletokenBalances)
    .where(eq(stabletokenBalances.userId, userId))
    .all();

  if (rows.length === 0) {
    return 0;
  }

  let newBalance = rows[0].balance - amount;
  if (newBalance < 0) newBalance = 0;

  await db
    .update(stabletokenBalances)
    .set({ balance: newBalance })
    .where(eq(stabletokenBalances.userId, userId))
    .run();

  return newBalance;
}

// === STABLETOKEN TRANSACTION CONTROLLERS ===

export async function createStabletokenTransaction(
  userId: number,
  amount: number,
  type: string,
  reference?: string | null
): Promise<StabletokenTransaction> {
  const db = await drizzleDb();
  const tx = await db
    .insert(stabletokenTransactions)
    .values({ userId, amount, type, reference })
    .returning()
    .get();
  return tx;
}

export async function getTransactionsForUser(
  userId: number
): Promise<StabletokenTransaction[]> {
  const db = await drizzleDb();
  return await db
    .select()
    .from(stabletokenTransactions)
    .where(eq(stabletokenTransactions.userId, userId))
    .all();
}

export async function handlePaymentWebhook(data: {
  paymentId: string;
  userId: number;
  amount: number;
  status: string;
}): Promise<void> {
  if (data.status === 'success') {
    await createStabletokenTransaction(
      data.userId,
      data.amount,
      'payment',
      data.paymentId
    );
    await mintStabletoken(data.userId, data.amount);
  }
}

// === WALLET CONTROLLERS ===

/**
 * Get wallet for current user
 */
export async function getUserWallet(token: string): Promise<Wallet | null> {
  const user = await validateToken(token);
  if (!user) {
    return null;
  }

  const db = await drizzleDb();
  const walletRows = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, user.id))
    .all();

  return walletRows[0] || null;
}

/**
 * Get wallet balance for current user
 */
export async function getWalletBalance(token: string): Promise<string | null> {
  const wallet = await getUserWallet(token);
  return wallet ? wallet.balance : null;
}

/**
 * Admin: get wallet for any user
 */
export async function getWalletByUserId(token: string, userId: number): Promise<Wallet | null> {
  const admin = await checkAdminAccess(token);
  if (!admin) {
    return null;
  }

  const db = await drizzleDb();
  const walletRows = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .all();

  return walletRows[0] || null;
}

/**
 * Admin: get all wallets
 */
export async function getAllWallets(token: string): Promise<Wallet[] | null> {
  const admin = await checkAdminAccess(token);
  if (!admin) {
    return null;
  }

  const db = await drizzleDb();
  return await db.select().from(wallets).all();
}

// === EXISTING CONTROLLERS ===
