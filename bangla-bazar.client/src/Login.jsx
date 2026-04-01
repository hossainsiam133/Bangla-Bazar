import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar1 from './UserNav.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5272/api/auth/send-email-otp', { email });
            setInfo(
                res.data.otp
                    ? `Dev mode – your OTP is: ${res.data.otp}`
                    : 'OTP sent! Check your Gmail inbox.'
            );
            setStep('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5272/api/auth/verify-email-otp', { email, otp });
            localStorage.setItem('bb_token', res.data.token);
            localStorage.setItem('bb_user', JSON.stringify(res.data.user));
            navigate(res.data.redirectTo);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    const resetToEmail = () => {
        setStep('email');
        setOtp('');
        setError('');
        setInfo('');
    };

    return (
        <>
            <Navbar1 />
            <div className="login-page d-flex align-items-center justify-content-center">
                <div className="login-card card shadow-sm p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h4 className="fw-bold login-title">Welcome Back</h4>
                        <p className="text-muted small mb-0">Sign in with your Gmail account</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger alert-dismissible py-2 small mb-3" role="alert">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close" />
                        </div>
                    )}
                    {info && (
                        <div className="alert alert-info py-2 small mb-3" role="alert">
                            {info}
                        </div>
                    )}

                    {step === 'email' ? (
                        <form onSubmit={handleSendOtp} noValidate>
                            <div className="mb-3">
                                <label htmlFor="email-input" className="form-label fw-semibold small">Gmail Address</label>
                                <input
                                    id="email-input"
                                    type="email"
                                    className="form-control"
                                    placeholder="yourname@gmail.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn login-btn w-100 fw-semibold"
                                disabled={loading}
                            >
                                {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
                                {loading ? 'Sending OTP…' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} noValidate>
                            <p className="text-center small text-muted mb-3">
                                OTP sent to <strong>{email}</strong>
                            </p>
                            <div className="mb-3">
                                <label htmlFor="otp-input" className="form-label fw-semibold small">6-digit OTP</label>
                                <input
                                    id="otp-input"
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control otp-input text-center fw-bold"
                                    placeholder="• • • • • •"
                                    maxLength={6}
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn login-btn w-100 fw-semibold mb-2"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
                                {loading ? 'Verifying…' : 'Verify OTP'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-link w-100 small text-muted text-decoration-none"
                                onClick={resetToEmail}
                                disabled={loading}
                            >
                                ← Change email
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}

export default Login;