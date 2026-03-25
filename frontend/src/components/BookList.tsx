import {useState, useEffect} from 'react';
import type {Book} from '../types/Books';
import { apiBase } from '../apiBase';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

//This is the function that displays the book list
function BookList({selectedCategories, pageNumber, setPageNumber}: {selectedCategories: string[], pageNumber: number, setPageNumber: (pageNumber: number) => void}) {
    //this is the state for the books array
    const [books, setBooks] = useState<Book[]>([]);
    //this is the state for the page size
    const [pageSize, setPageSize] = useState<number>(10);
    //this is the state for the page number
    //this is the state for the total number of pages
    const [totalPages, setTotalPages] = useState<number>(0);
    //this is the state for the sort by title
    const [sortByTitle, setSortByTitle] = useState<boolean>(false);
    //this is the state for the sort direction
    const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
    // Inside BookList.tsx


    //const navigate = useNavigate();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    //this gets the book information from the API
    useEffect(() => {
        //async means that the function can be paused and resumed later
        const fetchBooks = async () => {
            const categoryParam = selectedCategories.map(cat => `bookCategories=${encodeURIComponent(cat)}`).join('&');
            //this is the parameter for the order by
            const orderByParam = sortByTitle ? `&orderBy=${sortDirection}` : '';            
            const requestUrl = `${apiBase}/Books?pageSize=${pageSize}&pageNumber=${pageNumber}&orderBy=${orderByParam}${selectedCategories.length > 0 ? `&${categoryParam}` : ''}`;
            //this is the response from the API, using this url and the parameters we set earlier
            const response = await fetch(
            `${requestUrl}`
            );
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        }
        fetchBooks();
        //this is the dependency array for the useEffect hook - this is what causes the function to re-run when the state changes
    }, [pageSize, pageNumber, sortByTitle, sortDirection, selectedCategories]);

    //What will be displayed on the screen
return (
    <div className="container py-4">
        <h1 className="mb-4 text-start">Book List</h1>

        {/*this maps the books array to the book card*/ }
        <div className="row g-3">
            {books.map((book) => (
                <div key={book.bookId} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h3 className="h5 card-title mb-3">{book.title}</h3>
                            <ul className="list-unstyled mb-0">
                                {/*this is the list of book information*/}
                                <li><strong>Author:</strong> {book.author}</li>
                                <li><strong>Publisher:</strong> {book.publisher}</li>
                                <li><strong>ISBN:</strong> {book.isbn}</li>
                                <li><strong>Classification:</strong> {book.classification}</li>
                                <li><strong>Category:</strong> {book.category}</li>
                                <li><strong>Page Count:</strong> {book.pageCount}</li>
                                <li><strong>Price:</strong> {book.price}</li>
                            </ul>
                            <button
                                className="btn btn-primary"
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

        {/*this is the pagination buttons. it is disabled if the page number is 1*/}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            <button
                className="btn btn-outline-primary"
                disabled={pageNumber === 1}
                onClick={() => setPageNumber(pageNumber - 1)}
            >
                Previous
            </button>

            {
                //This maps the pagination buttons to the total number of pages
                [...Array(totalPages)].map((_, index) => (
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

            {/*this is the next button. it is disabled if the page number is the total number of pages*/}
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
                {/*this is the results per page dropdown*/}
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
                {/*this is the sort by title checkbox*/}
                <div className="form-check mb-2 text-start">
                    <input
                        id="sortByTitle"
                        type="checkbox"
                        className="form-check-input"
                        checked={sortByTitle}
                        onChange={(e) => setSortByTitle(e.target.checked)} //this is the function that sets the sort by title state to the checked value
                    />
                    <label htmlFor="sortByTitle" className="form-check-label">
                        Sort by title
                    </label>
                </div>

                {/*this is the sort direction dropdown*/}
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
    </div>
    );
}

export default BookList;