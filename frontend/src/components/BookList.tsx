import {useState, useEffect} from 'react';
import type {Book} from '../types/Books';
import { apiBase } from '../apiBase';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Props come from BooksPage so filters + current page stay in sync when you leave and come back (sessionStorage there)
type BookListProps = {
    selectedCategories: string[];
    pageNumber: number;
    setPageNumber: (page: number) => void;
};

//this is the function that displays the book list — it talks to your API and handles pagination + sort
function BookList({ selectedCategories, pageNumber, setPageNumber }: BookListProps) {
    //this is the state for the books array (filled after each successful fetch)
    const [books, setBooks] = useState<Book[]>([]);
    //this is how many books we ask the API for per request (affects totalPages math below)
    const [pageSize, setPageSize] = useState<number>(10);
    //this is the total number of pages we need buttons for (from API total count / pageSize)
    const [totalPages, setTotalPages] = useState<number>(0);
    //this is whether we send orderBy to the API at all
    const [sortByTitle, setSortByTitle] = useState<boolean>(false);
    //this is the sort direction we send when sortByTitle is true
    const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
    
    // New loading state for the spinner
    const [isLoading, setIsLoading] = useState<boolean>(true); 

    // useNavigate lets us change routes from a click (here: go to cart after add)
    const navigate = useNavigate();
    // addToCart updates the shared cart context so CartPage / CartSummary can read it
    const { addToCart } = useCart();

    // Whenever page, filters, sort, or page size change, re-fetch from the backend
    useEffect(() => {
        // async IIFE pattern: define async function then call it (useEffect callback itself cannot be async)
        const fetchBooks = async () => {
            setIsLoading(true); // Trigger spinner before fetch
            // Build query string: backend expects repeated bookCategories= for multiple filters
            // encodeURIComponent keeps spaces/special chars safe in the URL
            const categoryParam = selectedCategories.map(cat => `bookCategories=${encodeURIComponent(cat)}`).join('&');
            // Only append orderBy when user checked "sort by title" — matches BooksController logic
            const orderByParam = sortByTitle ? `&orderBy=${sortDirection}` : '';            
            const requestUrl = `${apiBase}/Books?pageSize=${pageSize}&pageNumber=${pageNumber}&orderBy=${orderByParam}${selectedCategories.length > 0 ? `&${categoryParam}` : ''}`;
            
            const response = await fetch(requestUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            // API returns camelCase JSON: { books, totalNumBooks }
            const data = await response.json();
            
            setBooks(data.books);
            // Example: 23 books / 10 per page => 3 pages (ceil rounds up)
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
            setIsLoading(false); // Hide spinner after data arrives
        }
        fetchBooks();
        // Dependency array — if any of these change, we run fetchBooks again
    }, [pageSize, pageNumber, sortByTitle, sortDirection, selectedCategories]);

return (
    <div className="container py-4">
        <h1 className="mb-4 text-start">Book List</h1>

        {/* Bootstrap Spinner Conditional Rendering — ternary picks spinner OR the full list UI */}
        {isLoading ? (
            <div className="d-flex justify-content-center my-5 py-5">
                {/* role="status" + visually-hidden label helps screen readers */}
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ) : (
            <>
                {/*this maps the books array to a Bootstrap card per book*/}
                {/* Bootstrap grid: g-3 = gutter spacing; col-12 / col-md-6 / col-lg-4 = full width mobile, half tablet, third desktop */}
                <div className="row g-3">
                    {books.map((book) => (
                        <div key={book.bookId} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h3 className="h5 card-title mb-3">{book.title}</h3>
                                    {/* list-unstyled removes default bullet padding from Bootstrap */}
                                    <ul className="list-unstyled mb-0">
                                        <li>Author: {book.author}</li>
                                        <li>Publisher: {book.publisher}</li>
                                        <li>ISBN: {book.isbn}</li>
                                        <li>Classification: {book.classification}</li>
                                        <li>Category: {book.category}</li>
                                        <li>Page Count: {book.pageCount}</li>
                                        <li>Price: {book.price}</li>
                                    </ul>
                                    {/* Add line item to context, then go to cart route (URL shows which book you came from) */}
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => {
                                            // CartItem shape must match ../types/CartItem.ts
                                            addToCart({
                                                bookId: book.bookId,
                                                title: book.title,
                                                price: book.price,
                                                quantity: 1,    
                                                subtotal: book.price,
                                            });
                                            navigate(`/cart/${book.bookId}`);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination row — Previous / page numbers / Next */}
                {/* flex-wrap lets buttons wrap on narrow screens instead of overflowing */}
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                    <button
                        className="btn btn-outline-primary"
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(pageNumber - 1)}
                    >
                        Previous
                    </button>

                    {/* [...Array(n)] makes n empty slots — map turns them into numbered page buttons */}
                    {/*This maps one button per page; index is 0-based so we show index + 1 on the label*/}
                    {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setPageNumber(index + 1)}
                                disabled={pageNumber === index + 1}
                            >
                                {index + 1}
                            </button>
                        ))
                    }

                    {/* Disable Next when you're already on the last page (or when totalPages is 0) */}
                    <button
                        className="btn btn-outline-primary"
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                    >
                        Next
                    </button>
                </div>

                {/* Page size + sort controls */}
                <div className="row mt-4 align-items-end g-3">
                    <div className="col-12 col-md-6">
                        <label htmlFor="pageSize" className="form-label mb-1">
                            Results per page
                        </label>
                        <select
                            className="form-select"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPageNumber(1); // New page size usually means start back at first page
                            }}
                        >
                            <option value='2'>2</option>
                            <option value='5'>5</option>
                            <option value='10'>10</option>
                            <option value='20'>20</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-check mb-2 text-start">
                            <input
                                id="sortByTitle"
                                type="checkbox"
                                className="form-check-input"
                                checked={sortByTitle}
                                onChange={(e) => setSortByTitle(e.target.checked)} //this sets sort flag; useEffect refetches with or without orderBy
                            />
                            <label htmlFor="sortByTitle" className="form-check-label">
                                Sort by title
                            </label>
                        </div>

                        {/* Only show direction dropdown when sorting is enabled */}
                        {sortByTitle && (
                            <div className="text-start">
                                <label htmlFor="sortDirection" className="form-label mb-1">
                                    Direction
                                </label>
                                {/* e.target.value is a string — "as" tells TypeScript it's only ascending | descending */}
                                <select
                                    id="sortDirection"
                                    className="form-select"
                                    value={sortDirection}
                                    onChange={(e) => setSortDirection(e.target.value as 'ascending' | 'descending')}
                                >
                                    <option value="ascending">Ascending</option>
                                    <option value="descending">Descending</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
    </div>
    );
}

export default BookList;