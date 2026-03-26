import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Small floating widget — shows cart totals and sends user to cart when clicked

// Rendered in BooksPage inside a fixed-position wrapper (top-right of the viewport)
const CartSummary = () => {
    const navigate = useNavigate();
    //Pulls the cart array from the context
    const {cart} = useCart();
    // sum of all subtotals
    const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
    // how many books total including duplicates
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    return(
        // Inline style object 
        <div style= {{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2 5px 0 rgba(0, 0, 0, 0.2)',
        alignItems: 'center',
        fontSize: '16px',
    }}
    // Navigates to the cart page
        onClick={() => navigate('/cart')}
          > 
          {/* Shows the total amount and quantity */}
          🛒 <br /> <strong>Total: ${totalAmount.toFixed(2)}</strong>
          <br />
          {/* Shows the total quantity */}
          <strong>Quantity:{totalQuantity}</strong>
    </div>
)
}

export default CartSummary;
