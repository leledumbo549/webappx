import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { useAtom } from 'jotai'
import type { StabletokenTransaction } from '@/types/Stabletoken'
import {
  stabletokenBalanceAtom,
  setStabletokenBalanceAtom,
  transactionsAtom,
  setTransactionsAtom,
} from '@/atoms/stabletokenAtoms'

function Dashboard() {
  const [balance] = useAtom(stabletokenBalanceAtom)
  const [, setBalanceAtom] = useAtom(setStabletokenBalanceAtom)
  const [transactions] = useAtom(transactionsAtom)
  const [, setTransactions] = useAtom(setTransactionsAtom)

  const [amount, setAmount] = useState('')
  const [payAmount, setPayAmount] = useState('')
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [loadingTx, setLoadingTx] = useState(false)

  const fetchBalance = async () => {
    try {
      const res = await axios.get<{ balance: number }>('/api/balance')
      setBalanceAtom(res.data.balance)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }

  const fetchTransactions = async () => {
    setLoadingTx(true)
    try {
      const res = await axios.get<{ transactions: StabletokenTransaction[] }>(
        '/api/transactions'
      )
      setTransactions(res.data.transactions)
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    } finally {
      setLoadingTx(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchBalance()
    fetchTransactions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMint = async () => {
    try {
      await axios.post('/api/mint', { amount: Number(amount) })
      setAmount('')
      fetchBalance()
      fetchTransactions()
    } catch (err) {
      console.error('Mint failed:', err)
    }
  }

  const handlePayMint = async () => {
    try {
      const res = await axios.post('/api/payments/initiate', {
        amount: Number(payAmount),
      })
      const { paymentUrl } = res.data as { paymentUrl: string }
      setPaymentLink(paymentUrl)
      window.open(paymentUrl, '_blank')
      setPayAmount('')
    } catch (err) {
      console.error('Payment initiation failed:', err)
    }
  }

  const columns: ColumnDef<StabletokenTransaction>[] = [
    { accessorKey: 'id', header: 'ID', meta: { widthClass: 'w-16' } },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'reference', header: 'Reference' },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleString()
          : '',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Stabletoken Balance</h2>
        <div className="text-2xl font-bold">{balance}</div>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <Button onClick={handleMint}>Mint</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Mint Stabletoken (Pay by Fiat)
        </h3>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            placeholder="Amount"
          />
          <Button onClick={handlePayMint}>Pay</Button>
        </div>
        {paymentLink && (
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline text-blue-600"
          >
            Open Payment Link
          </a>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <DataTable
          columns={columns}
          data={transactions}
          isLoading={loadingTx}
        />
      </div>
    </div>
  )
}

export default Dashboard
