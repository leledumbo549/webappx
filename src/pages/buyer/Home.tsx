import { useAuth } from '@/contexts/AuthContext'
import SectionTitle from '@/components/SectionTitle'

function BuyerHome() {
  const { user } = useAuth()
  return (
    <div className="space-y-4">
      <SectionTitle>Welcome, {user?.name}</SectionTitle>
      <p className="text-muted-foreground">
        Browse our latest products and promotions.
      </p>
    </div>
  )
}

export default BuyerHome
