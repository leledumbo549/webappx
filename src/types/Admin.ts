// Import Admin types from schema.ts as the single source of truth
export type { AdminUser, AdminSeller, AdminProduct, AdminReport } from '@/server/schema';

// AdminSettings interface for site settings
export interface AdminSettings {
  fees: number
  payoutDelay: number
}

// UserRole type for role management
export type UserRole = 'buyer' | 'seller' | 'admin'; 