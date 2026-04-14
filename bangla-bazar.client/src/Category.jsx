import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserNav from './UserNav.jsx';
import Footer from './Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Category.css';
import { addProductToCart } from './cart.js';

function Category() {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [imageErrors, setImageErrors] = useState({});

    useEffect(() => {
        fetchProductsByCategory();
    }, [categoryName]);

    const fetchProductsByCategory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('http://localhost:5272/api/product');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const allProducts = await response.json();
            console.log('All products:', allProducts);
            console.log('First product:', allProducts[0]);
            
            // Filter products by category (case-insensitive)
            const filteredProducts = allProducts.filter(
                product => product.category?.toLowerCase() === categoryName?.toLowerCase()
            );
            
            console.log('Filtered products for', categoryName, ':', filteredProducts);
            
            // Apply sorting
            let sortedProducts = [...filteredProducts];
            switch (sortBy) {
                case 'price-low':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    break;
            }
            
            setProducts(sortedProducts);
        } catch (err) {
            setError(err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryName) {
            fetchProductsByCategory();
        }
    }, [sortBy, categoryName]);

    const handleBackClick = () => {
        navigate('/home');
    };

    const handleProductClick = (productId) => {
        navigate(`/category/${encodeURIComponent(categoryName)}/product/${productId}`);
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        
        // If it's already a full URL, return as is
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        
        // If it's a relative path, construct the full URL
        const baseUrl = 'http://localhost:5272';
        if (imageUrl.startsWith('/')) {
            return baseUrl + imageUrl;
        }
        
        // Otherwise, assume it's in the uploads or images folder
        return `${baseUrl}/uploads/${imageUrl}`;
    };

    const handleAddToCart = (product) => {
        try {
            addProductToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                brand: product.brand,
                weight: product.weight,
                image: getImageUrl(product.imageUrl)
            });

            // Show success message
            alert(`${product.name} added to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        }
    };

    if (loading) {
        return (
            <>
                <UserNav />
                <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <UserNav />
            <div className="container py-4 py-md-5">
                {/* Header Section */}
                <div className="category-header mb-4">
                    <button className="btn btn-outline-secondary btn-sm me-3" onClick={handleBackClick}>
                        ← Back
                    </button>
                    <div>
                        <h2 className="fw-bold mb-1">{categoryName}</h2>
                        <span className="badge bg-info px-3 py-2">{products.length} Products</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                {/* Filter and Sort Section */}
                <div className="filter-section mb-4">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6">
                            {products.length > 0 && (
                                <p className="text-muted mb-3 mb-md-0">
                                    Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
                                </p>
                            )}
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="d-flex gap-2">
                                <label htmlFor="sortSelect" className="form-label mb-0 align-self-center">
                                    Sort by:
                                </label>
                                <select
                                    id="sortSelect"
                                    className="form-select form-select-sm"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="default">Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="products-grid">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="product-card"
                                role="button"
                                tabIndex={0}
                                onClick={() => handleProductClick(product.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleProductClick(product.id);
                                    }
                                }}
                            >
                                <div className="product-image-container">
                                    {(() => {
                                        const imageUrl = getImageUrl(product.imageUrl);
                                        console.log(`Product: ${product.name}, ImageUrl: ${product.imageUrl}, Full URL: ${imageUrl}`);
                                        return imageUrl && !imageErrors[product.id] ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={product.name} 
                                                className="product-image"
                                                onError={() => handleImageError(product.id)}
                                            />
                                        ) : (
                                            <div className="product-image-placeholder">{product.name}</div>
                                        );
                                    })()}
                                    {product.previousPrice > product.price && (
                                        <span className="discount-badge">
                                            {Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="product-body">
                                    <h6 className="product-name">{product.name}</h6>
                                    <p className="product-brand">
                                        <span className="meta-label">Brand</span>
                                        <span className="meta-value">{product.brand || 'N/A'}</span>
                                    </p>
                                    <p className="product-weight">
                                        <span className="meta-label">Weight</span>
                                        <span className="meta-value">{product.weight || 'N/A'}</span>
                                    </p>
                                    <div className="product-price-section">
                                        <span className="product-price">৳{product.price}</span>
                                        {product.previousPrice > product.price && (
                                            <span className="product-previous-price">৳ {product.previousPrice}</span>
                                        )}
                                    </div>
                                    <button 
                                        className="btn btn-sm btn-primary w-100 mt-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted fs-5">No products found in this category.</p>
                        <button className="btn btn-primary" onClick={handleBackClick}>
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Category;
