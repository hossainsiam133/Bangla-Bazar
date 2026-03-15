import { useNavigate } from 'react-router-dom';
import Navbar1 from './Navbar1.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminPannel() {
    const navigate = useNavigate();
    const user = (() => {
        try { return JSON.parse(localStorage.getItem('bb_user')); } catch { return {}; }
    })();

    const handleLogout = () => {
        localStorage.removeItem('bb_token');
        localStorage.removeItem('bb_user');
        navigate('/login');
    };

    return (
        <>
            <Navbar1 />
            <div className="container py-4 py-md-5">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Admin Panel</h2>
                        <span
                            className="badge px-3 py-2"
                            style={{ background: '#f5871f' }}
                        >
                            Admin – {user?.email}
                        </span>
                    </div>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                <p className="text-muted">Manage products, orders, and users from here.</p>
            </div>
        </>
    );
}

export default AdminPannel;