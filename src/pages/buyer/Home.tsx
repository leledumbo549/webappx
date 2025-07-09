import { useAuth } from '@/contexts/AuthContext'

function BuyerHome() {
  const { user } = useAuth()
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
      <p className="text-muted-foreground">Browse our latest products and promotions.</p>
    </div>
  )
}

export default BuyerHome
