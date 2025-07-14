import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import type { SellerPayout } from '@/types/Seller'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, DollarSign, X } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

function Payouts() {
  const [payouts, setPayouts] = useState<SellerPayout[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<SellerPayout[]>('/api/seller/payouts')
      setPayouts(res.data)
      setError(null)
    } catch (err) {
      console.error('Failed to load payouts:', err)
      setError('Failed to load payouts')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRequestLoading(true)
    setRequestError(null)

    const formData = new FormData(e.currentTarget)
    const amount = Number(formData.get('amount'))
    const bankAccount = formData.get('bankAccount') as string

    try {
      await axios.post('/api/seller/payouts', {
        amount,
        bankAccount,
      })

      // Refresh the payouts list
      await fetchData()
      setIsRequestModalOpen(false)

      // Reset form
      e.currentTarget.reset()
    } catch (err) {
      console.error('Failed to request payout:', err)
      setRequestError('Failed to request payout')
    } finally {
      setRequestLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payouts</h2>
        <Button onClick={() => setIsRequestModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Request Payout Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request New Payout</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRequestModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="bankAccount">Bank Account Details</Label>
                <Textarea
                  id="bankAccount"
                  name="bankAccount"
                  required
                  placeholder="Enter your bank account information"
                  rows={3}
                />
              </div>
              {requestError && (
                <div className="text-red-600 text-sm">{requestError}</div>
              )}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={requestLoading}
                  className="flex-1"
                >
                  {requestLoading ? 'Requesting...' : 'Request Payout'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRequestModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!payouts.length ? (
        <div className="text-center py-8 text-gray-500">
          <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No payouts yet.</p>
          <p className="text-sm">Request your first payout to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {payouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Payout #{payout.id}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status || 'pending')}`}
                  >
                    {payout.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Amount:</span>
                    <p className="text-lg font-bold text-green-600">
                      ${payout.amount?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span>
                    <p className="text-sm text-gray-600">
                      {payout.date
                        ? new Date(payout.date).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  {payout.createdAt && (
                    <div className="col-span-2">
                      <span className="font-semibold">Created:</span>
                      <p className="text-sm text-gray-600">
                        {new Date(payout.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Payouts
