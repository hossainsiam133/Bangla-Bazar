import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import Home from './Home.jsx';
import AdminPannel from './AdminPannel.jsx';

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
                    path="/admin"
                    element={<PrivateRoute requiredRole="Admin"><AdminPannel /></PrivateRoute>}
                />
                <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;