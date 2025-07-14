import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import axios from '@/lib/axios'
import type { SellerProduct, Order } from '@/types/Seller'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { formatIDR } from '@/lib/utils'
import { sellerProductsRefreshAtom } from '@/atoms/sellerAtoms'

function SellerDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshCounter] = useAtom(sellerProductsRefreshAtom)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch seller products from the API
      const productsRes = await axios.get<SellerProduct[]>(
        '/api/seller/products'
      )
      setProducts(productsRes.data)
      // Fetch seller orders from the API
      const ordersRes = await axios.get<Order[]>('/api/seller/orders')
      setOrders(ordersRes.data)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = () => {
    navigate('/seller/add-product')
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await axios.delete(`/api/seller/products/${productId}`)
      // Refresh the product list
      await fetchData()
    } catch (err) {
      console.error('Failed to delete product:', err)
      setError('Failed to delete product')
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshCounter]) // Refresh when the counter changes

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-muted-foreground">Total products</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Total orders</div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Products</CardTitle>
          <Button onClick={handleCreateProduct}>Create Product</Button>
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
                      onClick={() => handleDeleteProduct(product.id)}
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
    </div>
  )
}

export default SellerDashboard
