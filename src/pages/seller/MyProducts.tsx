import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/axios'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import type { SellerProduct } from '@/types/Seller'

function MyProducts() {
  const [data, setData] = useState<SellerProduct[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<SellerProduct[]>('/api/seller/products')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteProduct = async (p: SellerProduct) => {
    await axios.delete(`/api/seller/products/${p.id}`)
    fetchData()
  }

  const columns: ColumnDef<SellerProduct>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { widthClass: 'w-40', cellClass: 'truncate' },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      meta: { widthClass: 'hidden md:table-cell w-32', cellClass: 'truncate' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex gap-1 justify-end">
            <Button
              size="sm"
              onClick={() => navigate(`/seller/products/${p.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteProduct(p)}
            >
              Delete
            </Button>
          </div>
        )
      },
      enableSorting: false,
      meta: { widthClass: 'w-40' },
    },
  ]

  return (
    <div className="space-y-4">
      <Button onClick={() => navigate('/seller/products/new')}>
        Add Product
      </Button>
      <DataTable columns={columns} data={data} isLoading={loading} />
    </div>
  )
}

export default MyProducts
