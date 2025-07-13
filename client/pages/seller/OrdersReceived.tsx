import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { isAxiosError } from '@/lib/axios'
import type { Order } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function OrdersReceived() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<Order[]>('/api/seller/orders')
      setOrders(res.data)
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (_order: Order, _action: string) => {
    try {
      // Note: This endpoint is not yet implemented in the backend
      // await axios.patch(`/api/seller/orders/${order.id}`, { action })
      // await fetchData()
      setError('Update Order Status API not yet implemented in backend')
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to update order status')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!orders.length) return <div>No orders yet.</div>

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>{order.productName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Quantity: {order.quantity}</div>
            <div>Total: {order.total}</div>
            <div>Status: {order.status}</div>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleUpdateStatus(order, 'ship')}>
                Mark as Shipped
              </Button>
              <Button onClick={() => handleUpdateStatus(order, 'deliver')}>
                Mark as Delivered
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default OrdersReceived
