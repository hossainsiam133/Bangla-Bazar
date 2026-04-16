import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Checkout.css';
import { ORDER_API } from './config/api.js';

function Checkout() {
    const navigate = useNavigate();
    const [checkoutData, setCheckoutData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        method: 'Cash on Delivery',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Load checkout data and user info
        const stored = localStorage.getItem('checkoutData');
        const userStored = localStorage.getItem('bb_user');

        if (!stored) {
            setError('No checkout data found. Please go back to your cart.');
            setTimeout(() => navigate('/cart'), 2000);
            return;
        }

        if (!userStored) {
            setError('User not logged in. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        try {
            const checkout = JSON.parse(stored);
            const userData = JSON.parse(userStored);
            setCheckoutData(checkout);
            setUser(userData);
            setFormData(prev => ({
                ...prev,
                phone: userData.phoneNumber || ''
            }));
        } catch (err) {
            setError('Error loading checkout data. Please try again.');
            console.error('Parse error:', err);
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.address.trim()) {
            setError('Please enter a delivery address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Please enter a phone number');
            return false;
        }
        if (formData.address.trim().length < 10) {
            setError('Address must be at least 10 characters');
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            // Create order object
            const order = {
                userId: user.id,
                address: formData.address,
                method: formData.method,
                totalProducts: checkoutData.items.length,
                totalPrice: checkoutData.total,
                placedOn: new Date().toISOString(),
                paymentStatus: 'Pending' // Admin will update this status
            };

            // Post order to backend
            const response = await fetch(ORDER_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const savedOrder = await response.json();

            // Clear cart and checkout data after successful order
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartCount');
            localStorage.removeItem('checkoutData');

            setSuccess('Order placed successfully!');

            // Store order details for confirmation page
            localStorage.setItem('lastOrder', JSON.stringify({
                orderId: savedOrder.id,
                ...savedOrder
            }));

            // Redirect to order confirmation page
            setTimeout(() => {
                navigate('/order-confirmation', { state: { orderId: savedOrder.id } });
            }, 1500);

        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.message || 'Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    if (!checkoutData || !user) {
        return (
            <>
                <UserNav />
                <div className="container py-5 text-center">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!error && <p>Loading checkout...</p>}
                </div>
            </>
        );
    }

    return (
        <>
            <UserNav />
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8">
                        <h2 className="mb-4">Checkout</h2>

                        {/* Delivery Address Section */}
                        <div className="card mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Delivery Address</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                        <strong>Full Address</strong>
                                    </label>
                                    <textarea
                                        id="address"
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter your complete delivery address (house number, street, area, city, postal code)"
                                        rows="4"
                                    />
                                    <small className="text-muted">Minimum 10 characters required</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">
                                        <strong>Phone Number</strong>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Your phone number"
                                    />
                                </div>

                                <div className="mb-0">
                                    <label htmlFor="method" className="form-label">
                                        <strong>Payment Method</strong>
                                    </label>
                                    <select
                                        id="method"
                                        className="form-select"
                                        name="method"
                                        value={formData.method}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Cash on Delivery">Cash on Delivery</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Mobile Banking">Mobile Banking</option>
                                        <option value="Card Payment">Card Payment</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Section */}
                        <div className="card mb-4">
                            <div className="card-header bg-secondary text-white">
                                <h5 className="mb-0">Order Items ({checkoutData.items.length})</h5>
                            </div>
                            <div className="card-body">
                                {checkoutData.items.map((item) => (
                                    <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <div>
                                            <p className="mb-0 fw-bold">{item.name}</p>
                                            <small className="text-muted">{item.brand} • {item.weight}</small>
                                        </div>
                                        <div className="text-end">
                                            <p className="mb-0">x{item.quantity}</p>
                                            <p className="mb-0 fw-bold">৳{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setError('')}
                                ></button>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {success}
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="col-lg-4">
                        <div className="card sticky-top" style={{ top: '100px' }}>
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Order Summary</h5>
                            </div>
                            <div className="card-body">
                                {/* User Info */}
                                <div className="mb-3 pb-3 border-bottom">
                                    <p className="mb-1"><small className="text-muted">Customer</small></p>
                                    <p className="mb-0 fw-bold">{user.name}</p>
                                    <p className="mb-0 small text-muted">{user.email}</p>
                                </div>

                                {/* Price Breakdown */}
                                <div className="mb-2">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>৳{checkoutData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Shipping:</span>
                                        <span className="text-success">FREE</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold mb-3">
                                        <span>Total Amount:</span>
                                        <span className="text-primary fs-5">৳{checkoutData.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    className="btn btn-warning w-100 fw-bold py-2"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>

                                {/* Info Message */}
                                <div className="alert alert-info mt-3 mb-0 small">
                                    <strong>Note:</strong> Your order status will be updated to "Completed" or "Pending" by the admin after verification.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;
