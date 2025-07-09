import { useNavigate } from 'react-router-dom'
import ProductForm, { ProductFormValues } from '@/components/ProductForm'
import axios from '@/lib/axios'

function AddProduct() {
  const navigate = useNavigate()

  const handleSubmit = async (values: ProductFormValues) => {
    await axios.post('/api/seller/products', values)
    navigate('/seller/products', { replace: true })
  }

  return <ProductForm onSubmit={handleSubmit} />
}

export default AddProduct
