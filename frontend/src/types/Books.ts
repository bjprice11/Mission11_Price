//this is the type for the book object - this tells the application what the book object looks like
export interface Book {
    bookId: number
    title: string
    author: string
    publisher: string
    isbn: string
    classification: string
    category: string
    pageCount: number
    price: number
}