import { useState } from 'react';

function AdminMessages() {
    const API_BASE_URL = 'http://localhost:5272/api/massage';

    const [showMessages, setShowMessages] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const getMessageContent = (msg) => (msg?.content || msg?.massages || msg?.message || '').trim();
    const getReplyContent = (msg) => (msg?.replies || msg?.reply || '').trim();

    const getSenderName = (msg) => {
        if (msg?.sender?.name) return msg.sender.name;
        if (msg?.name) return msg.name;
        if (msg?.senderId) return `User #${msg.senderId}`;
        return 'Unknown User';
    };

    const getSenderEmail = (msg) => msg?.sender?.email || msg?.email || 'N/A';

    const getSentDate = (msg) => msg?.sentAt || msg?.createdDate || msg?.date || null;

    const isMessageReplied = (msg) => Boolean(getReplyContent(msg));

    const fetchMessages = async () => {
        setMessagesLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages(Array.isArray(data) ? data : []);
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
        setReplyText(getReplyContent(msg));
        setShowReplyForm(true);
        setShowMessages(false);
    };

    const handleSendReply = async () => {
        if (!editingMessage) {
            setMessage({ type: 'error', text: 'No message selected for reply' });
            return;
        }

        if (!replyText.trim()) {
            setMessage({ type: 'error', text: 'Reply message cannot be empty' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${editingMessage.id}/reply`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ replies: replyText.trim() }),
            });

            if (!response.ok) throw new Error('Failed to send reply');

            setMessage({ type: 'success', text: 'Reply sent successfully.' });
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
            const response = await fetch(`${API_BASE_URL}/${id}`, {
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

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredMessages = messages.filter((msg) => {
        if (!normalizedQuery) return true;

        const name = getSenderName(msg).toLowerCase();
        const email = getSenderEmail(msg).toLowerCase();
        const content = getMessageContent(msg).toLowerCase();
        const replies = getReplyContent(msg).toLowerCase();

        return (
            name.includes(normalizedQuery)
            || email.includes(normalizedQuery)
            || content.includes(normalizedQuery)
            || replies.includes(normalizedQuery)
        );
    });

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
                                            <th>Content</th>
                                            <th>Replies</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMessages.map(msg => (
                                            <tr key={msg.id}>
                                                <td>{getSenderName(msg)}</td>
                                                <td>{getSenderEmail(msg)}</td>
                                                <td>
                                                    {getMessageContent(msg)
                                                        ? `${getMessageContent(msg).substring(0, 50)}${getMessageContent(msg).length > 50 ? '...' : ''}`
                                                        : 'No message content'}
                                                </td>
                                                <td>
                                                    {getReplyContent(msg)
                                                        ? `${getReplyContent(msg).substring(0, 50)}${getReplyContent(msg).length > 50 ? '...' : ''}`
                                                        : <span className="text-muted">No reply yet</span>}
                                                </td>
                                                <td>
                                                    <span className={`badge ${isMessageReplied(msg) ? 'bg-success' : 'bg-warning'}`}>
                                                        {isMessageReplied(msg) ? '✓ Replied' : '⏳ Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {getSentDate(msg)
                                                        ? new Date(getSentDate(msg)).toLocaleDateString()
                                                        : 'N/A'}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => startReply(msg)}
                                                        disabled={loading}
                                                    >
                                                        {isMessageReplied(msg) ? '✏️ Edit Reply' : '✉️ Reply'}
                                                    </button>
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
                                <p><strong>From:</strong> {getSenderName(editingMessage)} ({getSenderEmail(editingMessage)})</p>
                                <p>
                                    <strong>Date:</strong>{' '}
                                    {getSentDate(editingMessage)
                                        ? new Date(getSentDate(editingMessage)).toLocaleString()
                                        : 'N/A'}
                                </p>
                                <p><strong>Content:</strong></p>
                                <p className="text-muted">{getMessageContent(editingMessage) || 'No message content'}</p>
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
