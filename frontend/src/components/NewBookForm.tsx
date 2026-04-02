import {useState} from 'react';
import type { Book } from '../types/Books';
import { addBook } from '../api/BooksAPI';

// This is the form for adding a new book
// The onSuccess function is called when the book is added successfully
// The onCancel function is called when the user cancels the addition of a new book

interface NewBookFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

// This is the function for adding a new book it takes the onSuccess and onCancel functions, origianally it will be empty
const NewBookForm = ({ onSuccess, onCancel }: NewBookFormProps) => {
    const [formData, setFormData] = useState<Book>({
        bookId: 0,
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        classification: '',
        category: '',
        pageCount: 0,
        price: 0
    });

    // This is the function for handling the change in the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});

    };
    // This is the function for handling the submission of the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addBook(formData);
        onSuccess();
    };
    // This is the return statement for the form
    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Book</h2>
            <label>Book Title:<input type="text" name="title" value={formData.title} onChange={handleChange} /></label>
            <label>Book Author:<input type="text" name="author" value={formData.author} onChange={handleChange} /></label>
            <label>Book Publisher:<input type="text" name="publisher" value={formData.publisher} onChange={handleChange} /></label>
            <label>Book ISBN:<input type="text" name="isbn" value={formData.isbn} onChange={handleChange} /></label>
            <label>Book Classification:<input type="text" name="classification" value={formData.classification} onChange={handleChange} /></label>
            <label>Book Category:<input type="text" name="category" value={formData.category} onChange={handleChange} /></label>
            <label>Book Page Count:<input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} /></label>
            <label>Book Price:<input type="number" name="price" value={formData.price} onChange={handleChange} /></label>
            <button type="submit">Add Book</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default NewBookForm;