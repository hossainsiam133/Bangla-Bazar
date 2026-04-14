import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from './Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import './Landing.css';
import './UserNav.css';
import {
	CART_UPDATED_EVENT,
	addProductToCart,
	getCartCount,
	persistCartItems,
	readCartItems,
	removeProductFromCart,
	setProductQuantityInCart
} from './cart.js';

function Landing() {
	const navigate = useNavigate();
	const [currentBanner, setCurrentBanner] = useState(0);
	const [offeredItems, setOfferedItems] = useState([]);
	const [honeyItems, setHoneyItems] = useState([]);
	const [datesItems, setDatesItems] = useState([]);
	const [cookingEssentialItems, setCookingEssentialItems] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [loadingOffers, setLoadingOffers] = useState(false);
	const [imageErrors, setImageErrors] = useState({});
	const [cartMessage, setCartMessage] = useState('');
	const [cartItems, setCartItems] = useState([]);
	const [cartCount, setCartCount] = useState(0);
	const browseSectionRef = useRef(null);
	const detailSectionRef = useRef(null);
	const cartSectionRef = useRef(null);

	const banners = [
		{ id: 1, name: '#', image: 'Assets/Banner01.jpg' },
		{ id: 2, name: 'Dates', image: 'Assets/Banner02.png' },
		{ id: 3, name: 'Honey', image: 'Assets/Banner03.jpeg' },
		{ id: 4, name: 'Oil & Ghee', image: 'Assets/Banner04.jpeg' }
	];

	const lastBanner = { id: 5, image: 'Assets/Banner05.jpeg' };

	const categories = [
		{ id: 1, name: 'Honey', image: 'Assets/Category_Honey.png', color: '#FFD700' },
		{ id: 2, name: 'Dates', image: 'Assets/Category_Dates.png', color: '#8B4513' },
		{ id: 3, name: 'Spices', image: 'Assets/Category_Spices.png', color: '#DC143C' },
		{ id: 4, name: 'Oil & Ghee', image: 'Assets/Category_OilGhee.png', color: '#D2B48C' }
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
		fetchHomeData();
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentBanner((prev) => (prev + 1) % banners.length);
		}, 5000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (!cartMessage) return;

		const timer = setTimeout(() => setCartMessage(''), 2200);
		return () => clearTimeout(timer);
	}, [cartMessage]);

	useEffect(() => {
		const refreshCartState = () => {
			const items = readCartItems();
			setCartItems(items);

			const countFromItems = getCartCount(items);
			if (countFromItems > 0) {
				setCartCount(countFromItems);
				return;
			}

			const storedCount = parseInt(localStorage.getItem('cartCount') || '0', 10);
			setCartCount(Number.isNaN(storedCount) ? 0 : storedCount);
		};

		refreshCartState();
		window.addEventListener('storage', refreshCartState);
		window.addEventListener(CART_UPDATED_EVENT, refreshCartState);

		return () => {
			window.removeEventListener('storage', refreshCartState);
			window.removeEventListener(CART_UPDATED_EVENT, refreshCartState);
		};
	}, []);

	const selectedProducts = useMemo(() => {
		if (!selectedCollection) return [];

		if (selectedCollection.type === 'category') {
			return allProducts.filter(
				(product) => product.category?.toLowerCase() === selectedCollection.value.toLowerCase()
			);
		}

		if (selectedCollection.type === 'brand') {
			return allProducts.filter(
				(product) => product.brand?.toLowerCase() === selectedCollection.value.toLowerCase()
			);
		}

		return [];
	}, [allProducts, selectedCollection]);

	const selectedCollectionTitle = selectedCollection
		? `${selectedCollection.value} ${selectedCollection.type === 'category' ? 'Products' : 'Brand Products'}`
		: 'Browse Products';

	const fetchHomeData = async () => {
		try {
			setLoadingOffers(true);
			const response = await fetch('http://localhost:5272/api/product');
			if (!response.ok) throw new Error('Failed to fetch products');

			const products = await response.json();

			setAllProducts(products);
			setOfferedItems(products.filter((product) => product.previousPrice && product.previousPrice > product.price));
			setHoneyItems(products.filter((product) => product.category?.toLowerCase() === 'honey').slice(0, 5));
			setDatesItems(products.filter((product) => product.category?.toLowerCase() === 'dates').slice(0, 5));
			setCookingEssentialItems(
				products
					.filter(
						(product) =>
							product.category?.toLowerCase() === 'spices' ||
							product.category?.toLowerCase() === 'oil & ghee'
					)
					.slice(0, 8)
			);
		} catch (error) {
			console.error('Fetch error:', error);
		} finally {
			setLoadingOffers(false);
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

	const handleImageError = (imageKey) => {
		setImageErrors((prev) => ({
			...prev,
			[imageKey]: true
		}));
	};

	const handleCategorySelect = (categoryName) => {
		setSelectedCollection({ type: 'category', value: categoryName });
		window.requestAnimationFrame(() => {
			browseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	};

	const handleBrandSelect = (brandName) => {
		setSelectedCollection({ type: 'brand', value: brandName });
		window.requestAnimationFrame(() => {
			browseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	};

	const handleProductClick = (product) => {
		setSelectedProduct(product);
		window.requestAnimationFrame(() => {
			detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	};

	const handleCardKeyDown = (event, onActivate) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onActivate();
		}
	};

	const redirectToLogin = () => {
		navigate('/login');
	};

	const handleCartSidebarClick = () => {
		window.requestAnimationFrame(() => {
			cartSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
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

		setCartMessage(`${product.name} added to cart`);
	};

	const handleDecreaseQty = (productId) => {
		const items = readCartItems();
		const target = items.find((item) => item.id === productId);
		if (!target) return;

		const nextQty = Math.max(0, (Number(target.quantity) || 0) - 1);
		const nextItems =
			nextQty === 0
				? items.filter((item) => item.id !== productId)
				: items.map((item) => (item.id === productId ? { ...item, quantity: nextQty } : item));

		persistCartItems(nextItems);
		setProductQuantityInCart(productId, nextQty);
	};

	const handleIncreaseQty = (productId) => {
		const items = readCartItems();
		const target = items.find((item) => item.id === productId);
		if (!target) return;

		const nextQty = (Number(target.quantity) || 0) + 1;
		const nextItems = items.map((item) => (item.id === productId ? { ...item, quantity: nextQty } : item));

		persistCartItems(nextItems);
		setProductQuantityInCart(productId, nextQty);
	};

	const handleRemoveFromCart = (productId) => {
		const items = readCartItems();
		const nextItems = items.filter((item) => item.id !== productId);
		persistCartItems(nextItems);
		removeProductFromCart(productId);
	};

	const renderProductCard = (product, variant) => {
		const imageKey = `${variant}-${product.id}`;
		const clickHandler = () => handleProductClick(product);
		const cardClassName =
			variant === 'browse'
				? 'browse-product-card'
				: variant === 'offered'
					? 'offered-product-card'
					: 'slider-product-card';

		const imageContainerClassName =
			variant === 'browse'
				? 'browse-product-image-container'
				: variant === 'offered'
					? 'offered-product-image-container'
					: 'slider-product-image-container';

		const imageClassName =
			variant === 'browse'
				? 'browse-product-image'
				: variant === 'offered'
					? 'offered-product-image'
					: 'slider-product-image';

		const placeholderClassName =
			variant === 'browse'
				? 'browse-product-image-placeholder'
				: variant === 'offered'
					? 'offered-product-image-placeholder'
					: 'slider-product-image-placeholder';

		const bodyClassName =
			variant === 'browse'
				? 'browse-product-body'
				: variant === 'offered'
					? 'offered-product-body'
					: undefined;

		const nameClassName =
			variant === 'browse'
				? 'browse-product-name'
				: variant === 'offered'
					? 'offered-product-name'
					: 'slider-product-name';

		const priceClassName =
			variant === 'browse'
				? 'browse-product-price'
				: variant === 'offered'
					? 'offered-product-price'
					: 'slider-product-price';

		const previousPriceClassName =
			variant === 'browse'
				? 'browse-product-previous-price'
				: variant === 'offered'
					? 'offered-product-previous-price'
					: 'offered-product-previous-price';

		return (
			<div
				key={product.id}
				className={cardClassName}
				style={{ cursor: 'pointer' }}
				onClick={clickHandler}
				role="button"
				tabIndex={0}
				onKeyDown={(event) => handleCardKeyDown(event, clickHandler)}
			>
				<div className={imageContainerClassName}>
					{getImageUrl(product.imageUrl) && !imageErrors[imageKey] ? (
						<img
							src={getImageUrl(product.imageUrl)}
							alt={product.name}
							className={imageClassName}
							onError={() => handleImageError(imageKey)}
						/>
					) : (
						<div className={placeholderClassName}>{product.name}</div>
					)}
					{product.previousPrice > product.price && (
						<span className="offer-discount-badge">
							{Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)}% OFF
						</span>
					)}
				</div>
				<div className={bodyClassName}>
					<h6 className={nameClassName}>{product.name}</h6>
					{variant !== 'browse' && (
						<p className={variant === 'offered' ? 'offered-product-brand' : 'slider-product-brand'}>
							<small className="text-muted">{product.brand}</small>
						</p>
					)}
					{variant === 'browse' && (
						<p className="browse-product-meta">
							<span className="text-muted">{product.brand || 'N/A'}</span>
							<span className="text-muted">{product.weight || 'N/A'}</span>
						</p>
					)}
					<div className={variant === 'browse' ? 'browse-product-price-row' : 'offered-product-price-section'}>
						<span className={priceClassName}>৳{product.price}</span>
						{product.previousPrice > product.price && (
							<span className={previousPriceClassName}>৳{product.previousPrice}</span>
						)}
					</div>
					<button
						className="btn btn-sm btn-success w-100 mt-2"
						onClick={(event) => {
							event.stopPropagation();
							handleAddToCart(product);
						}}
					>
						Add to Cart
					</button>
					{variant === 'browse' && (
						<button
							className="btn btn-sm btn-outline-primary w-100 mt-2"
							onClick={(event) => {
								event.stopPropagation();
								handleProductClick(product);
							}}
						>
							View Details
						</button>
					)}
				</div>
			</div>
		);
	};

	return (
		<>
			<header className="landing-nav-wrap">
				<div className="container landing-nav">
					<button className="landing-logo-button" onClick={() => navigate('/')} aria-label="Bangla Bazar Home">
						<span className="bb-logo-mark">
							<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="none" viewBox="0 0 24 24" aria-hidden="true">
								<rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
								<path d="M11.8 17.8c-.5-2.5-.1-4.6 1.3-6.5 1.1-1.4 2.6-2.4 4.5-3.1-.5 1.9-1.2 3.5-2.3 4.9-1.2 1.5-2.7 2.6-4.3 3.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M11.9 17.9c-.8-1.3-1.8-2.3-3.2-3.1-1-.5-2-.8-3.1-.9.5 1.2 1.2 2.3 2.2 3.1 1.1.9 2.4 1.2 4.1.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</span>
						<span className="bb-logo-text">
							<span>BANGLA</span>
							<span>BAZAR</span>
						</span>
					</button>
					<div className="landing-nav-items">
						<button className="landing-login-btn" onClick={redirectToLogin}>
							Login
						</button>
					</div>
				</div>
			</header>

			{cartMessage && (
				<div className="home-toast" role="status" aria-live="polite">
					{cartMessage}
				</div>
			)}

			<section className="banner-carousel-section">
				<div className="banner-container">
					<div className="banner-wrapper" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
						{banners.map((banner) => (
							<div key={banner.id} className="banner-slide">
								<img
									// onClick={redirectToLogin}
									src={`http://localhost:5272/${banner.image}`}
									alt={`Banner ${banner.id}`}
									className="banner-image"
									onError={(event) => {
										event.target.src = 'https://via.placeholder.com/1200x400?text=Banner';
									}}
								/>
							</div>
						))}
					</div>
				</div>

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

				<div className="fixed-banner-right">
					<img
						// onClick={redirectToLogin}
						src={`http://localhost:5272/${lastBanner.image}`}
						alt="Banner 05"
						className="fixed-banner-image"
						onError={(event) => {
							event.target.src = 'https://via.placeholder.com/400x500?text=Banner05';
						}}
					/>
				</div>
			</section>

			<div className="container py-4 py-md-5">
				<section className="featured-categories-section mt-5 mb-5">
					<h3 className="fw-bold mb-4">Featured Categories</h3>
					<div className="categories-slider-container">
						<div className="categories-slider">
							{categories.map((category) => (
								<div
									key={category.id}
									className="category-card"
									onClick={() => handleCategorySelect(category.name)}
									style={{ '--category-color': category.color }}
								>
									<div className="category-icon-wrapper">
										<img src={`http://localhost:5272/${category.image}`} alt={category.name} className="category-icon" />
									</div>
									<h5 className="category-name">{category.name}</h5>
									<span className="category-arrow">→</span>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="landing-browse-section mt-5 mb-5" ref={browseSectionRef}>
					<div className="slider-header">
						<h3 className="fw-bold mb-4">
							<u>{selectedCollectionTitle}</u>
						</h3>
						{selectedCollection && (
							<button className="btn btn-link text-primary" onClick={() => setSelectedCollection(null)}>
								Clear selection
							</button>
						)}
					</div>

					{!selectedCollection ? (
						<div className="browse-empty-state">
							<p className="text-muted mb-0">
								Tap a category card or brand card above to see matching products here.
							</p>
						</div>
					) : selectedProducts.length > 0 ? (
						<div className="browse-product-grid">
							{selectedProducts.map((product) => renderProductCard(product, 'browse'))}
						</div>
					) : (
						<div className="browse-empty-state">
							<p className="text-muted mb-0">No products found for this selection.</p>
						</div>
					)}
				</section>

				<section className="landing-detail-section mt-5 mb-5" ref={detailSectionRef}>
					<div className="landing-detail-header">
						<h3 className="fw-bold mb-4"><u>Full Product Details</u></h3>
						{selectedProduct && (
							<button className="btn btn-link text-primary" onClick={() => setSelectedProduct(null)}>
								Clear selection
							</button>
						)}
					</div>

					{selectedProduct ? (
						<div className="landing-detail-card">
							<div className="landing-detail-image-wrap">
								{getImageUrl(selectedProduct.imageUrl) && !imageErrors[`detail-${selectedProduct.id}`] ? (
									<img
										src={getImageUrl(selectedProduct.imageUrl)}
										alt={selectedProduct.name}
										className="landing-detail-image"
										onError={() => handleImageError(`detail-${selectedProduct.id}`)}
									/>
								) : (
									<div className="landing-detail-image-placeholder">{selectedProduct.name}</div>
								)}
							</div>

							<div className="landing-detail-body">
								<div className="landing-detail-topline">
									<span className="landing-detail-chip">{selectedProduct.category || 'Product'}</span>
									{selectedProduct.previousPrice > selectedProduct.price && (
										<span className="landing-detail-discount">
											{Math.round(((selectedProduct.previousPrice - selectedProduct.price) / selectedProduct.previousPrice) * 100)}% OFF
										</span>
									)}
								</div>

								<h2 className="landing-detail-title">{selectedProduct.name}</h2>
								<p className="landing-detail-meta"><strong>Brand:</strong> {selectedProduct.brand || 'N/A'}</p>
								<p className="landing-detail-meta"><strong>Weight:</strong> {selectedProduct.weight || 'N/A'}</p>
								<div className="landing-detail-price-row">
									<span className="landing-detail-price">৳{selectedProduct.price}</span>
									{selectedProduct.previousPrice > selectedProduct.price && (
										<span className="landing-detail-previous">৳{selectedProduct.previousPrice}</span>
									)}
								</div>

								<p className="landing-detail-description">
									{selectedProduct.productDetails || 'High-quality product selected from Bangla Bazar. Tap this card to inspect the full product summary before login.'}
								</p>

								<div className="landing-detail-actions">
									<button className="btn btn-success" onClick={() => handleAddToCart(selectedProduct)}>
										Add to Cart
									</button>
									<button className="btn btn-outline-secondary" onClick={() => navigate('/login')}>
										Open Full Product Page
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="browse-empty-state">
							<p className="text-muted mb-0">
								Tap any product card to view the full details here on the landing page.
							</p>
						</div>
					)}
				</section>

				<section className="offered-items-section mt-5 mb-5">
					<h3 className="fw-bold mb-4">
						<u>
							<b>Offered Items</b>
						</u>
					</h3>
					{loadingOffers ? (
						<div className="d-flex justify-content-center py-5">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : offeredItems.length > 0 ? (
						<div className="offered-items-grid">
							{offeredItems.map((product) => renderProductCard(product, 'offered'))}
						</div>
					) : (
						<div className="text-center py-5">
							<p className="text-muted fs-5">No special offers available right now.</p>
						</div>
					)}
				</section>

				<section className="brands-section mt-5 mb-5">
					<h3 className="fw-bold mb-4">
						<u>Our Brands</u>
					</h3>
					<div className="brands-grid-container">
						<div className="brands-grid">
							{brands.map((brand) => (
								<div key={brand.id} className="brand-logo-card" onClick={() => handleBrandSelect(brand.name)}>
									<div className="brand-logo-wrapper">
										<img
											src={`http://localhost:5272/${brand.image}`}
											alt={brand.name}
											className="brand-logo"
											onError={(event) => {
												event.target.style.display = 'none';
												event.target.nextSibling.style.display = 'flex';
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

				{honeyItems.length > 0 && (
					<section className="category-slider-section mt-5 mb-5">
						<div className="slider-header">
							<h3 className="fw-bold mb-4">
								<u>All Natural Honey</u>
							</h3>
							<button className="btn btn-link text-primary" onClick={redirectToLogin}>
								View all Items →
							</button>
						</div>
						<div className="category-products-slider">
							{honeyItems.map((product) => renderProductCard(product, 'slider'))}
						</div>
					</section>
				)}

				{datesItems.length > 0 && (
					<section className="category-slider-section mt-5 mb-5">
						<div className="slider-header">
							<h3 className="fw-bold mb-4">
								<u>Premium Dates</u>
							</h3>
							<button className="btn btn-link text-primary" onClick={redirectToLogin}>
								View all Items →
							</button>
						</div>
						<div className="category-products-slider">
							{datesItems.map((product) => renderProductCard(product, 'slider'))}
						</div>
					</section>
				)}

				{cookingEssentialItems.length > 0 && (
					<section className="category-slider-section mt-5 mb-5">
						<div className="slider-header">
							<h3 className="fw-bold mb-4">
								<u>Cooking Essentials</u>
							</h3>
							<button className="btn btn-link text-primary" onClick={redirectToLogin}>
								View all Items →
							</button>
						</div>
						<div className="category-products-slider">
							{cookingEssentialItems.map((product) => renderProductCard(product, 'slider'))}
						</div>
					</section>
				)}

				<section className="landing-cart-dock-wrap" ref={cartSectionRef}>
					<div className="landing-cart-dock">
						<div className="cart-dock-head">
							<h5 className="mb-0">Cart</h5>
							<span>{cartCount} items</span>
						</div>

						{cartItems.length === 0 ? (
							<p className="cart-empty-note">Your cart is empty.</p>
						) : (
							<div className="cart-item-list">
								{cartItems.map((item) => (
									<div key={item.id} className="cart-item-row">
										<div>
											<strong>{item.name}</strong>
											<p className="mb-0 text-muted">৳{item.price} x {item.quantity}</p>
										</div>
										<div className="cart-qty-controls">
											<button onClick={() => handleDecreaseQty(item.id)}>-</button>
											<span>{item.quantity}</span>
											<button onClick={() => handleIncreaseQty(item.id)}>+</button>
										</div>
										<button className="cart-remove-btn" onClick={() => handleRemoveFromCart(item.id)}>
											Remove
										</button>
									</div>
								))}
							</div>
						)}

						<div className="cart-dock-footer">
							<strong>
								Subtotal: ৳
								{cartItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0)}
							</strong>
							<button className="btn btn-primary" onClick={redirectToLogin}>
								Checkout
							</button>
						</div>
					</div>
				</section>
			</div>

			<button
				type="button"
				className="bb-cart-sidebar"
				aria-label="Cart"
				title="Cart"
				onClick={handleCartSidebarClick}
			>
				<span className="bb-cart-sidebar-iconWrap">
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
						<path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L2.01 2H.5a.5.5 0 0 1-.5-.5M4.415 13h8.17l1.312-7H3.102z" />
					</svg>
					{cartCount > 0 && <span className="bb-cart-sidebar-badge">{cartCount}</span>}
				</span>
				<span className="bb-cart-sidebar-label">Cart</span>
			</button>

			<Footer />
		</>
	);
}

export default Landing;
