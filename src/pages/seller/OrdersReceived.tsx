import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import type { SellerOrder } from '@/types/Seller'

function OrdersReceived() {
  const [data, setData] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<SellerOrder[]>('/api/seller/orders')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateStatus = async (o: SellerOrder, action: string) => {
    await axios.patch(`/api/seller/orders/${o.id}`, { action })
    fetchData()
  }

  const columns: ColumnDef<SellerOrder>[] = [
    {
      accessorKey: 'productName',
      header: 'Product',
      meta: { widthClass: 'w-40', cellClass: 'truncate' },
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      meta: { widthClass: 'hidden md:table-cell w-20', cellClass: 'truncate' },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      meta: { widthClass: 'hidden md:table-cell w-24', cellClass: 'truncate' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { widthClass: 'w-28', cellClass: 'truncate' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const o = row.original
        if (o.status === 'pending') {
          return (
            <Button size="sm" onClick={() => updateStatus(o, 'ship')}>
              Mark Shipped
            </Button>
          )
        }
        if (o.status === 'shipped') {
          return (
            <Button size="sm" onClick={() => updateStatus(o, 'deliver')}>
              Mark Delivered
            </Button>
          )
        }
        return null
      },
      enableSorting: false,
      meta: { widthClass: 'w-40' },
    },
  ]

  return <DataTable columns={columns} data={data} isLoading={loading} />
}

export default OrdersReceived
