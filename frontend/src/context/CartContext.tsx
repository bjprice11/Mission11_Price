import type { CartItem } from '../types/CartItem';
import { useState, createContext, useContext } from 'react';

// --- Context pattern (React) ---
// 1) createContext holds a "slot" for shared data
// 2) Provider component puts the live value into that slot
// 3) useContext (wrapped as useCart below) reads it from any descendant

// Shape of what we expose to any component that calls useCart()
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookId: number) => void;
    clearCart: () => void;
}

// undefined default means "no provider above us" — useCart checks for that
const CartContext = createContext<CartContextType | undefined>(undefined);

// Wrap App (or a subtree) with this so cart state is shared everywhere inside
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    //this is the live cart array in memory (lost on full page refresh unless you add persistence later)
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item:CartItem) => {
        // Functional update: React passes previous cart so you never overwrite with a stale closure
        setCart((prevCart) =>{
            // If this book is already in the cart, bump quantity + recompute subtotal from unit price
            const existingItem = prevCart.find(cartItem => cartItem.bookId === item.bookId);
            const updatedCart = prevCart.map((c)=>
            c.bookId === item.bookId ? { ...c, quantity: c.quantity + 1, subtotal: c.price * (c.quantity + 1) } : c
            );
            // First time adding this bookId: append the new line item as-is (quantity 1 from BookList)
            return existingItem ? updatedCart : [...prevCart, item];
        });
    };

    const removeFromCart = (bookId: number) => {
        // filter keeps every line whose bookId is NOT the one we passed in
        setCart((prevCart) => prevCart.filter(cartItem => cartItem.bookId !== bookId));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Provider value is what useCart() reads: cart + addToCart, removeFromCart, clearCart
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook — nicer than useContext(CartContext) everywhere + gives a clear error if Provider is missing
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
