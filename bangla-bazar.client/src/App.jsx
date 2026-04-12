import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import Home from './Home.jsx';
import Product from './Product.jsx';
import Category from './Category.jsx';
import Brand from './Brand.jsx';
import CookingEssentials from './CookingEssentials.jsx';
import AdminPannel from './AdminPannel.jsx';
import Cart from './Cart.jsx';
import Checkout from './Checkout.jsx';
import OrderConfirmation from './OrderConfirmation.jsx';
import Message from './Message.jsx';
import Order from './Order.jsx';

function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('bb_user')); } catch { return null; }
}

function PrivateRoute({ children, requiredRole }) {
    const user = getStoredUser();
    if (!user) return <Navigate to="/login" replace />;
    if (requiredRole && user.role !== requiredRole)
        return <Navigate to={user.role === 'Admin' ? '/admin' : '/home'} replace />;
    return children;
}

function App() {
    const user = getStoredUser();
    const defaultRedirect = user ? (user.role === 'Admin' ? '/admin' : '/home') : '/login';

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={user ? <Navigate to={defaultRedirect} replace /> : <Login />}
                />
                <Route
                    path="/home"
                    element={<PrivateRoute requiredRole="User"><Home /></PrivateRoute>}
                />
                <Route
                    path="/product/:productId"
                    element={<PrivateRoute requiredRole="User"><Product /></PrivateRoute>}
                />
                <Route
                    path="/category/:categoryName"
                    element={<PrivateRoute requiredRole="User"><Category /></PrivateRoute>}
                />
                <Route
                    path="/brand/:brandName"
                    element={<PrivateRoute requiredRole="User"><Brand /></PrivateRoute>}
                />
                <Route
                    path="/cooking-essentials"
                    element={<PrivateRoute requiredRole="User"><CookingEssentials /></PrivateRoute>}
                />
                <Route
                    path="/cart"
                    element={<PrivateRoute requiredRole="User"><Cart /></PrivateRoute>}
                />
                <Route
                    path="/checkout"
                    element={<PrivateRoute requiredRole="User"><Checkout /></PrivateRoute>}
                />
                <Route
                    path="/order-confirmation"
                    element={<PrivateRoute requiredRole="User"><OrderConfirmation /></PrivateRoute>}
                />
                <Route
                    path="/message"
                    element={<PrivateRoute requiredRole="User"><Message /></PrivateRoute>}
                />
                <Route
                    path="/order"
                    element={<PrivateRoute requiredRole="User"><Order /></PrivateRoute>}
                />
                <Route
                    path="/admin"
                    element={<PrivateRoute requiredRole="Admin"><AdminPannel /></PrivateRoute>}
                />
                <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;