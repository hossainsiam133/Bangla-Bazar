import { useNavigate } from 'react-router-dom';
import Navbar1 from './UserNav.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
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
                        <h2 className="fw-bold mb-1">Welcome, {user?.name ?? 'User'}!</h2>
                        <span className="badge bg-success px-3 py-2">User</span>
                    </div>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                <p className="text-muted">Browse our products and shop the best deals on Bangla Bazar.</p>
            </div>
        </>
    );
}

export default Home;
