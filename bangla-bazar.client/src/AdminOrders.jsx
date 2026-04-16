import { useState, useEffect } from 'react';
import { ORDER_API } from './config/api.js';

function AdminOrders() {
    const [showOrders, setShowOrders] = useState(false);
    const [showUpdateStatus, setShowUpdateStatus] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [statistics, setStatistics] = useState(null);
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const response = await fetch(ORDER_API);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
            setShowOrders(true);
            setShowUpdateStatus(false);
            setShowStatistics(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchStatistics = async () => {
        setStatisticsLoading(true);
        try {
            const response = await fetch(ORDER_API);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();

            const stats = {
                totalOrders: data.length,
                totalRevenue: data.reduce((sum, order) => sum + order.totalPrice, 0),
                pendingOrders: data.filter(o => o.paymentStatus === 'Pending').length,
                completedOrders: data.filter(o => o.paymentStatus === 'Completed').length,
                averageOrderValue: data.length > 0 ? (data.reduce((sum, order) => sum + order.totalPrice, 0) / data.length).toFixed(2) : 0
            };

            setStatistics(stats);
            setShowStatistics(true);
            setShowOrders(false);
            setShowUpdateStatus(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setStatisticsLoading(false);
        }
    };

    const handleBackToMenu = () => {
        setShowOrders(false);
        setShowUpdateStatus(false);
        setShowStatistics(false);
        setEditingOrder(null);
        setNewStatus('');
    };

    const startUpdateStatus = (order) => {
        setEditingOrder(order);
        setNewStatus(order.paymentStatus);
        setShowUpdateStatus(true);
        setShowOrders(false);
        setShowStatistics(false);
    };

    const handleUpdateStatus = async () => {
        if (!newStatus.trim()) {
            setMessage({ type: 'error', text: 'Please select a status' });
            return;
        }

        try {
            const updatedOrder = { ...editingOrder, paymentStatus: newStatus };
            const response = await fetch(`${ORDER_API}/${editingOrder.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOrder),
            });

            if (!response.ok) throw new Error('Failed to update order status');

            setMessage({ type: 'success', text: 'Order status updated successfully!' });
            setEditingOrder(null);
            setNewStatus('');
            setShowUpdateStatus(false);

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            fetchOrders(); // Refresh orders
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Order Management</h2>
                <p className="section-subtitle">Update order status and track shipments</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} role="alert">
                    {message.text}
                </div>
            )}

            {!showOrders && !showUpdateStatus && !showStatistics ? (
                <div className="content-placeholder">
                    <div className="btn-group-vertical">
                        <button
                            className="btn btn-info"
                            onClick={fetchOrders}
                        >
                            📋 View All Orders
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setShowUpdateStatus(true);
                                if (orders.length === 0) fetchOrders();
                            }}
                        >
                            🔄 Update Order Status
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={fetchStatistics}
                        >
                            📊 Order Statistics
                        </button>
                    </div>
                    <p className="mt-4 text-muted">Select an option to manage orders...</p>
                </div>
            ) : showOrders ? (
                <div className="orders-list-container">
                    <div className="orders-header">
                        <h3>All Orders</h3>
                        <button className="btn btn-secondary" onClick={handleBackToMenu}>← Back</button>
                    </div>

                    {ordersLoading ? (
                        <div className="loading-state">
                            <p>Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="no-data">
                            <p>No orders found.</p>
                        </div>
                    ) : (
                        <div className="orders-table-responsive">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>User ID</th>
                                        <th>Payment Method</th>
                                        <th>Address</th>
                                        <th>Total Products</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                        <th>Placed On</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.userId}</td>
                                            <td>{order.method}</td>
                                            <td>{order.address}</td>
                                            <td>{order.totalPro}</td>
                                            <td>৳ {parseFloat(order.totalPrice).toFixed(2)}</td>
                                            <td>
                                                <span className={`status-badge status-${order.paymentStatus.toLowerCase()}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td>{new Date(order.placedOn).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => startUpdateStatus(order)}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : showUpdateStatus ? (
                <div className="update-status-container">
                    <div className="update-header">
                        <h3>Update Order Status</h3>
                        <button className="btn btn-secondary" onClick={handleBackToMenu}>← Back</button>
                    </div>

                    {!editingOrder ? (
                        ordersLoading ? (
                            <div className="loading-state">
                                <p>Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="no-data">
                                <p>No orders found.</p>
                            </div>
                        ) : (
                            <div className="orders-select-list">
                                <h4>Select an order to update:</h4>
                                <div className="orders-grid">
                                    {orders.map(order => (
                                        <div
                                            key={order.id}
                                            className="order-select-card"
                                            onClick={() => startUpdateStatus(order)}
                                        >
                                            <p className="order-id">Order #{order.id}</p>
                                            <p className="order-detail">User ID: {order.userId}</p>
                                            <p className="order-detail">৳ {parseFloat(order.totalPrice).toFixed(2)}</p>
                                            <p className={`order-status status-${order.paymentStatus.toLowerCase()}`}>
                                                {order.paymentStatus}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="status-update-form">
                            <div className="order-details">
                                <h4>Order #{editingOrder.id}</h4>
                                <p><strong>User ID:</strong> {editingOrder.userId}</p>
                                <p><strong>Total Price:</strong> ৳ {parseFloat(editingOrder.totalPrice).toFixed(2)}</p>
                                <p><strong>Payment Method:</strong> {editingOrder.method}</p>
                                <p><strong>Address:</strong> {editingOrder.address}</p>
                                <p><strong>Current Status:</strong> <span className={`status-badge status-${editingOrder.paymentStatus.toLowerCase()}`}>{editingOrder.paymentStatus}</span></p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="statusSelect">Update Status *</label>
                                <select
                                    id="statusSelect"
                                    className="form-control"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="">-- Select Status --</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button
                                    className="btn btn-success"
                                    onClick={handleUpdateStatus}
                                >
                                    ✅ Update Status
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditingOrder(null);
                                        setNewStatus('');
                                    }}
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : showStatistics ? (
                <div className="statistics-container">
                    <div className="statistics-header">
                        <h3>Order Statistics</h3>
                        <button className="btn btn-secondary" onClick={handleBackToMenu}>← Back</button>
                    </div>

                    {statisticsLoading ? (
                        <div className="loading-state">
                            <p>Loading statistics...</p>
                        </div>
                    ) : statistics ? (
                        <div className="stats-grid">
                            <div className="stat-card total-orders">
                                <div className="stat-icon">📦</div>
                                <div className="stat-content">
                                    <h3>Total Orders</h3>
                                    <p className="stat-number">{statistics.totalOrders}</p>
                                </div>
                            </div>

                            <div className="stat-card total-revenue">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <h3>Total Revenue</h3>
                                    <p className="stat-number">৳ {statistics.totalRevenue.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="stat-card pending-orders">
                                <div className="stat-icon">⏳</div>
                                <div className="stat-content">
                                    <h3>Pending Orders</h3>
                                    <p className="stat-number">{statistics.pendingOrders}</p>
                                </div>
                            </div>

                            <div className="stat-card completed-orders">
                                <div className="stat-icon">✅</div>
                                <div className="stat-content">
                                    <h3>Completed Orders</h3>
                                    <p className="stat-number">{statistics.completedOrders}</p>
                                </div>
                            </div>

                            <div className="stat-card average-order">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <h3>Average Order Value</h3>
                                    <p className="stat-number">৳ {statistics.averageOrderValue}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

export default AdminOrders;
