import { useEffect, useState } from 'react';
import './Message.css';
import UserNav from './UserNav';

function Message() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [subject, setSubject] = useState('');

    useEffect(() => {
        // Load messages from localStorage
        const stored = localStorage.getItem('userMessages');
        if (stored) {
            setMessages(JSON.parse(stored));
        }
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!subject.trim() || !newMessage.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const message = {
            id: Date.now(),
            subject,
            content: newMessage,
            date: new Date().toLocaleDateString(),
            read: false
        };

        const updated = [message, ...messages];
        setMessages(updated);
        localStorage.setItem('userMessages', JSON.stringify(updated));
        setSubject('');
        setNewMessage('');
    };

    const deleteMessage = (id) => {
        const updated = messages.filter(msg => msg.id !== id);
        setMessages(updated);
        localStorage.setItem('userMessages', JSON.stringify(updated));
    };

    return (
        <>
            <UserNav />
            <div className="container py-5">
                <h1 className="mb-4">Messages</h1>
                
                <div className="row">
                    <div className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Send Message</h5>
                                <form onSubmit={handleSendMessage}>
                                    <div className="mb-3">
                                        <label htmlFor="subject" className="form-label">Subject</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="subject"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Message subject"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea
                                            className="form-control"
                                            id="message"
                                            rows="5"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-warning w-100 fw-bold">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Message History</h5>
                                {messages.length === 0 ? (
                                    <p className="text-muted">No messages yet</p>
                                ) : (
                                    <div className="list-group">
                                        {messages.map(msg => (
                                            <div key={msg.id} className="list-group-item">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1">{msg.subject}</h6>
                                                        <p className="mb-1 text-muted">{msg.content}</p>
                                                        <small className="text-secondary">{msg.date}</small>
                                                    </div>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => deleteMessage(msg.id)}
                                                    >
                                                        Delete
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
