import { atom } from 'jotai'
import type { Product } from '@/server/schema'

export interface CartItem {
  product: Product
  quantity: number
}

// The main cart atom
export const cartAtom = atom<CartItem[]>([])

// Derived atom for total
export const cartTotalAtom = atom((get) =>
  get(cartAtom).reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
)

// Write-only atoms for actions
export const addToCartAtom = atom(null, (get, set, product: Product) => {
  const items = get(cartAtom)
  const existing = items.find((item) => item.product.id === product.id)
  if (existing) {
    set(cartAtom, items.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ))
  } else {
    set(cartAtom, [...items, { product, quantity: 1 }])
  }
})

export const removeFromCartAtom = atom(null, (get, set, productId: number) => {
  set(cartAtom, get(cartAtom).filter((item) => item.product.id !== productId))
})

export const updateCartQuantityAtom = atom(null, (get, set, { productId, quantity }: { productId: number, quantity: number }) => {
  if (quantity <= 0) {
    set(cartAtom, get(cartAtom).filter((item) => item.product.id !== productId))
    return
  }
  set(cartAtom, get(cartAtom).map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  ))
})

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartAtom, [])
}) 