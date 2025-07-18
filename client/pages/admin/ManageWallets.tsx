import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import type { Wallet } from '@/types/Wallet'

function ManageWallets() {
  const [data, setData] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<Wallet[]>('/api/admin/wallets')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const columns: ColumnDef<Wallet>[] = [
    { accessorKey: 'id', header: 'ID', meta: { widthClass: 'w-16' } },
    { accessorKey: 'userId', header: 'User ID', meta: { widthClass: 'w-20' } },
    { accessorKey: 'balance', header: 'Balance', meta: { widthClass: 'w-32' } },
    { accessorKey: 'updatedAt', header: 'Updated', meta: { widthClass: 'w-40' } },
  ]

  return <DataTable columns={columns} data={data} isLoading={loading} />
}

export default ManageWallets

