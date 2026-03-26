import { useState, useEffect } from 'react';
import BookList from '../components/BookList'
import CategoryFilter from '../components/CategoryFilter'
import WelcomeBand from '../components/WelcomeBand'
import CartSummary from '../components/CartSummary'

//this is the books browse page — it owns the filter + pagination state that BookList and CategoryFilter share
function BooksPage() {
    // Initialize state from sessionStorage, or default to empty array
    // sessionStorage survives when you navigate away (e.g. to cart) and come back in the same tab
    //only runs the first time
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const savedCategories = sessionStorage.getItem('savedCategories');
        return savedCategories ? JSON.parse(savedCategories) : [];
    });

    //this is the current page of results 
    const [pageNumber, setPageNumber] = useState<number>(() => {
        const savedPage = sessionStorage.getItem('savedPageNumber');
        return savedPage ? Number(savedPage) : 1;
    });
    
    // Save to sessionStorage whenever selectedCategories changes
    // JSON.stringify because sessionStorage only stores strings
    useEffect(() => {
        sessionStorage.setItem('savedCategories', JSON.stringify(selectedCategories));
    }, [selectedCategories]);

    // page number is saved
    useEffect(() => {
        sessionStorage.setItem('savedPageNumber', pageNumber.toString());
    }, [pageNumber]);
    
    return (
        <>
            <div className="container">
                <WelcomeBand/>
                <div style={{position: 'fixed', top: '20px', right: '20px'}}><CartSummary /></div>                {/* 1. Two-column layout on medium+ screens: filter sidebar + main content */}
                <div className="row">
                <div className="col-md-3">
                    {/* Pass setPageNumber down so the filter can reset it */}
                    <CategoryFilter 
                        selectedCategories={selectedCategories} 
                        setSelectedCategories={setSelectedCategories} 
                        setPageNumber={setPageNumber} 
                    />
                </div>
                <div className="col-md-9">
                    {/* Pass pageNumber and setPageNumber down to the list */}
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
