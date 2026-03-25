import BooksPage from './pages/BooksPage'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CartPage from './pages/CartPage'
import { CartProvider } from './context/CartContext'

//this is the main app component
function App() {
  return (
    <>
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<BooksPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/cart/:bookId" element={<CartPage />} />
      </Routes>
    </Router>
    </CartProvider>
    </>
  )
}

export default App
