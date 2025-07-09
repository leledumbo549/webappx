import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetTrigger, SheetContent, SheetClose } from './ui/sheet'

export type SidebarLink = { to: string; label: string }

type SidebarProps = {
  links: SidebarLink[]
  onLogout?: () => void
}

function Sidebar({ links, onLogout }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.clear()
      navigate('/', { replace: true })
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto portrait:inline-flex focus-visible:ring"
          aria-label="Open menu"
        >
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-64 bg-sidebar text-sidebar-foreground"
      >
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-6">Menu</h2>
          <nav className="flex flex-col gap-3 flex-1">
            {links.map((l) => {
              const active = location.pathname.startsWith(l.to)
              return (
                <SheetClose asChild key={l.to}>
                  <Link
                    to={l.to}
                    className={`rounded px-4 py-2 hover:bg-gray-100 focus-visible:ring transition-colors ${active ? 'bg-gray-200 font-semibold' : ''}`}
                  >
                    {l.label}
                  </Link>
                </SheetClose>
              )
            })}
          </nav>
          <SheetClose asChild>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="mt-auto focus-visible:ring"
            >
              Logout
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Sidebar
