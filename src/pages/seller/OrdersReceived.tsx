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
    { accessorKey: 'productName', header: 'Product' },
    { accessorKey: 'quantity', header: 'Qty' },
    { accessorKey: 'total', header: 'Total' },
    { accessorKey: 'status', header: 'Status' },
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
