import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import axios, { isAxiosError } from '@/lib/axios'
import type { SellerProduct } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { formatIDR } from '@/lib/utils'
import { sellerProductsRefreshAtom } from '@/atoms/sellerAtoms'

function MyProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshCounter] = useAtom(sellerProductsRefreshAtom)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<SellerProduct[]>('/api/seller/products')
      setProducts(res.data)
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await axios.delete(`/api/seller/products/${productId}`)
      await fetchData()
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to delete product')
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshCounter])

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Products</CardTitle>
        <Button onClick={() => navigate('/seller/add-product')}>
          Create Product
        </Button>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products yet. Create your first product!
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatIDR(product.price)}
                  </p>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/seller/view-product/${product.id}`)
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/seller/edit-product/${product.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MyProducts
