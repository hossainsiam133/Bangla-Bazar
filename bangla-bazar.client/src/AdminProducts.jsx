function AdminProducts() {
    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Product Management</h2>
                <p className="section-subtitle">Add, update, or delete products</p>
            </div>
            <div className="content-placeholder">
                <div className="btn-group-vertical">
                    <button className="btn btn-primary">➕ Add New Product</button>
                    <button className="btn btn-info">📝 View All Products</button>
                    <button className="btn btn-warning">✏️ Update Product</button>
                </div>
                <p className="mt-4 text-muted">Product management interface coming soon...</p>
            </div>
        </div>
    );
}

export default AdminProducts;
