import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserNav from './UserNav.jsx';
import Footer from './Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { addProductToCart } from './cart.js';
import { PRODUCT_API, SERVER_BASE_URL } from './config/api.js';

function Home() {
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);
    const [offeredItems, setOfferedItems] = useState([]);
    const [honeyItems, setHoneyItems] = useState([]);
    const [datesItems, setDatesItems] = useState([]);
    const [cookingEssentialItems, setCookingEssentialItems] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [imageErrors, setImageErrors] = useState({});
    const [cartMessage, setCartMessage] = useState('');

    const banners = [
        { id: 1,name:"#", image: 'Assets/Banner01.jpg' },
        { id: 2,name:"Dates", image: 'Assets/Banner02.png' },
        { id: 3,name:"Honey", image: 'Assets/Banner03.jpeg' },
        { id: 4,name:"Oil & Ghee", image: 'Assets/Banner04.jpeg' }
    ];

    const lastBanner = { id: 5, image: 'Assets/Banner05.jpeg' };
    const buildBannerFallback = (label, width, height) =>
        `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">${label}</text></svg>`
        )}`;
    const bannerFallbackImage = buildBannerFallback('Banner', 1200, 400);
    const banner05FallbackImage = buildBannerFallback('Banner 05', 400, 500);

    const user = (() => {
        try { return JSON.parse(localStorage.getItem('bb_user')); } catch { return {}; }
    })();

    const categories = [
        { id: 1, name: 'Honey', icon: '🍯', image: 'Assets/Category_Honey.png', color: '#FFD700' },
        { id: 2, name: 'Dates', icon: '📅', image: 'Assets/Category_Dates.png', color: '#8B4513' },
        { id: 3, name: 'Spices', icon: '🌶️', image: 'Assets/Category_Spices.png', color: '#DC143C' },
        { id: 4, name: 'Oil & Ghee', icon: '🫒', image: 'Assets/Category_OilGhee.png', color: '#D2B48C' }
    ];

    const brands = [
        { id: 1, name: 'GhorerBazar', image: 'Assets/Brand_GhorerBazar.png' },
        { id: 2, name: 'Khejuri', image: 'Assets/Brand_Khejuri.png' },
        { id: 3, name: 'Shosti', image: 'Assets/Brand_Shosti.png' },
        { id: 4, name: 'HoneyRaj', image: 'Assets/Brand_HoneyRaj.png' },
        { id: 5, name: 'Palermo', image: 'Assets/Brand_Palermo.png' },
        { id: 6, name: 'CeylonNaturals', image: 'Assets/Brand_CeylonNaturals.png' }
    ];

    useEffect(() => {
        fetchOfferedItems();
        fetchCategoryItems();
    }, []);

    useEffect(() => {
        const bannerInterval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(bannerInterval);
    }, []);

    useEffect(() => {
        if (!cartMessage) return;

        const messageTimer = setTimeout(() => {
            setCartMessage('');
        }, 2500);

        return () => clearTimeout(messageTimer);
    }, [cartMessage]);

    const fetchOfferedItems = async () => {
        try {
            setLoadingOffers(true);
            const response = await fetch(PRODUCT_API);
            if (!response.ok) throw new Error('Failed to fetch products');

            const allProducts = await response.json();

            // Filter products with previousPrice
            const offered = allProducts.filter(
                product => product.previousPrice && product.previousPrice > product.price
            );

            setOfferedItems(offered);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoadingOffers(false);
        }
    };

    const fetchCategoryItems = async () => {
        try {
            setLoadingCategories(true);
            const response = await fetch(PRODUCT_API);
            if (!response.ok) throw new Error('Failed to fetch products');

            const allProducts = await response.json();

            // Filter products by category
            const honey = allProducts.filter(p => p.category?.toLowerCase() === 'honey').slice(0, 5);
            const dates = allProducts.filter(p => p.category?.toLowerCase() === 'dates').slice(0, 5);
            const cooking = allProducts.filter(p =>
                p.category?.toLowerCase() === 'spices' || p.category?.toLowerCase() === 'oil & ghee'
            ).slice(0, 8);

            setHoneyItems(honey);
            setDatesItems(dates);
            setCookingEssentialItems(cooking);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('bb_token');
        localStorage.removeItem('bb_user');
        navigate('/login');
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/category/${categoryName}`);
    };

    const handleBrandClick = (brandName) => {
        navigate(`/brand/${brandName}`);
    };

    const handleCookingEssentialsClick = () => {
        navigate('/cooking-essentials');
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    const handleAddToCart = (product) => {
        addProductToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            brand: product.brand,
            weight: product.weight,
            image: getImageUrl(product.imageUrl)
        });
        setCartMessage(`${product.name} added to cart!`);
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;

        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        const baseUrl = SERVER_BASE_URL;
        const normalizedPath = imageUrl.replace(/^\/+/, '');

        if (/^assets\//i.test(normalizedPath)) {
            return `${baseUrl}/${normalizedPath}`;
        }

        if (imageUrl.startsWith('/')) {
            return baseUrl + imageUrl;
        }

        return `${baseUrl}/uploads/${normalizedPath}`;
    };

    return (
        <>
            <UserNav />

            {cartMessage && (
                <div className="home-toast" role="status" aria-live="polite">
                    {cartMessage}
                </div>
            )}
            
            {/* Banner Carousel Section */}
            <section className="banner-carousel-section">
                <div className="banner-container">
                    <div className="banner-wrapper" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
                        {banners.map((banner) => (
                            <div key={banner.id} className="banner-slide">
                                <img
                                    onClick={()=>handleCategoryClick(banner.name)}
                                    src={getImageUrl(banner.image)}
                                    alt={`Banner ${banner.id}`}
                                    className="banner-image"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = bannerFallbackImage;
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Banner Indicators */}
                <div className="banner-indicators">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${currentBanner === index ? 'active' : ''}`}
                            onClick={() => setCurrentBanner(index)}
                            aria-label={`Go to banner ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Fixed Last Banner - Right Side */}
                <div className="fixed-banner-right">
                    <img
                       onClick={()=> handleCategoryClick("Oil & Ghee")}
                        src={getImageUrl(lastBanner.image)}
                        alt="Banner 05"
                        className="fixed-banner-image"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = banner05FallbackImage;
                        }}
                    />
                </div>
            </section>

            <div className="container py-4 py-md-5">
                {/* <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Welcome, {user?.name ?? 'User'}!</h2>
                        <span className="badge bg-success px-3 py-2">User</span>
                    </div>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                <p className="text-muted">Browse our products and shop the best deals on Bangla Bazar.</p> */}

                {/* Featured Categories Section */}
                <section className="featured-categories-section mt-5 mb-5">
                    <h3 className="fw-bold mb-4">Featured Categories</h3>
                    <div className="categories-slider-container">
                        <div className="categories-slider">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="category-card"
                                    onClick={() => handleCategoryClick(category.name)}
                                    style={{ '--category-color': category.color }}
                                >
                                    <div className="category-icon-wrapper">
                                        <img src={getImageUrl(category.image)} alt={category.name} className="category-icon" />
                                    </div>
                                    <h5 className="category-name">{category.name}</h5>
                                    <span className="category-arrow">→</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Offered Items Section */}
                <section className="offered-items-section mt-5 mb-5">
                    <h3 className="fw-bold mb-4"><u><b>Offered Items</b></u></h3>
                    {loadingOffers ? (
                        <div className="d-flex justify-content-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : offeredItems.length > 0 ? (
                        <div className="offered-items-grid">
                            {offeredItems.map((product) => (
                                <div
                                    key={product.id}
                                    className="offered-product-card"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="offered-product-image-container">
                                        {getImageUrl(product.imageUrl) && !imageErrors[product.id] ? (
                                            <img
                                                src={getImageUrl(product.imageUrl)}
                                                alt={product.name}
                                                className="offered-product-image"
                                                onError={() => handleImageError(product.id)}
                                            />
                                        ) : (
                                            <div className="offered-product-image-placeholder">{product.name}</div>
                                        )}
                                        <span className="offer-discount-badge">
                                            {Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)}% OFF
                                        </span>
                                    </div>
                                    <div className="offered-product-body">
                                        <h6 className="offered-product-name">{product.name}</h6>
                                        <p className="offered-product-brand">
                                            <small className="text-muted">{product.brand}</small>
                                        </p>
                                        <div className="offered-product-price-section">
                                            <span className="offered-product-price">৳{product.price}</span>
                                            <span className="offered-product-previous-price">৳{product.previousPrice}</span>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-success w-100 mt-2"
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
                            <p className="text-muted fs-5">No special offers available right now.</p>
                        </div>
                    )}
                </section>

                {/* Brands Section */}
                <section className="brands-section mt-5 mb-5">
                    <h3 className="fw-bold mb-4"><u>Our Brands</u></h3>
                    <div className="brands-grid-container">
                        <div className="brands-grid">
                            {brands.map((brand) => (
                                <div
                                    key={brand.id}
                                    className="brand-logo-card"
                                    onClick={() => handleBrandClick(brand.name)}
                                >
                                    <div className="brand-logo-wrapper">
                                        <img
                                            src={getImageUrl(brand.image)}
                                            alt={brand.name}
                                            className="brand-logo"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="brand-name-fallback">{brand.name}</div>
                                    </div>
                                    <p className="brand-name-text">{brand.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Category Sliders Section */}
                {/* Honey Items Slider */}
                {honeyItems.length > 0 && (
                    <section className="category-slider-section mt-5 mb-5">
                        <div className="slider-header">
                            <h3 className="fw-bold mb-4"><u>All Natural Honey</u></h3>
                            <button
                                className="btn btn-link text-primary"
                                onClick={() => handleCategoryClick('Honey')}
                            >
                                View all Items →
                            </button>
                        </div>
                        <div className="category-products-slider">
                            {honeyItems.map((product) => (
                                <div
                                    key={product.id}
                                    className="slider-product-card"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="slider-product-image-container">
                                        {getImageUrl(product.imageUrl) && !imageErrors[product.id] ? (
                                            <img
                                                src={getImageUrl(product.imageUrl)}
                                                alt={product.name}
                                                className="slider-product-image"
                                                onError={() => handleImageError(product.id)}
                                            />
                                        ) : (
                                            <div className="slider-product-image-placeholder">{product.name}</div>
                                        )}
                                    </div>
                                    <h6 className="slider-product-name">{product.name} {product.weight}</h6>
                                    <p className="slider-product-price">৳{product.price} <strike className="offered-product-previous-price">{product.previousPrice?product.previousPrice:null}</strike></p> 
                                        <button
                                            className="btn btn-sm btn-success w-100 mt-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Dates Items Slider */}
                {datesItems.length > 0 && (
                    <section className="category-slider-section mt-5 mb-5">
                        <div className="slider-header">
                            <h3 className="fw-bold mb-4"><u>Premium Dates</u></h3>
                            <button
                                className="btn btn-link text-primary"
                                onClick={() => handleCategoryClick('Dates')}
                            >
                                View all Items →
                            </button>
                        </div>
                        <div className="category-products-slider">
                            {datesItems.map((product) => (
                                <div
                                    key={product.id}
                                    className="slider-product-card"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="slider-product-image-container">
                                        {getImageUrl(product.imageUrl) && !imageErrors[product.id] ? (
                                            <img
                                                src={getImageUrl(product.imageUrl)}
                                                alt={product.name}
                                                className="slider-product-image"
                                                onError={() => handleImageError(product.id)}
                                            />
                                        ) : (
                                            <div className="slider-product-image-placeholder">{product.name}</div>
                                        )}
                                    </div>
                                    <h6 className="slider-product-name">{product.name} {product.weight}</h6>
                                    <p className="slider-product-price">৳{product.price} <strike className="offered-product-previous-price">{product.previousPrice?product.previousPrice:null}</strike></p> 
                                      {/* <div className="offered-product-price-section">
                                            <span className="offered-product-price">৳{product.price}</span>
                                            <span className="offered-product-previous-price">৳{product.previousPrice}</span>
                                        </div> */}
                                        <button
                                            className="btn btn-sm btn-success w-100 mt-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Cooking Essential Items Slider */}
                {cookingEssentialItems.length > 0 && (
                    <section className="category-slider-section mt-5 mb-5">
                        <div className="slider-header">
                            <h3 className="fw-bold mb-4"> <u>Cooking Essentials</u></h3>
                            <button
                                className="btn btn-link text-primary"
                                onClick={handleCookingEssentialsClick}
                            >
                                View all Items →
                            </button>
                        </div>
                        <div className="category-products-slider">
                            {cookingEssentialItems.map((product) => (
                                <div
                                    key={product.id}
                                    className="slider-product-card"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="slider-product-image-container">
                                        {getImageUrl(product.imageUrl) && !imageErrors[product.id] ? (
                                            <img
                                                src={getImageUrl(product.imageUrl)}
                                                alt={product.name}
                                                className="slider-product-image"
                                                onError={() => handleImageError(product.id)}
                                            />
                                        ) : (
                                            <div className="slider-product-image-placeholder">{product.name}</div>
                                        )}
                                    </div>
                                   <h6 className="slider-product-name">{product.name} {product.weight}</h6>
                                    <p className="slider-product-price">৳{product.price} <strike className="offered-product-previous-price">{product.previousPrice?product.previousPrice:null}</strike></p> 
                                        <button
                                            className="btn btn-sm btn-success w-100 mt-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
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

export default Home;
