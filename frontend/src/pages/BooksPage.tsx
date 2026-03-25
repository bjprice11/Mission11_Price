import { useState, useEffect } from 'react';
import BookList from '../components/BookList'
import CategoryFilter from '../components/CategoryFilter'
import WelcomeBand from '../components/WelcomeBand'
import CartSummary from '../components/CartSummary'

function BooksPage() {
    // Initialize state from sessionStorage, or default to empty array
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const savedCategories = sessionStorage.getItem('savedCategories');
        return savedCategories ? JSON.parse(savedCategories) : [];
    });
    
    // Save to sessionStorage whenever selectedCategories changes
    useEffect(() => {
        sessionStorage.setItem('savedCategories', JSON.stringify(selectedCategories));
    }, [selectedCategories]);
    
    return (
    <>
        <div className="container">
            <WelcomeBand/>
            <div style={{position: 'fixed', top: '20px', right: '20px'}}><CartSummary /></div>
            <div className="row">
            <div className="col-md-3"><CategoryFilter selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} /></div>
            <div className="col-md-9"><BookList selectedCategories={selectedCategories} /></div>
            </div>
        </div>
    </>
    )
}

export default BooksPage;