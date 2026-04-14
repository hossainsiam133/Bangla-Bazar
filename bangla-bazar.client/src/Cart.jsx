import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import UserNav from './UserNav';
import { persistCartItems, readCartItems, removeProductFromCart, setProductQuantityInCart } from './cart.js';

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Load cart items from localStorage
        const items = readCartItems();
        if (items.length > 0) {
            setCartItems(items);
            calculateTotal(items);
            return;
        }

        setTotalPrice(0);
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const removeItem = async (id) => {
        const updated = cartItems.filter(item => item.id !== id);
        setCartItems(updated);
        persistCartItems(updated);
        calculateTotal(updated);

        await removeProductFromCart(id);
    };

    const updateQuantity = async (id, quantity) => {
        if (quantity <= 0) {
            await removeItem(id);
            return;
        }
        const updated = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updated);
        persistCartItems(updated);
        calculateTotal(updated);

        await setProductQuantityInCart(id, quantity);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Check if user is logged in
        const user = localStorage.getItem('bb_user');
        if (!user) {
            alert('Please login to proceed with checkout');
            navigate('/login');
            return;
        }

        // Store checkout data and navigate to checkout page
        const checkoutData = {
            items: cartItems,
            subtotal: totalPrice,
            shipping: 0,
            total: totalPrice,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        navigate('/checkout');
    };

    return (
        <>
            <UserNav />
            <div className="container py-5">
                <h1 className="mb-4">Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="alert alert-info text-center">
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-md-8">
                            {cartItems.map(item => (
                                <div key={item.id} className="card mb-3">
                                    <div className="card-body">
                                        <div className="row align-items-center gy-2 gy-md-0">
                                            <div className="col-12 col-md-2 mb-2 mb-md-0">
                                                <img src={item.image} alt={item.name} className="img-fluid" />
                                            </div>
                                            <div className="col-12 col-md-3 mb-2 mb-md-0">
                                                <h5 className="mb-1">{item.name}</h5>
                                                <p className="text-muted mb-0">৳{item.price}</p>
                                            </div>
                                            <div className="col-12 col-md-3 mb-2 mb-md-0">
                                                <div className="input-group input-group-sm">
                                                    <button 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        −
                                                    </button>
                                                    <input 
                                                        type="text" 
                                                        className="form-control text-center" 
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                    <button 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-2 text-start text-md-end">
                                                <p className="fw-bold mb-0">৳{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <div className="col-6 col-md-2 text-end">
                                                <button 
                                                    className="btn btn-sm btn-danger w-100"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-md-4">
                            <div className="card sticky-top" style={{ top: '100px' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Order Summary</h5>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>৳{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Shipping:</span>
                                        <span>৳0.00</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold mb-3">
                                        <span>Total:</span>
                                        <span>৳{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <button 
                                        className="btn btn-warning w-100 fw-bold"
                                        onClick={handleCheckout}
                                        disabled={cartItems.length === 0}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Cart;
