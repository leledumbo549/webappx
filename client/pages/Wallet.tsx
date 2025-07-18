import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import type { Wallet } from '@/types/Wallet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true)
      try {
        const res = await axios.get<Wallet>('/api/wallet')
        setWallet(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetchWallet()
  }, [])

  if (loading || !wallet) {
    return <Skeleton className="h-24 w-full" />
  }

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Balance</p>
        <p className="text-2xl font-bold">{wallet.balance}</p>
      </CardContent>
    </Card>
  )
}

export default WalletPage

