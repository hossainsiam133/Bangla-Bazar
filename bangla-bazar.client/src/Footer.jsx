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
                                    <a href="#" className="social-icon" title="Facebook">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="social-icon" title="Twitter">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" className="social-icon" title="Instagram">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="social-icon" title="LinkedIn">
                                        <i className="fab fa-linkedin-in"></i>
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
                                    <a href="tel:+8801234567890">+880 123 456 7890</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <div>
                                    <p className="contact-label">Email</p>
                                    <a href="mailto:info@banglabazar.com">info@banglabazar.com</a>
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
