import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Blogs from './pages/Blogs'

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow flex items-center px-4 h-16">
          <div className="flex-1 flex items-center gap-4">
            <Link
              to="/"
              className="font-semibold text-lg hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="font-semibold text-lg hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/blogs"
              className="font-semibold text-lg hover:text-blue-600 transition-colors"
            >
              Blogs
            </Link>
          </div>
        </nav>
        {/* Content Area */}
        <main className="flex-1 overflow-auto pt-16 bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs" element={<Blogs />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
