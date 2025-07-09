import { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '@/types/Product'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  add: (product: Product, qty?: number) => void
  remove: (id: number) => void
  update: (id: number, qty: number) => void
  clear: () => void
  total: number
}

const CartContext = createContext<CartContextType>({
  items: [],

  add: () => {},

  remove: () => {},

  update: () => {},
  clear: () => {},
  total: 0,
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const add = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { product, quantity: qty }]
    })
  }

  const remove = (id: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== id))
  }

  const update = (id: number, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i))
    )
  }

  const clear = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
