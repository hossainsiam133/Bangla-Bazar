import { useState, useEffect } from 'react';

function AdminProducts() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showProductsList, setShowProductsList] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        details: '',
        imageUrl: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const uploadImage = async (file) => {
        try {
            const formDataFile = new FormData();
            formDataFile.append('file', file);

            const response = await fetch('http://localhost:5272/api/product/upload-image', {
                method: 'POST',
                body: formDataFile,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Image upload failed');
            }

            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            throw new Error(`Image upload error: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.price || !formData.details.trim() || !selectedFile) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        setLoading(true);
        try {
            // Upload image first
            const imageUrl = await uploadImage(selectedFile);

            // Create product with image URL
            const productData = {
                name: formData.name.trim(),
                price: parseFloat(formData.price),
                productDetails: formData.details.trim(),
                imageUrl: imageUrl
            };

            const response = await fetch('http://localhost:5272/api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            setMessage({ type: 'success', text: 'Product added successfully!' });
            setFormData({ name: '', price: '', details: '', imageUrl: '' });
            setSelectedFile(null);
            setShowAddForm(false);

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to add product' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', price: '', details: '', imageUrl: '' });
        setSelectedFile(null);
        setShowAddForm(false);
        setMessage({ type: '', text: '' });
    };

    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const response = await fetch('http://localhost:5272/api/product');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
            setShowProductsList(true);
            setShowAddForm(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setProductsLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const response = await fetch(`http://localhost:5272/api/product/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            setMessage({ type: 'success', text: 'Product deleted successfully!' });
            fetchProducts(); // Refresh the list
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const handleBackToMenu = () => {
        setShowProductsList(false);
        setShowAddForm(false);
        setShowUpdateForm(false);
        setMessage({ type: '', text: '' });
    };

    const startEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            details: product.productDetails,
            imageUrl: product.imageUrl,
        });
        setShowUpdateForm(true);
        setShowProductsList(false);
        setShowAddForm(false);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.price || !formData.details.trim()) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        setLoading(true);
        try {
            let imageUrl = editingProduct.imageUrl;
            
            // Upload new image if selected
            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile);
            }

            // Update product
            const productData = {
                id: editingProduct.id,
                name: formData.name.trim(),
                price: parseFloat(formData.price),
                productDetails: formData.details.trim(),
                imageUrl: imageUrl
            };

            const response = await fetch(`http://localhost:5272/api/product/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            setMessage({ type: 'success', text: 'Product updated successfully!' });
            setFormData({ name: '', price: '', details: '', imageUrl: '' });
            setSelectedFile(null);
            setEditingProduct(null);
            setShowUpdateForm(false);

            // Refresh products list
            fetchProducts();

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update product' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCancel = () => {
        setFormData({ name: '', price: '', details: '', imageUrl: '' });
        setSelectedFile(null);
        setEditingProduct(null);
        setShowUpdateForm(false);
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Product Management</h2>
                <p className="section-subtitle">Add, update, or delete products</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} role="alert">
                    {message.text}
                </div>
            )}

            {!showAddForm && !showProductsList && !showUpdateForm ? (
                <div className="content-placeholder">
                    <div className="btn-group-vertical">
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowAddForm(true)}
                        >
                            ➕ Add New Product
                        </button>
                        <button 
                            className="btn btn-info"
                            onClick={fetchProducts}
                        >
                            📝 View All Products
                        </button>
                        {/* <button 
                            className="btn btn-warning"
                            onClick={() => setShowUpdateForm(true)}
                        >
                            ✏️ Update Product
                        </button> */}
                    </div>
                    <p className="mt-4 text-muted">Click "Add New Product" to get started...</p>
                </div>
            ) : showProductsList ? (
                <div className="products-list-container">
                    <div className="products-header">
                        <h3>All Products</h3>
                        <button className="btn btn-secondary" onClick={handleBackToMenu}>← Back</button>
                    </div>
                    
                    {productsLoading ? (
                        <div className="loading-state">
                            <p>Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="no-products">
                            <p>No products found. <button className="link-btn" onClick={() => setShowAddForm(true)}>Add one now!</button></p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        <img 
                                            src={`http://localhost:5272${product.imageUrl}`} 
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="product-info">
                                        <h4>{product.name}</h4>
                                        <p className="product-price">৳ {parseFloat(product.price).toFixed(2)}</p>
                                        <p className="product-details">{product.productDetails}</p>
                                        <div className="product-actions">
                                            <button 
                                                className="btn btn-warning btn-sm"
                                                onClick={() => startEditProduct(product)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : showAddForm ? (
                <div className="add-product-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="productName">Product Name *</label>
                            <input
                                type="text"
                                id="productName"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="productPrice">Price *</label>
                            <input
                                type="number"
                                id="productPrice"
                                name="price"
                                className="form-control"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Enter price"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="productDetails">Details *</label>
                            <textarea
                                id="productDetails"
                                name="details"
                                className="form-control"
                                value={formData.details}
                                onChange={handleInputChange}
                                placeholder="Enter product details"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="productImage">Product Image *</label>
                            <input
                                type="file"
                                id="productImage"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileSelect}
                                required
                            />
                            {selectedFile && (
                                <small className="form-text text-muted d-block mt-2">
                                    Selected: {selectedFile.name}
                                </small>
                            )}
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Adding Product...' : '✅ Add Product'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : showUpdateForm && editingProduct ? (
                <div className="add-product-form">
                    <div className="form-header">
                        <h3>Edit Product: {editingProduct.name}</h3>
                    </div>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="form-group">
                            <label htmlFor="productName">Product Name *</label>
                            <input
                                type="text"
                                id="productName"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="productPrice">Price *</label>
                            <input
                                type="number"
                                id="productPrice"
                                name="price"
                                className="form-control"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Enter price"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="productDetails">Details *</label>
                            <textarea
                                id="productDetails"
                                name="details"
                                className="form-control"
                                value={formData.details}
                                onChange={handleInputChange}
                                placeholder="Enter product details"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="productImage">Product Image</label>
                            <div className="current-image-preview">
                                <img 
                                    src={`http://localhost:5272${editingProduct.imageUrl}`} 
                                    alt={editingProduct.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150x100?text=No+Image';
                                    }}
                                />
                                <p className="image-label">Current Image</p>
                            </div>
                            <input
                                type="file"
                                id="productImage"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                            {selectedFile && (
                                <small className="form-text text-muted d-block mt-2">
                                    New image: {selectedFile.name}
                                </small>
                            )}
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Updating Product...' : '✅ Update Product'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={handleUpdateCancel}
                                disabled={loading}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
}

export default AdminProducts;
