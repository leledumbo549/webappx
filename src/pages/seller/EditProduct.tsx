import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm, { ProductFormValues } from '@/components/ProductForm'
import axios from '@/lib/axios'
import type { SellerProduct } from '@/types/Seller'

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<SellerProduct | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get<SellerProduct>(`/api/seller/products/${id}`)
      setProduct(res.data)
    }
    fetchProduct()
  }, [id])

  const handleSubmit = async (values: ProductFormValues) => {
    await axios.put(`/api/seller/products/${id}`, values)
    navigate('/seller/products', { replace: true })
  }

  if (!product) return <div>Loading...</div>

  return <ProductForm initialValues={product} onSubmit={handleSubmit} />
}

export default EditProduct
