import { useState, useEffect } from 'react';
import BookList from '../components/BookList'
import CategoryFilter from '../components/CategoryFilter'
import WelcomeBand from '../components/WelcomeBand'
import CartSummary from '../components/CartSummary'

// Owns filter + page state; passes it down to CategoryFilter and BookList as props
function BooksPage() {
    // Loaded from sessionStorage on first mount only — survives trip to cart and back (same tab)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const savedCategories = sessionStorage.getItem('savedCategories');
        return savedCategories ? JSON.parse(savedCategories) : [];
    });

    const [pageNumber, setPageNumber] = useState<number>(() => {
        const savedPage = sessionStorage.getItem('savedPageNumber');
        return savedPage ? Number(savedPage) : 1;
    });
    
    useEffect(() => {
        sessionStorage.setItem('savedCategories', JSON.stringify(selectedCategories));
    }, [selectedCategories]);

    useEffect(() => {
        sessionStorage.setItem('savedPageNumber', pageNumber.toString());
    }, [pageNumber]);
    
    return (
        <>
            <div className="container">
                <WelcomeBand/>
                <div style={{position: 'fixed', top: '20px', right: '20px'}}>
                    {/* useCart() inside — no props needed from here */}
                    <CartSummary />
                </div>
                <div className="row">
                <div className="col-md-3">
                    {/* From BooksPage state → CategoryFilter; setPageNumber resets list when filters change */}
                    <CategoryFilter 
                        selectedCategories={selectedCategories} 
                        setSelectedCategories={setSelectedCategories} 
                        setPageNumber={setPageNumber} 
                    />
                </div>
                <div className="col-md-9">
                    {/* From BooksPage state → BookList; setPageNumber updates page in parent so it persists */}
                    <BookList 
                        selectedCategories={selectedCategories} 
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                    />
                </div>
                </div>
            </div>
        </>
    );
}

export default BooksPage;
