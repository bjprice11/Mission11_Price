import {useState, useEffect} from 'react';
import type {Book} from './types/Books';

//This is the function that displays the book list
function BookList() {
    //this is the state for the books array
    const [books, setBooks] = useState<Book[]>([]);
    //this is the state for the page size
    const [pageSize, setPageSize] = useState<number>(10);
    //this is the state for the page number
    const [pageNumber, setPageNumber] = useState<number>(1);
    //this is the state for the total number of books
    const [totalNumBooks, setTotalNumBooks] = useState<number>(0);
    //this is the state for the total number of pages
    const [totalPages, setTotalPages] = useState<number>(0);
    //this is the state for the sort by title
    const [sortByTitle, setSortByTitle] = useState<boolean>(false);
    //this is the state for the sort direction
    const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');

    //this gets the book information from the API
    useEffect(() => {
        //async means that the function can be paused and resumed later
        const fetchBooks = async () => {
            //this is the parameter for the order by
            const orderByParam = sortByTitle ? `&orderBy=${sortDirection}` : '';
            //this is the response from the API, using this url and the parameters we set earlier
            const response = await fetch(
                `https://localhost:7218/Books?pageSize=${pageSize}&pageNumber=${pageNumber}${orderByParam}`
            );
            const data = await response.json();
            setBooks(data.books);
            setTotalNumBooks(data.totalNumBooks);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        }
        fetchBooks();
        //this is the dependency array for the useEffect hook - this is what causes the function to re-run when the state changes
    }, [pageSize, pageNumber, sortByTitle, sortDirection]);

    //What will be displayed on the screen
return (
    <>
    <h1>Book List</h1>
    <br/>
          {/*this maps the books array to the book card*/ }
        {books.map((book) => (
            <div id="bookCard" className="card" 
            key={book.bookId}>
                <h3>{book.title}</h3>
                <div className="card-body">
                <ul className='list-unstyled'>
                    {/*this is the list of book information*/}
                    <li><strong>Author:</strong> {book.author}</li>
                    <li><strong>Publisher:</strong> {book.publisher}</li>
                    <li><strong>ISBN:</strong> {book.isbn}</li>
                    <li><strong>Classification:</strong> {book.classification}</li>
                    <li><strong>Category:</strong> {book.category}</li>
                    <li><strong>Page Count:</strong> {book.pageCount}</li>
                    <li><strong>Price:</strong> {book.price}</li>
                </ul>
                </div>
                
            </div>
        ))}
        {/*this is the pagination buttons. it is disabled if the page number is 1*/}
    <button disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)}>Previous</button>
    {
        //This maps the pagination buttons to the total number of pages
        [...Array(totalPages)].map((_, index) => (
            <button key={index +1} onClick={() => setPageNumber(index + 1)} disabled={pageNumber === index + 1}>{index + 1}</button>
        ))
    }
    {/*this is the next button. it is disabled if the page number is the total number of pages*/}
    <button disabled={pageNumber === totalPages} onClick={() => setPageNumber(pageNumber + 1)}>Next</button>
    <br/>
    <br/>
    {/*this is the results per page dropdown*/}
    <label htmlFor="pageSize">Results per page:
        <select
            value={pageSize}
            onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNumber(1);
            }}>
            <option value='2'>2</option>
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='20'>20</option>
        </select>
    </label>
    <br/>
    {/*this is the sort by title checkbox*/}
    <label htmlFor="sortByTitle">
        <input
            id="sortByTitle"
            type="checkbox"
            checked={sortByTitle}
            onChange={(e) => setSortByTitle(e.target.checked)} //this is the function that sets the sort by title state to the checked value
        />{' '}
        Sort by title
    </label>

    {/*this is the sort direction dropdown*/}
    {sortByTitle && (
        <label htmlFor="sortDirection" style={{ marginLeft: '1rem' }}>
            Direction:{' '}
            <select
                id="sortDirection"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as 'ascending' | 'descending')}
            >
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
            </select>
        </label>
    )}
    </>
    );
}

export default BookList;