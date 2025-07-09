import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import { getPageTitle, isNestedRoute } from '@/lib/nav'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = getPageTitle(location.pathname)
  const showBack = isNestedRoute(location.pathname)

  return (
    <div className="border-b py-4">
      <Container className="relative flex items-center justify-center">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="absolute left-4 flex items-center justify-center focus-visible:ring"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}
        <span className="font-semibold">{title}</span>
      </Container>
    </div>
  )
}

export default Navbar
