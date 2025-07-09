import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const { items, total, clear } = useCart()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.post('/api/orders', {
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
      total,
      status: 'processing',
      createdAt: new Date().toISOString(),
    })
    clear()
    navigate('/buyer/orders')
  }

  if (!items.length) return <div>Your cart is empty.</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div className="font-semibold">
        Total:{' '}
        {new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(total)}
      </div>
      <Button type="submit">Place Order</Button>
    </form>
  )
}

export default Checkout
