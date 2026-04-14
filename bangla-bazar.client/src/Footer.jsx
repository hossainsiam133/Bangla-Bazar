import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/home' },
        { name: 'Categories', path: '#' },
        { name: 'Brands', path: '#' },
        { name: 'Orders', path: '/order' }
    ];

    const customerService = [
        { name: 'Contact Us', path: '#' },
        { name: 'FAQ', path: '#' },
        { name: 'Shipping Info', path: '#' },
        { name: 'Return Policy', path: '#' }
    ];

    const company = [
        { name: 'About Us', path: '#' },
        { name: 'Privacy Policy', path: '#' },
        { name: 'Terms & Conditions', path: '#' },
        { name: 'Careers', path: '#' }
    ];

    const handleNavigation = (path) => {
        if (path.startsWith('/')) {
            navigate(path);
        }
    };

    return (
        <footer className="footer mt-5">
            <div className="footer-content">
                <div className="container py-5">
                    <div className="row">
                        {/* Company Info */}
                        <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0">
                            <div className="footer-section">
                                <h5 className="footer-title">Bangla Bazar</h5>
                                <p className="footer-description">
                                    Your trusted marketplace for authentic Bangladeshi products, spices, honey, and more.
                                </p>
                                <div className="social-links">
                                    <a href="#" className="social-icon" title="Facebook" aria-label="Facebook">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 320 512" fill="currentColor" aria-hidden="true">
                                            <path d="M279.14 288l14.22-92.66h-88.91V134.96c0-25.35 12.42-50.06 52.24-50.06H297V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="social-icon" title="Twitter" aria-label="Twitter">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
                                            <path d="M459.37 151.716c.322 4.548.322 9.097.322 13.645 0 138.72-105.583 298.557-298.557 298.557-59.452 0-114.68-17.219-161.14-47.106 8.447.974 16.568 1.294 25.34 1.294 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.623 19.818 1.623 9.421 0 18.843-1.294 27.614-3.573-48.08-9.747-84.143-51.98-84.143-102.985v-1.294c13.969 7.797 30.176 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.955 63.662 129.398 105.246 216.105 109.845-1.623-7.797-2.599-15.919-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.174 0 57.445 12.67 76.595 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.797 24.366-24.366 44.833-46.132 57.768 21.117-2.274 41.584-8.122 60.468-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="social-icon" title="Instagram" aria-label="Instagram">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
                                            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.4 0-74.7-33.5-74.7-74.7s33.3-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.3 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9S339.9 16.7 304 15c-35.9-1.7-143.9-1.7-179.8 0-35.8 1.7-67.7 9.9-93.9 36.1S16.7 108.1 15 144c-1.7 35.9-1.7 143.9 0 179.8 1.7 35.9 9.9 67.7 36.2 93.9s58 34.5 93.9 36.2c35.9 1.7 143.9 1.7 179.8 0 35.9-1.7 67.7-9.9 93.9-36.2s34.5-58 36.2-93.9c1.7-35.9 1.7-143.9 0-179.8zM398.8 388c-7.8 19.6-23 34.8-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.8-23-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 23-34.8 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.8 23 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                        </svg>
                                    </a>
                                    <a href="https://www.linkedin.com/in/siam-hossain221/" className="social-icon" title="LinkedIn" aria-label="LinkedIn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
                                            <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341A53.78 53.78 0 1 1 107.6 53.22a53.78 53.78 0 0 1-53.76 53.78zM447.9 448h-92.4V302.4c0-34.7-.7-79.4-48.46-79.4-48.5 0-55.9 37.9-55.9 77v148H158.5V148.9h88.8v40.8h1.3c12.4-23.5 42.6-48.4 87.6-48.4 93.7 0 111 61.7 111 141.9V448z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0">
                            <div className="footer-section">
                                <h5 className="footer-title">Quick Links</h5>
                                <ul className="footer-links">
                                    {quickLinks.map((link, index) => (
                                        <li key={index}>
                                            <a 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavigation(link.path);
                                                }}
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Customer Service */}
                        <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0">
                            <div className="footer-section">
                                <h5 className="footer-title">Customer Service</h5>
                                <ul className="footer-links">
                                    {customerService.map((link, index) => (
                                        <li key={index}>
                                            <a 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavigation(link.path);
                                                }}
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Company */}
                        <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0">
                            <div className="footer-section">
                                <h5 className="footer-title">Company</h5>
                                <ul className="footer-links">
                                    {company.map((link, index) => (
                                        <li key={index}>
                                            <a 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavigation(link.path);
                                                }}
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="row mt-4 pt-4 border-top">
                        <div className="col-12 mb-3">
                            <h5 className="footer-title">Get in Touch</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
                            <div className="contact-item">
                                <i className="fas fa-phone"></i>
                                <div>
                                    <p className="contact-label">Phone</p>
                                    <a href="tel:+8801234567890">+880 190 996 7161</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <div>
                                    <p className="contact-label">Email</p>
                                    <a href="mailto:info@banglabazar.com">cpsiam221@gmail.com</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <div>
                                    <p className="contact-label">Address</p>
                                    <p>Dhaka, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="contact-item">
                                <i className="fas fa-clock"></i>
                                <div>
                                    <p className="contact-label">Hours</p>
                                    <p>9:00 AM - 9:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
                            <p className="copyright">
                                &copy; {currentYear} <strong>Bangla Bazar</strong>. All rights reserved.
                            </p>
                        </div>
                        <div className="col-12 col-md-6 text-center text-md-end">
                            <p className="payment-methods">
                                <span className="payment-label">We Accept:</span>
                                <span className="payment-icons">
                                    <i className="fab fa-cc-visa"></i>
                                    <i className="fab fa-cc-mastercard"></i>
                                    <i className="fab fa-cc-paypal"></i>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
