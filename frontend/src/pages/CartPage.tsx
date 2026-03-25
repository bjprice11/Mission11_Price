import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import type {CartItem} from '../types/CartItem';


const CartPage = () => {
    const navigate = useNavigate();
    const {cart, removeFromCart} = useCart();
    const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    return (
        <div
            className="container py-5"
            style={{ maxWidth: '960px' }}
        >
            <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: '14px', overflow: 'hidden' }}
            >
                <div
                    className="card-header d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#f8f9fa' }}
                >
                    <h2 className="h4 mb-0">Your Cart</h2>
                    <span className="badge text-bg-dark rounded-pill fs-6">
                        Total Quantity: {totalQuantity}
                    </span>
                    <span className="badge text-bg-dark rounded-pill fs-6">
                        Total Amount: ${totalAmount.toFixed(2)}
                    </span>
                </div>

                <div className="card-body p-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-5">
                            <h3 className="h5 mb-2">Your cart is empty</h3>
                            <p className="text-muted mb-4">Browse books and add a few to get started.</p>
                            <button
                                className="btn btn-primary px-4"
                                onClick={() => navigate(-1)}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="list-group list-group-flush">
                                {cart.map((item: CartItem) => (
                                    <div
                                        key={item.bookId}
                                        className="list-group-item px-0 py-3"
                                        style={{ borderColor: '#eceff3' }}
                                    >
                                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                            <div>
                                                <h4 className="h6 mb-1">{item.title}</h4>
                                                <div className="text-muted small">
                                                    Unit price: ${item.price.toFixed(2)}
                                                </div>
                                                <div className="text-muted small">
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

                            <div
                                className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4 pt-3"
                                style={{ borderTop: '1px solid #eceff3' }}
                            >
                                <div className="mb-3 mb-md-0">
                                    <span className="text-muted me-2">Order Total:</span>
                                    <span className="h4 mb-0">${totalAmount.toFixed(2)}</span>
                                </div>
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() => navigate('/books')}
                                >
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