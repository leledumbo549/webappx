import { useAtom, useSetAtom } from 'jotai'
import { cartAtom, removeFromCartAtom, updateCartQuantityAtom, cartTotalAtom, loadCartAtom } from '@/atoms/cartAtoms'
import CartItem from '@/components/CartItem'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

function Cart() {
  const [items] = useAtom(cartAtom)
  const total = useAtom(cartTotalAtom)[0]
  const remove = useSetAtom(removeFromCartAtom)
  const update = useSetAtom(updateCartQuantityAtom)
  const loadCart = useSetAtom(loadCartAtom)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true)
      try {
        await loadCart()
      } catch (error) {
        console.error('Failed to load cart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [loadCart])

  if (loading) return <Skeleton className="h-20" />

  if (!items.length) return <div>Your cart is empty.</div>

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          product={item.product}
          quantity={item.quantity}
          onRemove={() => remove(item.productId)}
          onChange={(q) => update({ productId: item.productId, quantity: q })}
        />
      ))}
      <div className="font-semibold">
        Total:{' '}
        {new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(total)}
      </div>
      <Button onClick={() => navigate('/buyer/checkout')}>Checkout</Button>
    </div>
  )
}

export default Cart
