export type UserRole = 'buyer' | 'seller' | 'admin'

export interface AdminUser {
  id: number
  name: string
  role: UserRole
  status: 'active' | 'banned'
}

export interface AdminSeller {
  id: number
  name: string
  status: 'pending' | 'active' | 'inactive'
}

export interface AdminProduct {
  id: number
  name: string
  price: number
  status: 'pending' | 'active' | 'flagged'
}

export interface AdminReport {
  id: number
  message: string
  status: 'open' | 'closed'
}

export interface AdminSettings {
  fees: number
  payoutDelay: number
}
