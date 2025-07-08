import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../lib/axios'
import * as Axios from 'axios'
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
  const [loading, setLoading] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [detail, setDetail] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('name')
  const [page, setPage] = useState(1)
  const pageSize = 10
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

  const handleDelete = async (p: Product) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`/api/products/${p.id}`)
      setProducts((prev) => prev.filter((item) => item.id !== p.id))
    } catch (err) {
      if (Axios.isAxiosError(err)) setError(err.message)
      else if (err instanceof Error) setError(err.message)
      else setError('Failed to delete product')
    }
  }

  const filteredProducts = useMemo(() => {
    let data = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    if (filterCategory) {
      data = data.filter((p) => p.category === filterCategory)
    }
    if (minPrice) {
      data = data.filter((p) => p.price >= Number(minPrice))
    }
    if (maxPrice) {
      data = data.filter((p) => p.price <= Number(maxPrice))
    }
    switch (sort) {
      case 'priceAsc':
        data.sort((a, b) => a.price - b.price)
        break
      case 'priceDesc':
        data.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      default:
        data.sort((a, b) => a.name.localeCompare(b.name))
    }
    return data
  }, [products, search, filterCategory, minPrice, maxPrice, sort])

  const totalPages = Math.ceil(filteredProducts.length / pageSize)
  const paginated = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={openAdd}>Add Product</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="max-w-xs"
        />
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value)
            setPage(1)
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value)
            setPage(1)
          }}
          className="w-24"
        />
        <Input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value)
            setPage(1)
          }}
          className="w-24"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="name">Name A-Z</option>
          <option value="priceAsc">Price Low-High</option>
          <option value="priceDesc">Price High-Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 border-b text-left">Name</th>
              <th className="px-3 py-2 border-b text-left">Description</th>
              <th className="px-3 py-2 border-b text-left">Category</th>
              <th className="px-3 py-2 border-b text-left">Price (IDR)</th>
              <th className="px-3 py-2 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading &&
              paginated.map((product) => (
                <tr
                  key={product.id}
                  className="border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => openDetail(product)}
                >
                  <td className="px-3 py-2">{product.name}</td>
                  <td className="px-3 py-2">{product.description}</td>
                  <td className="px-3 py-2">{product.category}</td>
                  <td className="px-3 py-2">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(product.price)}
                  </td>
                  <td
                    className="px-3 py-2 space-x-2 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
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
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`px-2 py-1 border rounded ${
              n === page ? 'bg-gray-200' : ''
            }`}
            onClick={() => setPage(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <Footer />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>{editing ? 'Edit Product' : 'Add Product'}</SheetTitle>
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
    </div>
  )
}

export default Products
