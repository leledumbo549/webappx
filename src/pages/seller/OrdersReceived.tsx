import { useEffect, useState } from 'react'
// import axios from '@/lib/axios'
import type { SellerOrder } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function OrdersReceived() {
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // TODO: This endpoint is not defined in OpenAPI spec yet
      // const res = await axios.get<SellerOrder[]>('/api/seller/orders')
      // setOrders(res.data)
      
      // Placeholder data until API is defined
      setOrders([])
      setError('Seller Orders API not yet implemented in OpenAPI spec')
    } catch (err) {
      console.error('Failed to load orders:', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateStatus = async (_order: SellerOrder, _action: string) => {
    try {
      // TODO: This endpoint is not defined in OpenAPI spec yet
      // await axios.patch(`/api/seller/orders/${order.id}`, { action })
      // await fetchData()
      
      setError('Update Order Status API not yet implemented in OpenAPI spec')
    } catch (err) {
      console.error('Failed to update order status:', err)
      setError('Failed to update order status')
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
