import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import type {CartItem} from '../types/CartItem';

//this is the shopping cart page — it only reads/writes cart through CartContext (no fetch here)
// Cart lines were added from BookList via addToCart; this page is mostly display + remove + totals
const CartPage = () => {
    // Programmatic navigation (back to books, etc.) without using <a href>
    const navigate = useNavigate();
    // Pull cart array + remove helper from the provider in App.tsx
    const {cart, removeFromCart} = useCart();
    // reduce walks the array and adds each line's subtotal into one grand total
    // (sum starts at 0; each step adds item.subtotal)
    const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
    
    return (
        // maxWidth keeps the card readable on ultra-wide monitors
        <div className="container py-5" style={{ maxWidth: '960px' }}>
            
            {/* Bootstrap Breadcrumb Component — shows where you are in the app hierarchy */}
            <nav aria-label="breadcrumb" className="mb-4 text-start">
                <ol className="breadcrumb fs-5">
                    <li className="breadcrumb-item">
                        {/* href="#" would jump to top; preventDefault + navigate keeps it a SPA link */}
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); navigate(-1); }}
                            className="text-decoration-none"
                        >
                            Book Store
                        </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Shopping Cart</li>
                </ol>
            </nav>

            {/* Main cart card — inline style rounds corners; shadow-sm is Bootstrap */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                    <h2 className="h4 mb-0">Your Cart</h2>
                    {/* Badge shows how many distinct books are in the cart */}
                    <span className="badge text-bg-dark rounded-pill fs-6">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                <div className="card-body p-4">
                    {/* Conditional UI — empty cart vs line items (ternary ? : ) */}
                    {cart.length === 0 ? (
                        <div className="text-center py-5">
                            <h3 className="h5 mb-2">Your cart is empty</h3>
                            <p className="text-muted mb-4">Browse books and add a few to get started.</p>
                            {/* navigate(-1) = browser "back" — returns to previous route/history entry */}
                            <button className="btn btn-primary px-4" onClick={() => navigate(-1)}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* list-group-flush removes side borders so rows blend into the card */}
                            <div className="list-group list-group-flush">
                                {/*this maps each CartItem to a row — key={bookId} helps React reconcile updates */}
                                {cart.map((item: CartItem) => (
                                    <div key={item.bookId} className="list-group-item px-0 py-3" style={{ borderColor: '#eceff3' }}>
                                        {/* flex-md-row: stack on small screens, side-by-side on medium+ */}
                                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                            <div>
                                                <h4 className="h6 mb-1 text-start">{item.title}</h4>
                                                <div className="text-muted small text-start">
                                                    {/* toFixed(2) forces two decimal places for money display */}
                                                    Unit price: ${item.price.toFixed(2)}
                                                </div>
                                                <div className="text-muted small text-start">
                                                    Quantity: {item.quantity}
                                                </div>
                                            </div>
                                            <div className="text-md-end">
                                                <div className="fw-semibold mb-2">
                                                    Subtotal: ${item.subtotal.toFixed(2)}
                                                </div>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => removeFromCart(item.bookId)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Top border separator before the footer row */}
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4 pt-3" style={{ borderTop: '1px solid #eceff3' }}>
                                <div className="mb-3 mb-md-0">
                                    <span className="text-muted me-2">Order Total:</span>
                                    <span className="h4 mb-0">${totalAmount.toFixed(2)}</span>
                                </div>
                                {/* Same back behavior as empty state — keeps filters if you used sessionStorage on BooksPage */}
                                <button className="btn btn-primary px-4" onClick={() => navigate(-1)}>
                                    Continue Shopping
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
