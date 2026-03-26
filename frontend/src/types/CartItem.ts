//this is the type for one row in the shopping cart — it matches what BookList passes into addToCart()
export interface CartItem {
    // Primary key
    bookId: number;
    title: string;
    price: number;
    quantity: number;
    // artPage sums these for the order total
    subtotal: number;
}
