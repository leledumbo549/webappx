import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import type { SellerPayout } from '@/types/Seller'

function Payouts() {
  const [data, setData] = useState<SellerPayout[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<SellerPayout[]>('/api/seller/payouts')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const columns: ColumnDef<SellerPayout>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      meta: { widthClass: 'w-32', cellClass: 'truncate' },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      meta: { widthClass: 'w-32', cellClass: 'truncate' },
    },
  ]

  return <DataTable columns={columns} data={data} isLoading={loading} />
}

export default Payouts
