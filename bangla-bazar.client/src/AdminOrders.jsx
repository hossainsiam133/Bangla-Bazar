function AdminOrders() {
    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Order Management</h2>
                <p className="section-subtitle">Update order status and track shipments</p>
            </div>
            <div className="content-placeholder">
                <div className="btn-group-vertical">
                    <button className="btn btn-info">📋 View All Orders</button>
                    <button className="btn btn-primary">🔄 Update Order Status</button>
                    <button className="btn btn-secondary">📊 Order Statistics</button>
                </div>
                <p className="mt-4 text-muted">Order management interface coming soon...</p>
            </div>
        </div>
    );
}

export default AdminOrders;
