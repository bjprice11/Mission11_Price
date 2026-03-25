import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSummary = () => {
    const navigate = useNavigate();
    const {cart} = useCart();
    const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    return(<div style= {{
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
        onClick={() => navigate('/cart')}
          > 
          🛒 <br /> <strong>Total: ${totalAmount.toFixed(2)}</strong>
          <br />
          <strong>Quantity:{totalQuantity}</strong>
    </div>
)
}

export default CartSummary;