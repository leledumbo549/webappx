import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom'

import Home from './pages/Home'
import Loading from './pages/Loading'
import About from './pages/About'
import Blogs from './pages/Blogs'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'

function AppRoutes() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/login' || location.pathname === '/'

  return (
    <div className="flex flex-col h-screen">
      {!hideNavbar && (
        <nav className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow flex items-center px-4 h-16">
          <div className="flex-1 items-center gap-4 hidden md:flex portrait:hidden">
            <Link
              to="/home"
              replace
              className="font-semibold text-lg hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              replace
              className="font-semibold text-lg hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/blogs"
              replace
              className="font-semibold text-lg hover:text-blue-600 transition-colors"
            >
              Blogs
            </Link>
          </div>
          <Sidebar />
        </nav>
      )}
      <main
        className={
          hideNavbar
            ? 'flex-1 overflow-auto bg-gray-50'
            : 'flex-1 overflow-auto pt-16 bg-gray-50'
        }
      >
        <Routes>
          <Route path="/" element={<Loading />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
