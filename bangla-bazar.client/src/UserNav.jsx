import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserNav.css';
function UserNav() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
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
        // Retrieve cart count from localStorage or wherever it's stored
        const stored = localStorage.getItem('cartCount');
        if (stored) {
            setCartCount(parseInt(stored, 10));
        }
    }, []);

    const handleSearchToggle = () => {
        setIsSearchOpen((prev) => !prev);
    };

    const handleProfileToggle = () => {
        setIsProfileOpen((prev) => !prev);
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
        // Clear all user-related data
        localStorage.removeItem('bb_user');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('cartCount');
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
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            ref={searchInputRef}
                            type="search"
                            className="form-control bb-search-input"
                            placeholder="Search products..."
                            aria-label="Search products"
                            onBlur={() => setIsSearchOpen(false)}
                        />
                    </form>
                </div>

                <a href='\home' className="navbar-brand d-flex align-items-center mb-0 bb-logo-wrap">
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
                </a>

                <div className="d-flex align-items-center gap-4 bb-nav-actions">
                    <Link to="/message" className="btn p-0 border-0 bg-transparent bb-nav-icon" aria-label="Messages" title="Messages">
                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="m2.5 11 4-3 4 3V7l-4-3-4 3v4z" />
                        </svg>
                    </Link>

                    <Link to="/order" className="btn p-0 border-0 bg-transparent bb-nav-icon" aria-label="Track Order" title="Track Order">
                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 1A1.5 1.5 0 0 0 11 2.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                        </svg>
                    </Link>

                    <div className="bb-profile-wrapper" ref={profileDropdownRef}>
                        <button
                            type="button"
                            className="btn p-0 border-0 bg-transparent bb-nav-icon"
                            aria-label="Profile"
                            onClick={handleProfileToggle}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                        </button>
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

                    <Link to="/cart" className="btn p-0 border-0 bg-transparent bb-nav-icon bb-cart" aria-label="Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L2.01 2H.5a.5.5 0 0 1-.5-.5M4.415 13h8.17l1.312-7H3.102z" />
                        </svg>
                        {cartCount > 0 && <span className="bb-cart-badge">{cartCount}</span>}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
export default UserNav;