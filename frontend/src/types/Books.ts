// Matches JSON from GET /Books — used when mapping API results into state in BookList
export interface Book {
    bookId: number
    title: string
    author: string
    publisher: string
    isbn: string
    classification: string
    // Same strings CategoryFilter sends as bookCategories query params
    category: string
    pageCount: number
    price: number
}
