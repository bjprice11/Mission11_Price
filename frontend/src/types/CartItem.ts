// One line item in the cart — BookList builds this object and passes it to addToCart(item)
export interface CartItem {
    bookId: number;
    title: string;
    price: number;
    quantity: number;
    subtotal: number;
}
