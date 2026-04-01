import { apiBase } from "../apiBase";
import type { Book } from "../types/Books";

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
}

export const fetchBooks = async (
    pageSize: number,
    pageNumber: number,
    selectedCategories: string[]

): Promise<FetchBooksResponse> => {
    try{
        const categoryParams = selectedCategories.map(cat =>`projectTypes=${encodeURIComponent(cat)}`).join('&');
        const requestUrl = `${apiBase}/Books?${categoryParams}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
        const response = await fetch(requestUrl);

        if (!response.ok) throw new Error('Failed to fetch books');
        return await response.json()
    } catch (error){
        console.error("Failed to fetch projects:", error);
        throw error;
    }
};

export const addBook = async (book: Book): Promise<Book> => {
    try{
        const response = await fetch(`${apiBase}/Books/AddBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        if (!response.ok) throw new Error('Failed to add book');
        return response.json();
    } catch (error){
        console.error("Failed to add book:", error);
        throw error;
    }
};

export const updateBook = async (bookId: number, updatedBook: Book): Promise<Book> => {
    try{
        const response = await fetch(`${apiBase}/Books/UpdateBook/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });
        return await response.json();
    } catch (error){
        console.error("Failed to update book:", error);
        throw error;
    }
};

export const deleteBook = async (bookId: number): Promise<void> => {
    try{
        const response = await fetch(`${apiBase}/Books/DeleteBook/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete book');
    }
    catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};
