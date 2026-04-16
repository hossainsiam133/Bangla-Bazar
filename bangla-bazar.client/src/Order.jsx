import { useEffect, useState } from 'react';
import './Order.css';
import UserNav from './UserNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ORDER_API } from './config/api.js';

function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user from localStorage
        const userStored = localStorage.getItem('bb_user');
        if (userStored) {
            try {
                const userData = JSON.parse(userStored);
                setUser(userData);
                fetchUserOrders(userData.id);
            } catch (err) {
                setError('Error loading user information');
                console.error('User parse error:', err);
            }
        } else {
            setError('User not logged in');
            setLoading(false);
        }
    }, []);

    const fetchUserOrders = async (userId) => {
        try {
            setLoading(true);
            setError('');

            // Fetch all orders from backend
            const response = await fetch(ORDER_API);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const allOrders = await response.json();

            // Filter orders for current user
            const userOrders = allOrders.filter(order => order.userId === userId);
            setOrders(userOrders.sort((a, b) => new Date(b.placedOn) - new Date(a.placedOn)));
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleTrackOrder = (e) => {
        e.preventDefault();
        if (selectedOrder) {
            alert(`Tracking Order #BB-${String(selectedOrder.id).padStart(6, '0')}\nStatus: ${selectedOrder.paymentStatus}`);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Pending': 'bg-warning text-dark',
            'Processing': 'bg-info text-white',
            'Completed': 'bg-success text-white',
            'Shipped': 'bg-primary text-white',
            'Delivered': 'bg-success text-white',
            'Cancelled': 'bg-danger text-white'
        };
        return statusMap[status] || 'bg-secondary text-white';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <UserNav />
            <div className="container py-5">
                <div className="row mb-4 align-items-center">
                    <div className="col">
                        <h1 className="mb-0">My Orders</h1>
                        <small className="text-muted">Total Orders: {orders.length}</small>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError('')}
                        ></button>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    // Empty State
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="64"
                                height="64"
                                fill="#dee2e6"
                                className="bi bi-inbox mb-3"
                                viewBox="0 0 16 16"
                            >
                                <path d="M4.98 4a.5.5 0 0 0-.39.191L1.412 8H.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-.912l-3.172-3.809A.5.5 0 0 0 11.02 4H4.98zM16 11H1v2h15v-2z" />
                                <path d="M6.854 7.5H9.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V8a.5.5 0 0 1 .5-.5H7a.5.5 0 0 0 0-1H6.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5V8a1.5 1.5 0 0 0-1.5-1.5h-.5a.5.5 0 0 0 0 1z" />
                            </svg>
                            <h5>No Orders Yet</h5>
                            <p className="text-muted">You haven't placed any orders. Start shopping now!</p>
                            <a href="/home" className="btn btn-primary">
                                Continue Shopping
                            </a>
                        </div>
                    </div>
                ) : (
                    // Orders Table
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Your Orders</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order ID</th>
                                        <th className="d-none d-md-table-cell">Date</th>
                                        <th className="d-none d-lg-table-cell">Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="fw-bold">
                                                #BB-{String(order.id).padStart(6, '0')}
                                            </td>
                                            <td className="d-none d-md-table-cell text-muted">
                                                <small>{formatDate(order.placedOn)}</small>
                                            </td>
                                            <td className="d-none d-lg-table-cell">
                                                <span className="badge bg-light text-dark">
                                                    {order.totalProducts} item(s)
                                                </span>
                                            </td>
                                            <td className="fw-bold text-primary">
                                                ৳{order.totalPrice.toFixed(2)}
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(order.paymentStatus)}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleViewDetails(order)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Order Status Legend */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title fw-bold mb-3">Order Status Guide</h6>
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <div>
                                            <span className="badge bg-warning text-dark p-2">Pending</span>
                                            <p className="small text-muted mt-2 mb-0">
                                                Awaiting admin confirmation
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div>
                                            <span className="badge bg-info text-white p-2">Processing</span>
                                            <p className="small text-muted mt-2 mb-0">
                                                Being prepared for shipment
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div>
                                            <span className="badge bg-primary text-white p-2">Shipped</span>
                                            <p className="small text-muted mt-2 mb-0">
                                                On its way to you
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div>
                                            <span className="badge bg-success text-white p-2">Completed</span>
                                            <p className="small text-muted mt-2 mb-0">
                                                Order delivered
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    Order #BB-{String(selectedOrder.id).padStart(6, '0')}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Order Info */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1"><small>Order Date</small></p>
                                        <p className="fw-bold">{formatDate(selectedOrder.placedOn)}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1"><small>Status</small></p>
                                        <p>
                                            <span className={`badge ${getStatusBadge(selectedOrder.paymentStatus)}`}>
                                                {selectedOrder.paymentStatus}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                {/* Delivery Info */}
                                <h6 className="fw-bold mb-3">Delivery Information</h6>
                                <div className="bg-light p-3 rounded mb-4">
                                    <p className="mb-1"><small className="text-muted">Address</small></p>
                                    <p className="mb-3">{selectedOrder.address}</p>
                                    <p className="mb-1"><small className="text-muted">Payment Method</small></p>
                                    <p className="mb-0">{selectedOrder.method}</p>
                                </div>

                                <hr />

                                {/* Order Summary */}
                                <h6 className="fw-bold mb-3">Order Summary</h6>
                                <div className="row">
                                    <div className="col-md-8">
                                        <p><small className="text-muted">Total Items</small></p>
                                        <p className="fw-bold">{selectedOrder.totalProducts} item(s)</p>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <p><small className="text-muted">Total Amount</small></p>
                                        <p className="fw-bold text-primary fs-5">
                                            ৳{selectedOrder.totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleTrackOrder}
                                >
                                    Track Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Order;
