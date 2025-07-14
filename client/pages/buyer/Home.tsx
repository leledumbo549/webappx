import { useAtom } from 'jotai'
import { userAtom } from '@/atoms/loginAtoms'
import SectionTitle from '@/components/SectionTitle'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Store, ShieldCheck, Users } from 'lucide-react'

function BuyerHome() {
  const [user] = useAtom(userAtom)
  const greeting = user ? `Welcome, ${user.name}` : 'Welcome to MarketPlace'

  const features = [
    {
      icon: ShoppingCart,
      title: 'Seamless Shopping',
      description: 'Browse and purchase from thousands of products with ease.',
    },
    {
      icon: Store,
      title: 'Open Your Store',
      description:
        'Become a seller and reach customers across the globe in minutes.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      description:
        'Every transaction is protected with industry-standard security.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a vibrant network of buyers and sellers.',
    },
  ]

  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <SectionTitle className="text-4xl md:text-5xl">{greeting}</SectionTitle>
        <p className="text-lg text-muted-foreground">
          Discover a new way to buy and sell online with MarketPlace
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" onClick={() => (window.location.hash = '/catalog')}>
            Explore Catalog
          </Button>
          {!user && (
            <Button
              size="lg"
              variant="secondary"
              onClick={() => (window.location.hash = '/register')}
            >
              Create Account
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center"
          >
            <div className="rounded-full bg-primary/10 p-3">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuyerHome
