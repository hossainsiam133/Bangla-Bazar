import { useState, useEffect } from 'react';

function AdminMessages() {
    const [showMessages, setShowMessages] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchMessages = async () => {
        setMessagesLoading(true);
        try {
            const response = await fetch('http://localhost:5272/api/massage');
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages(data);
            setShowMessages(true);
            setShowReplyForm(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleBackToMenu = () => {
        setShowMessages(false);
        setShowReplyForm(false);
        setEditingMessage(null);
        setReplyText('');
    };

    const startReply = (msg) => {
        setEditingMessage(msg);
        setReplyText('');
        setShowReplyForm(true);
        setShowMessages(false);
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            setMessage({ type: 'error', text: 'Reply message cannot be empty' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5272/api/massage/${editingMessage.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editingMessage,
                    reply: replyText.trim(),
                    replied: true,
                    repliedDate: new Date().toISOString()
                }),
            });

            if (!response.ok) throw new Error('Failed to send reply');

            setMessage({ type: 'success', text: 'Reply sent successfully!' });
            setReplyText('');
            setEditingMessage(null);
            setShowReplyForm(false);
            
            // Refresh messages
            await fetchMessages();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        setLoading(true);
        try { 
            const response = await fetch(`http://localhost:5272/api/massage/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete message');

            setMessage({ type: 'success', text: 'Message deleted successfully!' });
            await fetchMessages();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter(msg =>
        (msg.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (msg.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (msg.message?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Message Management</h2>
                <p className="section-subtitle">Read and reply to user messages</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`} role="alert">
                    {message.text}
                </div>
            )}

            <div className="content-placeholder">
                {!showMessages && !showReplyForm && (
                    <div className="btn-group-vertical">
                        <button 
                            className="btn btn-info" 
                            onClick={fetchMessages}
                            disabled={messagesLoading}
                        >
                            {messagesLoading ? '⏳ Loading...' : '💬 View All Messages'}
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => {
                                setSearchQuery('');
                                fetchMessages();
                            }}
                        >
                            🔄 Refresh Messages
                        </button>
                    </div>
                )}

                {showMessages && (
                    <div className="mt-4">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, email, or message content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {messagesLoading ? (
                            <p className="text-muted">⏳ Loading messages...</p>
                        ) : filteredMessages.length === 0 ? (
                            <p className="text-muted">No messages found</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMessages.map(msg => (
                                            <tr key={msg.id}>
                                                <td>{msg.name}</td>
                                                <td>{msg.email}</td>
                                                <td>{msg.massages?.substring(0, 50)}...</td>
                                                <td>
                                                    <span className={`badge ${msg.replied ? 'bg-success' : 'bg-warning'}`}>
                                                        {msg.replied ? '✓ Replied' : '⏳ Pending'}
                                                    </span>
                                                </td>
                                                <td>{new Date(msg.createdDate).toLocaleDateString()}</td>
                                                <td>
                                                    {!msg.replied ? (
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => startReply(msg)}
                                                            disabled={loading}
                                                        >
                                                            ✉️ Reply
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted text-sm">Replied</span>
                                                    )}
                                                    {' '}
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        disabled={loading}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button 
                            className="btn btn-secondary mt-3"
                            onClick={handleBackToMenu}
                        >
                            ← Back to Menu
                        </button>
                    </div>
                )}

                {showReplyForm && editingMessage && (
                    <div className="mt-4">
                        <div className="card">
                            <div className="card-header bg-light">
                                <h5>Original Message</h5>
                            </div>
                            <div className="card-body">
                                <p><strong>From:</strong> {editingMessage.name} ({editingMessage.email})</p>
                                <p><strong>Date:</strong> {new Date(editingMessage.createdDate).toLocaleString()}</p>
                                <p><strong>Message:</strong></p>
                                <p className="text-muted">{editingMessage.message}</p>
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="form-label"><strong>Your Reply:</strong></label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Type your reply here..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <button
                                className="btn btn-success"
                                onClick={handleSendReply}
                                disabled={loading}
                            >
                                {loading ? '⏳ Sending...' : '✉️ Send Reply'}
                            </button>
                            {' '}
                            <button
                                className="btn btn-secondary"
                                onClick={handleBackToMenu}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminMessages;
