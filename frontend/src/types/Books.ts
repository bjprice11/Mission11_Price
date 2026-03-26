//this is the type for the book object — this tells the application what the book object looks like
// It mirrors the JSON shape your ASP.NET API sends back (camelCase property names)
export interface Book {
    // Unique id — used as React key in the list and in cart URLs like /cart/:bookId
    bookId: number
    title: string
    author: string
    publisher: string
    isbn: string
    // High-level genre/type from the publisher (not the same as "category" below in all datasets)
    classification: string
    // Stored category string — CategoryFilter sends these values back as bookCategories query params
    category: string
    pageCount: number
    // Stored as a number in JSON; you display it raw on the card (format as currency later if you want)
    price: number
}
