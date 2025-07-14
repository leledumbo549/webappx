import { useAtom } from 'jotai'
import { userAtom } from '@/atoms/loginAtoms'
import SectionTitle from '@/components/SectionTitle'

function BuyerHome() {
  const [user] = useAtom(userAtom)
  const greeting = user ? `Welcome, ${user.name}` : 'Welcome to MarketPlace'

  return (
    <div className="space-y-4">
      <SectionTitle>{greeting}</SectionTitle>
      <p className="text-muted-foreground">
        Browse our latest products and promotions.
      </p>
    </div>
  )
}

export default BuyerHome
