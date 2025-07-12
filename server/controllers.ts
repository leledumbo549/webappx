// server/controllers.ts
// Controllers for all API endpoints using drizzle and db.ts

import type { User, PublicUser, Product, Seller, Report, Setting, DashboardStats } from './schema';
import { drizzleDb } from './db';
import { users, sellers, products, reports, settings } from './schema';
import { and, eq, sql } from 'drizzle-orm';

// === AUTHENTICATION CONTROLLERS ===

export interface LoginRequest {
  username: string;
  password: string;
}

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
 * Validates login request data
 */
export function validateLoginRequest(data: unknown): LoginRequest | LoginError {
  if (!data || typeof data !== 'object') {
    return { MESSAGE: 'Invalid request body' };
  }

  const { username, password } = data as LoginRequest;

  if (!username || typeof username !== 'string') {
    return { MESSAGE: 'Username is required' };
  }

  if (username.length < 1 || username.length > 50) {
    return { MESSAGE: 'Username must be between 1 and 50 characters' };
  }

  if (!password || typeof password !== 'string') {
    return { MESSAGE: 'Password is required' };
  }

  if (password.length < 1 || password.length > 100) {
    return { MESSAGE: 'Password must be between 1 and 100 characters' };
  }

  return { username, password };
}

/**
 * Creates a PublicUser object from User (removes password)
 */
 
export function createPublicUser(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...publicUser } = user;
  return publicUser;
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

/**
 * Creates login response with token and user data
 */
export async function loginByUsernamePassword(data: LoginRequest | unknown): Promise<LoginResponse | LoginError> {
  // Validate request
  const validation = validateLoginRequest(data);
  if ('MESSAGE' in validation) return validation;

   
  const { username, password } = validation;
  const db = await drizzleDb();

  // Find user in DB
  const rows: User[] = await db
    .select()
    .from(users)
    .where(and(eq(users.username, username), eq(users.password, password)))
    .all();

  if (rows.length === 0) {
    return { MESSAGE: 'Invalid username or password' };
  }

  const user = rows[0];
  const token = generateToken(user.id);
  const publicUser = createPublicUser(user);
  // For demo, use current time for createdAt/updatedAt
  const now = new Date().toISOString();
  return {
    token,
    user: {
      ...publicUser,
      createdAt: now,
      updatedAt: now,
    },
  };
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

  const [{ count: productCount }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products)
    .all();

  const [{ count: openReports }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(reports)
    .where(eq(reports.status, 'open'))
    .all();

  return {
    totalUsers,
    totalSellers,
    totalSales: Number(productCount) * 10, // Demo calculation
    openReports,
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
  
  await db.update(users).set({ status: newStatus }).where(eq(users.id, id)).run();
  
  return { ...user, status: newStatus };
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
  
  await db.update(sellers).set({ status: newStatus }).where(eq(sellers.id, id)).run();
  
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
  
  await db.update(products).set({ status: newStatus }).where(eq(products.id, id)).run();
  
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
  
  await db.update(reports).set({ status: 'resolved' }).where(eq(reports.id, id)).run();
  
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
  return await db
    .select()
    .from(products)
    .where(eq(products.sellerId, seller.id))
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
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.sellerId, seller.id)))
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
  const result = await db
    .insert(products)
    .values({
      name: productData.name,
      price: productData.price,
      description: productData.description || null,
      imageUrl: productData.imageUrl || null,
      sellerId: seller.id,
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
  const result = await db
    .update(products)
    .set({
      ...(productData.name !== undefined && { name: productData.name }),
      ...(productData.price !== undefined && { price: productData.price }),
      ...(productData.description !== undefined && { description: productData.description }),
      ...(productData.imageUrl !== undefined && { imageUrl: productData.imageUrl }),
    })
    .where(and(eq(products.id, productId), eq(products.sellerId, seller.id)))
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
  await db
    .delete(products)
    .where(and(eq(products.id, productId), eq(products.sellerId, seller.id)))
    .run();

  return true;
}

// === EXISTING CONTROLLERS ===