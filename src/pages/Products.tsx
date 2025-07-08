import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import type { Product } from '../types/Product'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '../components/ui/sheet'
import Footer from '../components/Footer'

function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    fetchProducts()
  }, [navigate])

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>('/api/products')
      setProducts(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.message)
      else setError('Failed to load products')
    }
  }

  const openAdd = () => {
    setEditing(null)
    setName('')
    setDescription('')
    setPrice('')
    setSheetOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setName(p.name)
    setDescription(p.description)
    setPrice(p.price.toString())
    setSheetOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !price) {
      setError('All fields are required')
      return
    }
    setError(null)
    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
    }
    try {
      if (editing) {
        const res = await axios.put<Product>(
          `/api/products/${editing.id}`,
          payload
        )
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? res.data : p))
        )
      } else {
        const res = await axios.post<Product>('/api/products', payload)
        setProducts((prev) => [...prev, res.data])
      }
      setSheetOpen(false)
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError('Failed to save product')
    }
  }

  const handleDelete = async (p: Product) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`/api/products/${p.id}`)
      setProducts((prev) => prev.filter((item) => item.id !== p.id))
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError('Failed to delete product')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={openAdd}>Add Product</Button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-3 py-2 border-b text-left">Name</th>
              <th className="px-3 py-2 border-b text-left">Description</th>
              <th className="px-3 py-2 border-b text-left">Price (IDR)</th>
              <th className="px-3 py-2 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.description}</td>
                <td className="px-3 py-2">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(product.price)}
                </td>
                <td className="px-3 py-2 space-x-2 text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>{editing ? 'Edit Product' : 'Add Product'}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 flex-1 overflow-auto">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price (IDR)</Label>
              <Input
                id="price"
                type="number"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 15000"
                required
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <SheetFooter className="mt-auto">
              <SheetClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Products
