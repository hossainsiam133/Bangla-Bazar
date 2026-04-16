import { useEffect, useState } from 'react';
import './Message.css';
import UserNav from './UserNav';
import { MASSAGE_API, USER_API } from './config/api.js';


function Message() {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [adminReceiverId, setAdminReceiverId] = useState(null);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [status, setStatus] = useState({ type: '', text: '' });

    const getStoredUser = () => {
        try {
            const raw = localStorage.getItem('bb_user');
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed && parsed.id ? parsed : null;
        } catch {
            return null;
        }
    };

    const getMessageContent = (msg) => (msg?.content || '').trim();
    const getReplyContent = (msg) => (msg?.replies || '').trim();

    const loadAdminReceiverId = async (userId) => {
        const response = await fetch(USER_API);
        if (!response.ok) throw new Error('Failed to load users');

        const users = await response.json();
        const normalizedUsers = Array.isArray(users) ? users : [];
        const admins = normalizedUsers.filter((u) => (u?.role || '').toLowerCase() === 'admin');

        if (!admins.length) {
            setAdminReceiverId(null);
            return;
        }

        const preferredAdmin = admins.find((admin) => admin.id !== userId) || admins[0];
        setAdminReceiverId(preferredAdmin.id);
    };

    const loadMessages = async (userId) => {
        setLoadingMessages(true);
        try {
            const response = await fetch(MASSAGE_API);
            if (!response.ok) throw new Error('Failed to fetch messages');

            const data = await response.json();
            const allMessages = Array.isArray(data) ? data : [];

            const userMessages = allMessages
                .filter((msg) => msg.senderId === userId)
                .sort((a, b) => new Date(b.sentAt || 0) - new Date(a.sentAt || 0));

            setMessages(userMessages);
        } catch (error) {
            setStatus({ type: 'error', text: error.message || 'Failed to load messages' });
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        const user = getStoredUser();

        if (!user) {
            setStatus({ type: 'error', text: 'You need to log in before sending messages.' });
            return;
        }

        setCurrentUser(user);
        loadAdminReceiverId(user.id);
        loadMessages(user.id);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) {
            setStatus({ type: 'error', text: 'Please enter your message.' });
            return;
        }

        if (!currentUser?.id) {
            setStatus({ type: 'error', text: 'User session not found. Please login again.' });
            return;
        }

        if (!adminReceiverId) {
            setStatus({ type: 'error', text: 'No admin account found to receive your message.' });
            return;
        }

        setSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const payload = {
                senderId: currentUser.id,
                receiverId: adminReceiverId,
                content: newMessage.trim()
            };

            const response = await fetch(MASSAGE_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to send message');

            setNewMessage('');
            setStatus({ type: 'success', text: 'Message sent successfully.' });
            await loadMessages(currentUser.id);
        } catch (error) {
            setStatus({ type: 'error', text: error.message || 'Failed to send message' });
        } finally {
            setSubmitting(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        setDeletingId(id);
        setStatus({ type: '', text: '' });

        try {
            const response = await fetch(`${MASSAGE_API}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete message');

            setStatus({ type: 'success', text: 'Message deleted successfully.' });
            if (currentUser?.id) {
                await loadMessages(currentUser.id);
            }
        } catch (error) {
            setStatus({ type: 'error', text: error.message || 'Failed to delete message' });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <UserNav />
            <div className="container py-5">
                <h1 className="mb-4">Messages</h1>

                {status.text && (
                    <div className={`alert alert-${status.type === 'error' ? 'danger' : 'success'} mb-3`} role="alert">
                        {status.text}
                    </div>
                )}
                
                <div className="row">
                    <div className="col-md-4">
                        <div className="card mb-3 message-form">
                            <div className="card-body">
                                <h5 className="card-title">Send Message</h5>
                                <form onSubmit={handleSendMessage}>
                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Content</label>
                                        <textarea
                                            className="form-control"
                                            id="message"
                                            rows="5"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            disabled={submitting || !adminReceiverId}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-warning w-100 fw-bold"
                                        disabled={submitting || !adminReceiverId}
                                    >
                                        {submitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card message-history">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Message History</h5>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => currentUser?.id && loadMessages(currentUser.id)}
                                        disabled={loadingMessages}
                                    >
                                        {loadingMessages ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>

                                {loadingMessages ? (
                                    <p className="text-muted">Loading messages...</p>
                                ) : messages.length === 0 ? (
                                    <p className="text-muted">No messages yet</p>
                                ) : (
                                    <div className="list-group">
                                        {messages.map(msg => (
                                            <div key={msg.id} className="list-group-item message-item">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1 message-subject">Content</h6>
                                                        <p className="mb-2 text-muted message-content">{getMessageContent(msg) || 'No message content'}</p>
                                                        <h6 className="mb-1 message-subject">Replies</h6>
                                                        <p className="mb-1 text-muted message-content">
                                                            {getReplyContent(msg) || 'No reply yet'}
                                                        </p>
                                                        <small className="text-secondary message-date">
                                                            {msg.sentAt ? new Date(msg.sentAt).toLocaleString() : 'Unknown date'}
                                                        </small>
                                                    </div>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => deleteMessage(msg.id)}
                                                        disabled={deletingId === msg.id || msg.senderId !== currentUser?.id}
                                                    >
                                                        {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Message;
