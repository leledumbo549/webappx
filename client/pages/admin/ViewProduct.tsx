import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '@/lib/axios'
import type { Product } from '@/types/Product'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { formatIDR } from '@/lib/utils'

function ViewProduct() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [targetAction, setTargetAction] = useState<
    'approve' | 'reject' | 'flag' | 'remove' | 'unflag' | null
  >(null)

  const fetchProduct = useCallback(async () => {
    if (!id) return

    setLoading(true)
    try {
      const res = await axios.get<Product>(`/api/admin/products/${id}`)
      setProduct(res.data)
    } catch (err) {
      console.error('Failed to load product:', err)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }, [id])

  const handleStatusUpdate = async (action: string) => {
    if (!product) return

    try {
      await axios.patch(`/api/admin/products/${product.id}`, { action })
      await fetchProduct() // Refresh the product data
    } catch (err) {
      console.error('Failed to update product status:', err)
      setError('Failed to update product status')
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>
  if (!product) return <div>Product not found.</div>

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'flagged':
        return 'bg-red-100 text-red-800'
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
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-2xl font-bold">Product Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {product.name}
                <Badge
                  variant="secondary"
                  className={`rounded-full ${getStatusColor(product.status || 'inactive')}`}
                >
                  {product.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.imageUrl && (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Price:</span>{' '}
                  {formatIDR(product.price)}
                </div>
                <div>
                  <span className="font-semibold">Seller ID:</span>{' '}
                  {product.sellerId}
                </div>
                {product.description && (
                  <div>
                    <span className="font-semibold">Description:</span>
                    <p className="mt-1 text-sm text-gray-600">
                      {product.description}
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
              {product.status === 'pending' && (
                <>
                  <Button
                    className="w-full"
                    onClick={() => setTargetAction('approve')}
                  >
                    Approve Product
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setTargetAction('reject')}
                  >
                    Reject Product
                  </Button>
                </>
              )}

              {product.status === 'active' && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setTargetAction('flag')}
                  >
                    Flag Product
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setTargetAction('remove')}
                  >
                    Remove Product
                  </Button>
                </>
              )}

              {product.status === 'flagged' && (
                <>
                  <Button
                    className="w-full"
                    onClick={() => setTargetAction('unflag')}
                  >
                    Unflag Product
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setTargetAction('remove')}
                  >
                    Remove Product
                  </Button>
                </>
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
              {(() => {
                if (!targetAction) return ''
                const label =
                  targetAction === 'unflag'
                    ? 'Unflag'
                    : targetAction.charAt(0).toUpperCase() +
                      targetAction.slice(1)
                return `${label} product?`
              })()}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (targetAction)
                  handleStatusUpdate(
                    targetAction === 'unflag' ? 'approve' : targetAction
                  )
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

export default ViewProduct
