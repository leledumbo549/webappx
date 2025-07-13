import { atom } from 'jotai'
import axios from '@/lib/axios'
import type { Product } from '@/server/schema'

// Backend CartItem interface
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
}

// Frontend CartItem with product details
export interface CartItemWithProduct {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product;
}

// The main cart atom - now fetches from API
export const cartAtom = atom<CartItemWithProduct[]>([])

// Derived atom for total
export const cartTotalAtom = atom((get) =>
  get(cartAtom).reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
)

// Load cart from API
export const loadCartAtom = atom(
  null,
  async (_get, set) => {
    try {
      const res = await axios.get<CartItem[]>('/api/buyer/cart')
      const cartItems = res.data
      
      // Fetch product details for each cart item
      const cartWithProducts: CartItemWithProduct[] = await Promise.all(
        cartItems.map(async (item) => {
          const productRes = await axios.get<Product>(`/api/buyer/product/${item.productId}`)
          return {
            ...item,
            product: productRes.data
          }
        })
      )
      
      set(cartAtom, cartWithProducts)
    } catch (error) {
      console.error('Failed to load cart:', error)
      set(cartAtom, [])
    }
  }
)

// Add item to cart via API
export const addToCartAtom = atom(
  null,
  async (get, set, product: Product) => {
    try {
      const currentCart = get(cartAtom)
      const existingItem = currentCart.find(item => item.productId === product.id)
      
      if (existingItem) {
        // Item exists, increment quantity
        await axios.patch(`/api/buyer/cart/${product.id}`, { 
          quantity: existingItem.quantity + 1 
        })
      } else {
        // Item doesn't exist, add new item
        await axios.post('/api/buyer/cart', {
          productId: product.id,
          quantity: 1
        })
      }
      
      // Reload cart after adding item
      const res = await axios.get<CartItem[]>('/api/buyer/cart')
      const cartItems = res.data
      
      // Fetch product details for each cart item
      const cartWithProducts: CartItemWithProduct[] = await Promise.all(
        cartItems.map(async (item) => {
          const productRes = await axios.get<Product>(`/api/buyer/product/${item.productId}`)
          return {
            ...item,
            product: productRes.data
          }
        })
      )
      
      set(cartAtom, cartWithProducts)
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    }
  }
)

// Remove item from cart via API
export const removeFromCartAtom = atom(
  null,
  async (_get, set, productId: number) => {
    try {
      await axios.delete(`/api/buyer/cart/${productId}`)
      
      // Reload cart after removing item
      const res = await axios.get<CartItem[]>('/api/buyer/cart')
      const cartItems = res.data
      
      // Fetch product details for each cart item
      const cartWithProducts: CartItemWithProduct[] = await Promise.all(
        cartItems.map(async (item) => {
          const productRes = await axios.get<Product>(`/api/buyer/product/${item.productId}`)
          return {
            ...item,
            product: productRes.data
          }
        })
      )
      
      set(cartAtom, cartWithProducts)
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
    }
  }
)

// Update cart item quantity via API
export const updateCartQuantityAtom = atom(
  null,
  async (_get, set, { productId, quantity }: { productId: number, quantity: number }) => {
    try {
      if (quantity <= 0) {
        await axios.delete(`/api/buyer/cart/${productId}`)
      } else {
        await axios.patch(`/api/buyer/cart/${productId}`, { quantity })
      }
      
      // Reload cart after updating
      const res = await axios.get<CartItem[]>('/api/buyer/cart')
      const cartItems = res.data
      
      // Fetch product details for each cart item
      const cartWithProducts: CartItemWithProduct[] = await Promise.all(
        cartItems.map(async (item) => {
          const productRes = await axios.get<Product>(`/api/buyer/product/${item.productId}`)
          return {
            ...item,
            product: productRes.data
          }
        })
      )
      
      set(cartAtom, cartWithProducts)
    } catch (error) {
      console.error('Failed to update cart item:', error)
    }
  }
)

// Clear cart
export const clearCartAtom = atom(
  null,
  async (_get, set) => {
    try {
      // Get current cart items
      const res = await axios.get<CartItem[]>('/api/buyer/cart')
      const cartItems = res.data
      
      // Remove all items
      await Promise.all(
        cartItems.map(item => axios.delete(`/api/buyer/cart/${item.productId}`))
      )
      
      set(cartAtom, [])
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }
) 