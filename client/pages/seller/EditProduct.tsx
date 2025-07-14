import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import axios from '@/lib/axios'
import type { SellerProduct } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { refreshSellerProductsAtom } from '@/atoms/sellerAtoms'

function EditProduct() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const refreshProducts = useSetAtom(refreshSellerProductsAtom)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!product) return

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const productData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      imageUrl: (formData.get('imageUrl') as string) || undefined,
    }

    try {
      await axios.put(`/api/seller/products/${id}`, productData)
      // Trigger refresh of product list
      refreshProducts()
      navigate('/seller/products')
    } catch (err: unknown) {
      console.error('Failed to update product:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update product'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  if (loading && !product) return <Spinner />
  if (error && !product) return <div className="text-red-600">{error}</div>
  if (!product) return <div>Product not found.</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" defaultValue={product.name} required />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product.price}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product.description || ''}
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={product.imageUrl || ''}
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/seller/products')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditProduct
