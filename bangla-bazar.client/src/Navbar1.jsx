import { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar1.css';

function Navbar1() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleSearchToggle = () => {
        setIsSearchOpen((prev) => !prev);
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

                <a href="#" className="navbar-brand d-flex align-items-center mb-0 bb-logo-wrap">
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
                    <button type="button" className="btn p-0 border-0 bg-transparent bb-nav-icon" aria-label="Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                    </button>

                    <button type="button" className="btn p-0 border-0 bg-transparent bb-nav-icon bb-cart" aria-label="Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L2.01 2H.5a.5.5 0 0 1-.5-.5M4.415 13h8.17l1.312-7H3.102z" />
                        </svg>
                        <span className="bb-cart-badge"></span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
export default Navbar1;