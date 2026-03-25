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

    const [pageNumber, setPageNumber] = useState<number>(() => {
        const savedPage = sessionStorage.getItem('savedPageNumber');
        return savedPage ? Number(savedPage) : 1;
    });
    
    // Save to sessionStorage whenever selectedCategories changes
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
                <div style={{position: 'fixed', top: '20px', right: '20px'}}><CartSummary /></div>
                <div className="row">
                <div className="col-md-3">
                    {/* 3. Pass setPageNumber down so the filter can reset it */}
                    <CategoryFilter 
                        selectedCategories={selectedCategories} 
                        setSelectedCategories={setSelectedCategories} 
                        setPageNumber={setPageNumber} 
                    />
                </div>
                <div className="col-md-9">
                    {/* 4. Pass pageNumber and setPageNumber down to the list */}
                    <BookList 
                        selectedCategories={selectedCategories} 
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                    />
                </div>
                </div>
            </div>
        </>
        )
    }
    
    export default BooksPage;