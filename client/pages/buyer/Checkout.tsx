import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { cartAtom } from '@/atoms/cartAtoms'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from '@/lib/axios'

function Checkout() {
  const cart = useAtomValue(cartAtom)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const items = cart.map(item => ({ productId: item.product.id, quantity: item.quantity }))
      // For demo, use a static shipping address and payment method
      await axios.post('/api/buyer/orders', {
        items,
        shippingAddress: '123 Main St, City, Country',
        paymentMethod: 'credit_card',
      })
      // Optionally, redirect or show success
      window.location.hash = '/orders'
    } catch {
      setError('Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  if (!cart.length) {
    return <div>Your cart is empty.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.product.name}</span>
              <span>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(total)}
              </span>
            </div>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <Button onClick={handleCheckout} disabled={loading} className="w-full">
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Checkout
