import { useState } from 'react'
import BookList from './BookList'
import './App.css'

//this is the main app component
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BookList />
    </>
  )
}

export default App
