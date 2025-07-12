import { useEffect, useState } from 'react'
// import axios from '@/lib/axios'
import type { SellerPayout } from '@/types/Seller'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Payouts() {
  const [payouts, setPayouts] = useState<SellerPayout[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // TODO: This endpoint is not defined in OpenAPI spec yet
      // const res = await axios.get<SellerPayout[]>('/api/seller/payouts')
      // setPayouts(res.data)
      
      // Placeholder data until API is defined
      setPayouts([])
      setError('Seller Payouts API not yet implemented in OpenAPI spec')
    } catch (err) {
      console.error('Failed to load payouts:', err)
      setError('Failed to load payouts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!payouts.length) return <div>No payouts yet.</div>

  return (
    <div className="space-y-4">
      {payouts.map((payout) => (
        <Card key={payout.id}>
          <CardHeader>
            <CardTitle>Payout #{payout.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Amount: {payout.amount}</div>
            <div>Date: {payout.date}</div>
            <div>Status: {payout.status}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Payouts
