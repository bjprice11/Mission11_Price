// Root React component — imported by main.tsx and mounted into #root
import BooksPage from './pages/BooksPage'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CartPage from './pages/CartPage'
import { CartProvider } from './context/CartContext'

//this is the main app component — it wraps the whole UI so cart state is available on every page
function App() {
  return (
    // Short fragment <>...</> avoids an extra DOM wrapper around Router
    <>
    {/* CartProvider holds the shopping cart in React state; anything inside can call useCart() */}
    <CartProvider>
    {/* BrowserRouter watches the URL and picks which page component to show */}
    <Router>
      {/* Routes = switch: first matching path wins */}
      <Routes>
        {/* Home and /books both show the same page (your book list + filters) */}
        <Route path="/" element={<BooksPage />} />
        <Route path="/books" element={<BooksPage />} />
        {/* :bookId is a URL parameter — CartPage can read it with useParams() if you need it */}
        <Route path="/cart/:bookId" element={<CartPage />} />
      </Routes>
    </Router>
    </CartProvider>
    </>
  )
}

export default App
