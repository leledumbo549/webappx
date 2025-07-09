export interface SellerProduct {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
}

export interface SellerOrder {
  id: number
  productId: number
  productName: string
  quantity: number
  total: number
  status: 'pending' | 'shipped' | 'delivered'
}

export interface SellerPayout {
  id: number
  amount: number
  date: string
}

export interface SellerProfile {
  name: string
  logo: string
  bio: string
  contact: string
}
