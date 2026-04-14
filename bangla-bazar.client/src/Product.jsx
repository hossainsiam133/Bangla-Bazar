import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserNav from './UserNav.jsx';
import Footer from './Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Product.css';
import { addProductToCart } from './cart.js';

function Product() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        fetchProductDetail();
    }, [productId]);

    useEffect(() => {
        if (product) {
            fetchRelatedProducts();
        }
    }, [product]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:5272/api/product');
            if (!response.ok) throw new Error('Failed to fetch products');

            const allProducts = await response.json();
            const foundProduct = allProducts.find(p => p.id.toString() === productId?.toString());

            if (!foundProduct) {
                setError('Product not found');
                setLoading(false);
                return;
            }

            setProduct(foundProduct);
        } catch (err) {
            setError(err.message || 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async () => {
        try {
            const response = await fetch('http://localhost:5272/api/product');
            if (!response.ok) throw new Error('Failed to fetch products');

            const allProducts = await response.json();
            const related = allProducts
                .filter(p => p.category?.toLowerCase() === product.category?.toLowerCase() && p.id !== product.id)
                .slice(0, 4);

            setRelatedProducts(related);
        } catch (err) {
            console.error('Error fetching related products:', err);
        }
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        const baseUrl = 'http://localhost:5272';
        if (imageUrl.startsWith('/')) {
            return baseUrl + imageUrl;
        }
        return `${baseUrl}/uploads/${imageUrl}`;
    };

    const handleAddToCart = () => {
        addProductToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            brand: product.brand,
            weight: product.weight,
            image: getImageUrl(product.imageUrl)
        }, quantity);

        alert(`${quantity} ${product.name}(s) added to cart!`);
        setQuantity(1);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    if (loading) {
        return (
            <>
                <UserNav />
                <div className="container py-5">
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <UserNav />
                <div className="container py-5">
                    <div className="alert alert-danger text-center" role="alert">
                        <h4>{error || 'Product not found'}</h4>
                        <button className="btn btn-primary mt-3" onClick={() => navigate('/home')}>
                            ← Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const discount = product.previousPrice && product.previousPrice > product.price
        ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
        : 0;

    return (
        <>
            <UserNav />
            <div className="container py-4 py-md-5">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home" className="breadcrumb-link">Home</a></li>
                        <li className="breadcrumb-item">
                            <a href={`/category/${product.category}`} className="breadcrumb-link">{product.category}</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                    </ol>
                </nav>

                {/* Product Detail Section */}
                <div className="product-detail-container">
                    {/* Image Gallery Section */}
                    <div className="product-image-section">
                        <div className="main-image-container">
                            {getImageUrl(product.imageUrl) && !imageError ? (
                                <img
                                    src={getImageUrl(product.imageUrl)}
                                    alt={product.name}
                                    className="product-main-image"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="product-image-placeholder">
                                    <div className="placeholder-text">{product.name}</div>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="product-discount-badge">{discount}% OFF</div>
                            )}
                        </div>
                    </div>

                    {/* Product Information Section */}
                    <div className="product-info-section">
                        {/* Header */}
                        <div className="product-header">
                            <h1 className="product-title">{product.name}</h1>
                            <div className="product-meta">
                                <span className="product-brand">Brand: <strong>{product.brand}</strong></span>
                                {/* <span className="product-category">Category: <strong>{product.category}</strong></span> */}
                            </div>
                        </div>

                        {/* Rating Section (Placeholder for future implementation) */}
                        <div className="product-rating-section mb-3">
                            <div className="rating-stars">
                                <span className="stars">★★★★★</span>
                                <span className="rating-count">(0 reviews)</span>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="product-price-section">
                            <div className="price-display">
                                <span className="current-price">৳{product.price}</span>
                                {product.previousPrice && product.previousPrice > product.price && (
                                    <>
                                        <span className="previous-price">৳{product.previousPrice}</span>
                                        <span className="savings">Save ৳{product.previousPrice - product.price}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="product-specs-section">
                            <div className="spec-item">
                                <span className="spec-label">Weight/Size:</span>
                                <span className="spec-value">{product.weight}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="product-description-section">
                            <h3 className="section-title">Product Description</h3>
                            <p className="product-description">
                                {product.productDetails || 'High-quality product from Bangla Bazar. Premium selection to ensure the best experience for our valued customers.'}
                            </p>
                        </div>

                        {/* Stock & Quantity Section */}
                        <div className="product-purchase-section">
                            <div className="quantity-selector">
                                <label htmlFor="quantity" className="quantity-label">Quantity:</label>
                                <select
                                    id="quantity"
                                    className="quantity-select"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="total-price">
                                <span className="total-label">Total:</span>
                                <span className="total-value">৳{(product.price * quantity).toLocaleString('bn-BD')}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="product-actions">
                            <button
                                className="btn btn-primary btn-lg btn-add-to-cart"
                                onClick={handleAddToCart}
                            >
                                🛒 Add to Cart
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-lg"
                                onClick={() => navigate('/home')}
                            >
                                ← Continue Shopping
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="product-additional-info">
                            <div className="info-item">
                                <span className="info-icon">✓</span>
                                <span>100% Authentic Products</span>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">✓</span>
                                <span>Fast & Safe Delivery</span>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">✓</span>
                                <span>Easy Returns & Exchanges</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="related-products-section mt-5 mb-5">
                        <h2 className="section-title">Related Products</h2>
                        <div className="related-products-grid">
                            {relatedProducts.map(relProduct => (
                                <div
                                    key={relProduct.id}
                                    className="related-product-card"
                                    onClick={() => navigate(`/product/${relProduct.id}`)}
                                >
                                    <div className="related-product-image">
                                        {getImageUrl(relProduct.imageUrl) ? (
                                            <img
                                                src={getImageUrl(relProduct.imageUrl)}
                                                alt={relProduct.name}
                                                className="related-product-img"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="related-product-placeholder">{relProduct.name}</div>
                                        )}
                                    </div>
                                    <div className="related-product-info">
                                        <h5 className="related-product-name">{relProduct.name}</h5>
                                        <p className="related-product-price">৳{relProduct.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Product;
