import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminProduct } from '@/types/Admin'

function ManageProducts() {
  const [data, setData] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<AdminProduct[]>('/api/admin/products')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateStatus = async (p: AdminProduct, action: string) => {
    await axios.patch(`/api/admin/products/${p.id}`, { action })
    fetchData()
  }

  const columns: ColumnDef<AdminProduct>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { widthClass: 'w-40', cellClass: 'truncate' },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      meta: { widthClass: 'hidden md:table-cell w-24', cellClass: 'truncate' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { widthClass: 'w-24', cellClass: 'truncate' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const p = row.original
        if (p.status === 'pending') {
          return (
            <div className="flex gap-1 justify-end">
              <Button size="sm" onClick={() => updateStatus(p, 'approve')}>
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => updateStatus(p, 'reject')}
              >
                Reject
              </Button>
            </div>
          )
        }
        if (p.status === 'flagged') {
          return (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => updateStatus(p, 'remove')}
            >
              Remove
            </Button>
          )
        }
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => updateStatus(p, 'flag')}
          >
            Flag
          </Button>
        )
      },
      enableSorting: false,
      meta: { widthClass: 'w-40' },
    },
  ]

  return <DataTable columns={columns} data={data} isLoading={loading} />
}

export default ManageProducts
