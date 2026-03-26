import {useState, useEffect} from 'react';
import type {Book} from '../types/Books';
import { apiBase } from '../apiBase';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Props from BooksPage — selectedCategories + pageNumber stay in sync with sessionStorage there
type BookListProps = {
    selectedCategories: string[];
    pageNumber: number;
    setPageNumber: (page: number) => void;
};

// Fetches /Books with query params; addToCart + navigate go to cart
function BookList({ selectedCategories, pageNumber, setPageNumber }: BookListProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortByTitle, setSortByTitle] = useState<boolean>(false);
    const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
    
    const [isLoading, setIsLoading] = useState<boolean>(true); 

    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            const categoryParam = selectedCategories.map(cat => `bookCategories=${encodeURIComponent(cat)}`).join('&');
            const orderByParam = sortByTitle ? `&orderBy=${sortDirection}` : '';            
            const requestUrl = `${apiBase}/Books?pageSize=${pageSize}&pageNumber=${pageNumber}&orderBy=${orderByParam}${selectedCategories.length > 0 ? `&${categoryParam}` : ''}`;
            
            const response = await fetch(requestUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
            setIsLoading(false);
        }
        fetchBooks();
    }, [pageSize, pageNumber, sortByTitle, sortDirection, selectedCategories]);

return (
    <div className="container py-4">
        <h1 className="mb-4 text-start">Book List</h1>

        {isLoading ? (
            <div className="d-flex justify-content-center my-5 py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ) : (
            <>
                <div className="row g-3">
                    {books.map((book) => (
                        <div key={book.bookId} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h3 className="h5 card-title mb-3">{book.title}</h3>
                                    <ul className="list-unstyled mb-0">
                                        <li>Author: {book.author}</li>
                                        <li>Publisher: {book.publisher}</li>
                                        <li>ISBN: {book.isbn}</li>
                                        <li>Classification: {book.classification}</li>
                                        <li>Category: {book.category}</li>
                                        <li>Page Count: {book.pageCount}</li>
                                        <li>Price: {book.price}</li>
                                    </ul>
                                    {/* Pushes a CartItem into context, then navigates — CartPage reads the same context */}
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => {
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

                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                    <button
                        className="btn btn-outline-primary"
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(pageNumber - 1)}
                    >
                        Previous
                    </button>

                    {/* setPageNumber is BooksPage’s setter passed in as a prop */}
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

                    <button
                        className="btn btn-outline-primary"
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                    >
                        Next
                    </button>
                </div>

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
                                setPageNumber(1);
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
                                onChange={(e) => setSortByTitle(e.target.checked)}
                            />
                            <label htmlFor="sortByTitle" className="form-check-label">
                                Sort by title
                            </label>
                        </div>

                        {sortByTitle && (
                            <div className="text-start">
                                <label htmlFor="sortDirection" className="form-label mb-1">
                                    Direction
                                </label>
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
