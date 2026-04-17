import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserNav.css';
import { CART_UPDATED_EVENT, getCartCount, readCartItems } from './cart.js';
function UserNav() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const navigate = useNavigate();

    const user = (() => {
        try { return JSON.parse(localStorage.getItem('bb_user')); } catch { return {}; }
    })();

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isProfileOpen]);

    useEffect(() => {
        const refreshCartCount = () => {
            const countFromItems = getCartCount(readCartItems());
            if (countFromItems > 0) {
                setCartCount(countFromItems);
                return;
            }

            const storedCount = parseInt(localStorage.getItem('cartCount') || '0', 10);
            setCartCount(Number.isNaN(storedCount) ? 0 : storedCount);
        };

        refreshCartCount();
        window.addEventListener('storage', refreshCartCount);
        window.addEventListener(CART_UPDATED_EVENT, refreshCartCount);

        return () => {
            window.removeEventListener('storage', refreshCartCount);
            window.removeEventListener(CART_UPDATED_EVENT, refreshCartCount);
        };
    }, []);

    const handleSearchToggle = () => {
        setIsSearchOpen((prev) => !prev);
    };

    const handleProfileToggle = () => {
        setIsProfileOpen((prev) => !prev);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();

        if (!trimmedQuery) {
            navigate('/home');
            setIsSearchOpen(false);
            return;
        }

        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        setIsSearchOpen(false);
    };

    // const handleLogout = () => {
    //     // Clear user session/token
    //     localStorage.removeItem('userToken');
    //     localStorage.removeItem('userEmail');
    //     setIsProfileOpen(false);
    //     // Redirect to home or login
    //     window.location.href = '/login';
    // };
    const handleLogout = () => {
        localStorage.removeItem('bb_user');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartCount');
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
        setIsProfileOpen(false);
        navigate('/login');
    };
    return (
        <nav className="navbar navbar-expand px-3 px-md-5 bb-navbar">
            <div className="container-fluid p-0 align-items-center justify-content-between">
                <div className="bb-search-area">
                    <button
                        type="button"
                        className="btn p-0 border-0 bg-transparent bb-nav-icon"
                        aria-label="Search"
                        onClick={handleSearchToggle}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </button>

                    <form
                        className={`bb-search-form ${isSearchOpen ? 'bb-search-form-open' : ''}`}
                        role="search"
                        onSubmit={handleSearchSubmit}
                    >
                        <input
                            ref={searchInputRef}
                            type="search"
                            className="form-control bb-search-input"
                            placeholder="Search products..."
                            aria-label="Search products"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => setIsSearchOpen(false)}
                        />
                    </form>
                </div>

                <Link to="/home" className="navbar-brand d-flex align-items-center mb-0 bb-logo-wrap">
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
                </Link>

                <div className="d-flex align-items-center gap-4 bb-nav-actions">
                    <div className="bb-nav-item">
                        <Link to="/message" className="btn p-0 border-0 bg-transparent bb-nav-icon" aria-label="Messages" title="Messages">
                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8.717c0 4.418-3.582 8-8 8a7.95 7.95 0 0 1-4.31-1.26c-.303-.191-.698-.222-1.086-.16l-2.028.323a.5.5 0 0 1-.57-.57l.323-2.028c.062-.389.03-.783-.16-1.086A7.95 7.95 0 0 1 0 8.717c0-4.418 3.582-8 8-8s8 3.582 8 8" />
                                <path d="m6.11 10.51 1.265-1.602a.5.5 0 0 1 .673-.11l1.142.74a.5.5 0 0 0 .649-.093l1.865-2.24a.5.5 0 0 0-.762-.648L9.42 8.383a.5.5 0 0 1-.673.11l-1.142-.741a.5.5 0 0 0-.649.093l-1.63 1.956a.5.5 0 1 0 .784.709" />
                            </svg>
                        </Link>
                        <span className="bb-nav-label">Messages</span>
                    </div>

                    <div className="bb-nav-item">
                        <Link to="/order" className="btn p-0 border-0 bg-transparent bb-nav-icon" aria-label="Track Order" title="Track Order">
                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.186 1.113a.5.5 0 0 1 .628 0l6 2.5a.5.5 0 0 1 .186.79l-6 7a.5.5 0 0 1-.758 0l-6-7a.5.5 0 0 1 .186-.79zM8 2.159 3.454 4.05 8 9.354l4.546-5.303z" />
                                <path d="M2.5 5.5a.5.5 0 0 1 .5.5v5.793l5 2.5 5-2.5V6a.5.5 0 0 1 1 0v6a.5.5 0 0 1-.276.447l-5.5 2.75a.5.5 0 0 1-.448 0l-5.5-2.75A.5.5 0 0 1 2 12V6a.5.5 0 0 1 .5-.5" />
                            </svg>
                        </Link>
                        <span className="bb-nav-label">Track Order</span>
                    </div>

                    <div className="bb-profile-wrapper bb-nav-item" ref={profileDropdownRef}>
                        <button
                            type="button"
                            className="btn p-0 border-0 bg-transparent bb-nav-icon"
                            aria-label="Profile"
                            title="Profile"
                            onClick={handleProfileToggle}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                        </button>
                        <span className="bb-nav-label">Profile</span>
                        {isProfileOpen && (
                            <div className="bb-profile-dropdown">
                                <div className="bb-dropdown-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741Z" />
                                    </svg>
                                    <span>{user?.name}</span>
                                </div>
                                <div className="bb-dropdown-item" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                        <path fillRule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708l2.147-2.146H5.5a.5.5 0 0 1 0-1h7.793l-2.147-2.146a.5.5 0 0 1 .708-.708l3 3z" />
                                    </svg>
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <Link to="/cart" className="bb-cart-sidebar" aria-label="Cart" title="Cart">
                <span className="bb-cart-sidebar-iconWrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L2.01 2H.5a.5.5 0 0 1-.5-.5M4.415 13h8.17l1.312-7H3.102z" />
                    </svg>
                    {cartCount > 0 && <span className="bb-cart-sidebar-badge">{cartCount}</span>}
                </span>
                <span className="bb-cart-sidebar-label">Cart</span>
            </Link>
        </nav>
    );
}
export default UserNav;