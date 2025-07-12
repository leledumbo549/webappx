import { useAtom, useSetAtom } from 'jotai'
import { cartAtom, removeFromCartAtom, updateCartQuantityAtom, cartTotalAtom } from '@/atoms/cartAtoms'
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
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) return <Skeleton className="h-20" />

  if (!items.length) return <div>Your cart is empty.</div>

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.product.id}
          product={item.product}
          quantity={item.quantity}
          onRemove={() => remove(item.product.id)}
          onChange={(q) => update({ productId: item.product.id, quantity: q })}
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
