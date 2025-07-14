import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '@/lib/axios'
import { isAxiosError } from '@/lib/axios'
import type { Product } from '@/types/Product'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSetAtom, useAtom } from 'jotai'
import { addToCartAtom, cartAtom } from '@/atoms/cartAtoms'
import SectionTitle from '@/components/SectionTitle'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const add = useSetAtom(addToCartAtom)
  const [cart] = useAtom(cartAtom)
  const [confirmAdd, setConfirmAdd] = useState(false)

  const fetchData = async (idval: string | null) => {
    if (!idval) return

    setLoading(true)
    try {
      const res = await axios.get<Product>(`/api/buyer/products/${idval}`)
      setProduct(res.data)
    } catch (err) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchData(id)
    }
  }, [id])

  const handleAddToCart = async () => {
    if (product) {
      try {
        // Check if product already exists in cart before adding
        const existingItem = cart.find((item) => item.productId === product.id)

        await add(product)

        if (existingItem) {
          toast.success(`${product.name} quantity updated in cart!`)
        } else {
          toast.success(`${product.name} added to cart!`)
        }
      } catch {
        toast.error('Failed to add item to cart')
      }
    }
  }

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>
  if (!product) return <div>Product not found.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/catalog')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Button>
        <SectionTitle>{product.name}</SectionTitle>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Price</h3>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(product.price)}
              </p>
            </div>

            <Button onClick={() => setConfirmAdd(true)} className="w-full">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        open={confirmAdd}
        onOpenChange={(o) => !o && setConfirmAdd(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add this item to cart?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleAddToCart()
                setConfirmAdd(false)
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ProductDetail
