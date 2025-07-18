import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function Dashboard() {
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')

  const fetchBalance = async () => {
    try {
      const res = await axios.get<{ balance: number }>('/api/balance')
      setBalance(res.data.balance)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  const handleMint = async () => {
    try {
      await axios.post('/api/mint', { amount: Number(amount) })
      setAmount('')
      fetchBalance()
    } catch (err) {
      console.error('Mint failed:', err)
    }
  }

  return (
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
  )
}

export default Dashboard
