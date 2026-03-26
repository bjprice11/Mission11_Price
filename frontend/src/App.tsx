// Root component — mounted from main.tsx
import BooksPage from './pages/BooksPage'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CartPage from './pages/CartPage'
import { CartProvider } from './context/CartContext'

// Wraps the app so cart state is shared; any child can call useCart()
function App() {
  return (
    <>
    {/* value lives in CartProvider — passed implicitly via context, not props */}
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<BooksPage />} />
        <Route path="/books" element={<BooksPage />} />
        {/* :bookId is in the URL; CartPage could read it with useParams() if you need it */}
        <Route path="/cart/:bookId" element={<CartPage />} />
      </Routes>
    </Router>
    </CartProvider>
    </>
  )
}

export default App
