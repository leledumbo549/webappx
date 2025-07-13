import { useAtom } from 'jotai'
import { userAtom } from '@/atoms/loginAtoms'
import SectionTitle from '@/components/SectionTitle'

function BuyerHome() {
  const [user] = useAtom(userAtom)
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
