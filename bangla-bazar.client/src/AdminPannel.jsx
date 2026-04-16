import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPannel.css';
import AdminProducts from './AdminProducts.jsx';
import AdminOrders from './AdminOrders.jsx';
import AdminUsers from './AdminUsers.jsx';
import AdminMessages from './AdminMessages.jsx';
import axios from 'axios';
import { USER_API, MASSAGE_API, ORDER_API, PRODUCT_API } from './config/api.js';

function AdminPannel() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMessages: 0,
        totalOrders: 0,
        totalProducts: 0,
    });

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('bb_user'));
        } catch {
            return {};
        }
    })();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Placeholder API calls - replace with actual endpoints
            const usersResponse = await axios.get(`${USER_API}/count`);
            const messagesResponse = await axios.get(`${MASSAGE_API}/count`);
            const ordersResponse = await axios.get(`${ORDER_API}/count`);
            const productsResponse = await axios.get(`${PRODUCT_API}/count`);

            // const usersData = usersResponse.ok ? await usersResponse.json() : { count: 0 };
            // const ordersData = ordersResponse.ok ? await ordersResponse.json() : { count: 0 };
            // const productsData = productsResponse.ok ? await productsResponse.json() : { count: 0 };
            // const messagesData = messagesResponse.ok ? await messagesResponse.json() : { count: 0 };
            setStats({
                totalUsers: usersResponse.data || 0,
                totalMessages: messagesResponse.data || 0,
                totalOrders: ordersResponse.data || 0,
                totalProducts: productsResponse.data || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Set mock data for demo purposes
            setStats({
                totalUsers: 45,
                totalMessages: 12,
                totalOrders: 87,
                totalProducts: 156,
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('bb_token');
        localStorage.removeItem('bb_user');
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="admin-nav-container">
            {/* Header with Logo and Mobile Menu Toggle */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo-section">
                        <h1 className="admin-logo">Bangla Bazar</h1>
                        <span className="admin-role-badge">Admin Dashboard</span>
                    </div>
                    <button
                        className="mobile-menu-toggle"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            {/* Navigation Sidebar */}
            <nav className={`admin-sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className="admin-nav-list">
                    <li>
                        <button
                            className={`admin-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('home');
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            📊 Admin Home
                        </button>
                    </li>
                    <li>
                        <button
                            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('products');
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            📦 Products
                        </button>
                    </li>
                    <li>
                        <button
                            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('orders');
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            🛒 Orders
                        </button>
                    </li>
                    <li>
                        <button
                            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('users');
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            👥 Users
                        </button>
                    </li>
                    <li>
                        <button
                            className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('messages');
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            💬 Messages
                        </button>
                    </li>
                    <li className="nav-divider"></li>
                    <li>
                        <div className="admin-user-info">
                            <span className="user-email">{user?.email}</span>
                            <button
                                className="admin-nav-item logout-btn"
                                onClick={handleLogout}
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>

            {/* Main Content Area */}
            <main className="admin-content">
                {/* Admin Home Tab */}
                {activeTab === 'home' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h2>Admin Home - Dashboard</h2>
                            <p className="section-subtitle">Get an overview of your store</p>
                        </div>

                        {/* Statistics Cards */}
                        <div className="stats-grid">
                            <div className="stat-card users-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <h3>Total Users</h3>
                                    <p className="stat-number">{stats.totalUsers}</p>
                                </div>
                            </div>

                            <div className="stat-card messages-card">
                                <div className="stat-icon">💬</div>
                                <div className="stat-content">
                                    <h3>Messages</h3>
                                    <p className="stat-number">{stats.totalMessages}</p>
                                </div>
                            </div>

                            <div className="stat-card orders-card">
                                <div className="stat-icon">🛒</div>
                                <div className="stat-content">
                                    <h3>Total Orders</h3>
                                    <p className="stat-number">{stats.totalOrders}</p>
                                </div>
                            </div>

                            <div className="stat-card products-card">
                                <div className="stat-icon">📦</div>
                                <div className="stat-content">
                                    <h3>Total Products</h3>
                                    <p className="stat-number">{stats.totalProducts}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="actions-grid">
                                <button
                                    className="action-btn"
                                    onClick={() => setActiveTab('products')}
                                >
                                    ➕ Add New Product
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => setActiveTab('orders')}
                                >
                                    📋 View Orders
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => setActiveTab('messages')}
                                >
                                    📧 New Messages
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => setActiveTab('users')}
                                >
                                    👤 Manage Users
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && <AdminProducts />}

                {/* Orders Tab */}
                {activeTab === 'orders' && <AdminOrders />}

                {/* Users Tab */}
                {activeTab === 'users' && <AdminUsers />}

                {/* Messages Tab */}
                {activeTab === 'messages' && <AdminMessages />}
            </main>
        </div>
    );
}

export default AdminPannel;
