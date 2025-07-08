import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/axios'
import * as Axios from 'axios'
import type { Product } from '@/types/Product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { DataTable } from '@/components/DataTable'
import { getColumns } from './products-columns'
import Footer from '@/components/Footer'

function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [detail, setDetail] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const categories = [
    'Makanan',
    'Minuman',
    'Camilan',
    'Elektronik',
    'Fashion',
    'Kesehatan',
    'Olahraga',
    'Kecantikan',
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    fetchProducts()
  }, [navigate])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get<Product[]>('/api/products')
      setProducts(res.data)
    } catch (err) {
      if (Axios.isAxiosError(err)) setError(err.message)
      else setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setName('')
    setDescription('')
    setPrice('')
    setCategory('')
    setSheetOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setName(p.name)
    setDescription(p.description)
    setPrice(p.price.toString())
    setCategory(p.category)
    setSheetOpen(true)
  }

  const openDetail = (p: Product) => {
    setDetail(p)
    setDetailOpen(true)
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
      category,
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
      if (Axios.isAxiosError(err)) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError('Failed to save product')
    }
  }

  const confirmDelete = (p: Product) => {
    setDeleteTarget(p)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await axios.delete(`/api/products/${deleteTarget.id}`)
      setProducts((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    } catch (err) {
      if (Axios.isAxiosError(err)) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError('Failed to delete product')
    } finally {
      setDeleteTarget(null)
    }
  }

  const columns = getColumns({
    onDetail: openDetail,
    onEdit: openEdit,
    onDelete: confirmDelete,
  })

  return (
    <div className="flex min-h-screen items-start justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Products</h2>
          <Button onClick={openAdd}>Add Product</Button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <DataTable
          columns={columns}
          data={products}
          isLoading={loading}
          filterColumnId="category"
          filterOptions={categories}
        />
        <Footer />
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="flex flex-col">
            <SheetHeader>
              <SheetTitle>
                {editing ? 'Edit Product' : 'Add Product'}
              </SheetTitle>
            </SheetHeader>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-4 flex-1 overflow-auto"
            >
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
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
        <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
          <SheetContent side="right" className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Product Detail</SheetTitle>
            </SheetHeader>
            {detail && (
              <div className="p-4 space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Name: </span>
                  {detail.name}
                </div>
                <div>
                  <span className="font-semibold">Description: </span>
                  {detail.description}
                </div>
                <div>
                  <span className="font-semibold">Category: </span>
                  {detail.category}
                </div>
                <div>
                  <span className="font-semibold">Price: </span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(detail.price)}
                </div>
                <div className="text-xs text-gray-500">
                  Created: {new Date(detail.createdAt).toLocaleString('id-ID')}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        >
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default Products
