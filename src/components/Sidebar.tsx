import { Link, useNavigate } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet'

type SidebarProps = {
  onLogout?: () => void
}

function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate()

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
          className="ml-auto md:hidden portrait:inline-flex"
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
            <Link
              to="/home"
              className="rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              About
            </Link>
            <Link
              to="/blogs"
              className="rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              Blogs
            </Link>
          </nav>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="mt-auto"
          >
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Sidebar
