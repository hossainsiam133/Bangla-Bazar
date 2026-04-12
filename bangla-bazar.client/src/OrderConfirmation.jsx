import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import 'bootstrap/dist/css/bootstrap.min.css';

function OrderConfirmation() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('lastOrder');
        if (stored) {
            try {
                const orderData = JSON.parse(stored);
                setOrder(orderData);
            } catch (err) {
                console.error('Error loading order:', err);
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <>
                <UserNav />
                <div className="container py-5 text-center">
                    <p>Loading order confirmation...</p>
                </div>
            </>
        );
    }

    if (!order) {
        return (
            <>
                <UserNav />
                <div className="container py-5">
                    <div className="alert alert-warning">
                        <strong>Error:</strong> Order information not found. Please check your orders.
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/order')}>
                        View Orders
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <UserNav />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Success Message */}
                        <div className="text-center mb-5">
                            <div className="mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="80"
                                    height="80"
                                    fill="#28a745"
                                    className="bi bi-check-circle"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                </svg>
                            </div>
                            <h2 className="text-success fw-bold mb-2">Order Placed Successfully!</h2>
                            <p className="text-muted fs-5">Thank you for your order. Your order has been received and is being processed.</p>
                        </div>

                        {/* Order Details Card */}
                        <div className="card mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Order Details</h5>
                            </div>
                            <div className="card-body">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1"><small>Order ID</small></p>
                                        <p className="fw-bold fs-5">#BB-{String(order.orderId).padStart(6, '0')}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1"><small>Order Date</small></p>
                                        <p className="fw-bold">
                                            {new Date(order.placedOn).toLocaleDateString('en-BD', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                time: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1"><small>Delivery Address</small></p>
                                        <p className="fw-bold">{order.address}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1"><small>Payment Method</small></p>
                                        <p className="fw-bold">{order.method}</p>
                                    </div>
                                </div>

                                <hr />

                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1"><small>Order Status</small></p>
                                        <p className="fw-bold">
                                            <span className="badge bg-warning text-dark">{order.paymentStatus}</span>
                                        </p>
                                        <small className="text-muted">
                                            Admin will update the status shortly
                                        </small>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1"><small>Total Amount</small></p>
                                        <p className="fw-bold fs-5 text-primary">৳{order.totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="card mb-4">
                            <div className="card-header bg-secondary text-white">
                                <h5 className="mb-0">Order Summary</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Total Products:</span>
                                    <span className="fw-bold">{order.totalProducts} item(s)</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span className="fw-bold">৳{order.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span className="fw-bold text-success">FREE</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold fs-5">
                                    <span>Total:</span>
                                    <span className="text-primary">৳{order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Alert */}
                        <div className="alert alert-info">
                            <strong>What's Next?</strong>
                            <ul className="mb-0 mt-2">
                                <li>Your order has been placed and assigned Order ID <strong>#BB-{String(order.orderId).padStart(6, '0')}</strong></li>
                                <li>Admin will verify your payment and update the status to "Completed" or "Pending"</li>
                                <li>You'll receive email updates on your order status</li>
                                <li>Check your orders page for real-time updates</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-3 justify-content-center">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/order')}
                            >
                                View All Orders
                            </button>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/home')}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderConfirmation;
