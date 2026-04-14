import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserNav from './UserNav.jsx';
import Footer from './Footer.jsx';

function SearchProducts() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [imageErrors, setImageErrors] = useState({});

	const query = (searchParams.get('q') || '').trim();

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				setError('');
				const response = await fetch('http://localhost:5272/api/product');
				if (!response.ok) throw new Error('Failed to fetch products');

				const data = await response.json();
				setProducts(Array.isArray(data) ? data : []);
			} catch (fetchError) {
				setError(fetchError.message || 'Failed to fetch products');
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const normalizedQuery = query.toLowerCase();

	const filteredProducts = useMemo(() => {
		if (!normalizedQuery) return [];

		return products.filter((product) => {
			const name = (product?.name || '').toLowerCase();
			const brand = (product?.brand || '').toLowerCase();
			const category = (product?.category || '').toLowerCase();
			const details = (product?.details || '').toLowerCase();

			return name.includes(normalizedQuery)
				|| brand.includes(normalizedQuery)
				|| category.includes(normalizedQuery)
				|| details.includes(normalizedQuery);
		});
	}, [products, normalizedQuery]);

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

	const handleImageError = (productId) => {
		setImageErrors((prev) => ({
			...prev,
			[productId]: true
		}));
	};

	return (
		<>
			<UserNav />

			<main className="container py-4 py-md-5">
				<div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
					<div>
						<h2 className="mb-1">Search Results</h2>
						<p className="text-muted mb-0">
							{query ? `Results for "${query}"` : 'Enter a keyword to search products'}
						</p>
					</div>
					<button
						type="button"
						className="btn btn-outline-secondary btn-sm"
						onClick={() => navigate('/home')}
					>
						Back to Home
					</button>
				</div>

				{loading && (
					<div className="d-flex justify-content-center py-5">
						<div className="spinner-border text-warning" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				)}

				{!loading && error && (
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				)}

				{!loading && !error && !query && (
					<div className="alert alert-info" role="alert">
						Type a product name, brand, or category in the top search box.
					</div>
				)}

				{!loading && !error && query && filteredProducts.length === 0 && (
					<div className="alert alert-warning" role="alert">
						No products found for "{query}".
					</div>
				)}

				{!loading && !error && filteredProducts.length > 0 && (
					<>
						<p className="text-muted mb-3">
							Showing {filteredProducts.length} product{filteredProducts.length > 1 ? 's' : ''}
						</p>
						<div className="row g-3">
							{filteredProducts.map((product) => (
								<div key={product.id} className="col-6 col-md-4 col-lg-3">
									<div
										className="card h-100 shadow-sm"
										role="button"
										onClick={() => navigate(`/product/${product.id}`)}
									>
										{getImageUrl(product.imageUrl) && !imageErrors[product.id] ? (
											<img
												src={getImageUrl(product.imageUrl)}
												alt={product.name}
												className="card-img-top"
												style={{ height: '180px', objectFit: 'cover' }}
												onError={() => handleImageError(product.id)}
											/>
										) : (
											<div
												className="d-flex align-items-center justify-content-center bg-light"
												style={{ height: '180px' }}
											>
												<span className="text-muted px-2 text-center">{product.name}</span>
											</div>
										)}
										<div className="card-body d-flex flex-column">
											<h6 className="card-title mb-1">{product.name}</h6>
											<small className="text-muted mb-2">{product.brand || 'N/A'}</small>
											<div className="mt-auto fw-bold text-warning">BDT {product.price}</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</main>

			<Footer />
		</>
	);
}

export default SearchProducts;
