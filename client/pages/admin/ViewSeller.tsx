import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '@/lib/axios'
import type { Seller } from '@/server/schema'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ArrowLeft } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

function ViewSeller() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [targetAction, setTargetAction] = useState<
    'activate' | 'deactivate' | 'approve' | 'reject' | null
  >(null)

  const fetchSeller = useCallback(async () => {
    if (!id) return

    setLoading(true)
    try {
      const res = await axios.get<Seller>(`/api/admin/sellers/${id}`)
      setSeller(res.data)
    } catch (err) {
      console.error('Failed to load seller:', err)
      setError('Failed to load seller details')
    } finally {
      setLoading(false)
    }
  }, [id])

  const handleStatusUpdate = async (action: string) => {
    if (!seller) return

    try {
      await axios.patch(`/api/admin/sellers/${seller.id}`, { action })
      await fetchSeller() // Refresh the seller data
    } catch (err) {
      console.error('Failed to update seller status:', err)
      setError('Failed to update seller status')
    }
  }

  useEffect(() => {
    fetchSeller()
  }, [fetchSeller])

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>
  if (!seller) return <div>Seller not found.</div>

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/sellers')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sellers
          </Button>
          <h1 className="text-2xl font-bold">Seller Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {seller.name}
                <Badge
                  variant="secondary"
                  className={`rounded-full ${getStatusColor(seller.status || 'inactive')}`}
                >
                  {seller.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {seller.logo && (
                <div className="aspect-square w-32 overflow-hidden rounded-lg">
                  <img
                    src={seller.logo}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Seller ID:</span> {seller.id}
                </div>
                <div>
                  <span className="font-semibold">User ID:</span>{' '}
                  {seller.userId}
                </div>
                {seller.bio && (
                  <div>
                    <span className="font-semibold">Bio:</span>
                    <p className="mt-1 text-sm text-gray-600">{seller.bio}</p>
                  </div>
                )}
                {seller.contact && (
                  <div>
                    <span className="font-semibold">Contact:</span>
                    <p className="mt-1 text-sm text-gray-600">
                      {seller.contact}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {seller.status === 'pending' && (
                <>
                  <Button
                    className="w-full"
                    onClick={() => setTargetAction('approve')}
                  >
                    Approve Seller
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setTargetAction('reject')}
                  >
                    Reject Seller
                  </Button>
                </>
              )}

              {seller.status === 'active' && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setTargetAction('deactivate')}
                >
                  Deactivate Seller
                </Button>
              )}

              {seller.status === 'inactive' && (
                <Button
                  className="w-full"
                  onClick={() => setTargetAction('activate')}
                >
                  Activate Seller
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog
        open={!!targetAction}
        onOpenChange={(o) => !o && setTargetAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {targetAction
                ? `${targetAction.charAt(0).toUpperCase()}${targetAction.slice(1)}`
                : ''}{' '}
              seller?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (targetAction) handleStatusUpdate(targetAction)
                setTargetAction(null)
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ViewSeller
