import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '@/lib/axios'
import type { SellerProduct } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

function ViewProduct() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<SellerProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    try {
      const res = await axios.get<SellerProduct>(`/api/seller/products/${id}`)
      setProduct(res.data)
    } catch (err) {
      console.error('Failed to load product:', err)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!product) return <div>Product not found.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/seller/edit-product/${product.id}`)}
          >
            Edit Product
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/seller/products')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Products
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Price</h3>
              <p className="text-lg font-bold">${product.price}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
              <p className="text-sm">{product.status}</p>
            </div>
          </div>
          
          {product.description && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Description</h3>
              <p className="text-sm">{product.description}</p>
            </div>
          )}
          
          {product.imageUrl && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Image</h3>
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ViewProduct 