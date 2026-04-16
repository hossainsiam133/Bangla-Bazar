import { useState, useEffect } from 'react';
import { USER_API } from './config/api.js';

function AdminUsers() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUsersList, setShowUsersList] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
    });
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        setLoading(true);
        try {
            const userData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                role: formData.role
            };

            const response = await fetch(USER_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            setMessage({ type: 'success', text: 'User added successfully!' });
            setFormData({ name: '', email: '', phone: '', role: 'customer' });
            setShowAddForm(false);

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to add user' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', email: '', phone: '', role: 'customer' });
        setShowAddForm(false);
        setMessage({ type: '', text: '' });
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await fetch(USER_API);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
            setShowUsersList(true);
            setShowAddForm(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUsersLoading(false);
        }
    };

    const deactivateUser = async (userId) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;
        try {
            const response = await fetch(`${USER_API}/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to deactivate user');
            setMessage({ type: 'success', text: 'User deactivated successfully!' });
            fetchUsers();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const handleBackToMenu = () => {
        setShowUsersList(false);
        setShowAddForm(false);
        setShowUpdateForm(false);
        setMessage({ type: '', text: '' });
    };

    const startEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
        setShowUpdateForm(true);
        setShowUsersList(false);
        setShowAddForm(false);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        setLoading(true);
        try {
            const userData = {
                id: editingUser.id,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                role: formData.role
            };

            const response = await fetch(`${USER_API}/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            setMessage({ type: 'success', text: 'User updated successfully!' });
            setFormData({ name: '', email: '', phone: '', role: 'customer' });
            setEditingUser(null);
            setShowUpdateForm(false);

            fetchUsers();

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update user' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCancel = () => {
        setFormData({ name: '', email: '', phone: '', role: 'customer' });
        setEditingUser(null);
        setShowUpdateForm(false);
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>User Management</h2>
                <p className="section-subtitle">Manage users and their roles</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} role="alert">
                    {message.text}
                </div>
            )}

            {!showAddForm && !showUsersList && !showUpdateForm ? (
                <div className="content-placeholder">
                    <div className="btn-group-vertical">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddForm(true)}
                        >
                            ➕ Add New User
                        </button>
                        <button
                            className="btn btn-info"
                            onClick={fetchUsers}
                        >
                            👥 View All Users
                        </button>
                    </div>
                    <p className="mt-4 text-muted">Click "Add New User" to get started...</p>
                </div>
            ) : showUsersList ? (
                <div className="users-list-container">
                    <div className="users-header">
                        <h3>All Users</h3>
                        <button className="btn btn-secondary" onClick={handleBackToMenu}>← Back</button>
                    </div>

                    {usersLoading ? (
                        <div className="loading-state">
                            <p>Loading users...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="no-users">
                            <p>No users found. <button className="link-btn" onClick={() => setShowAddForm(true)}>Add one now!</button></p>
                        </div>
                    ) : (
                        <div className="users-table-container">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phoneNumber}</td>
                                            <td className="table-dark"><span >{user.role}</span></td>
                                            <td >
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => startEditUser(user)}
                                                >
                                                    ✏️ Edit
                                                </button> &nbsp;
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deactivateUser(user.id)}
                                                >
                                                    🗑️ Deactivate
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : showAddForm ? (
                <div className="add-user-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName">User Name *</label>
                            <input
                                type="text"
                                id="userName"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter user name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="userEmail">Email *</label>
                            <input
                                type="email"
                                id="userEmail"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter user email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="userPhone">Phone *</label>
                            <input
                                type="tel"
                                id="userPhone"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter user phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="userRole">Role *</label>
                            <select
                                id="userRole"
                                name="role"
                                className="form-control"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                                <option value="vendor">Vendor</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Adding User...' : '✅ Add User'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : showUpdateForm && editingUser ? (
                <div className="add-user-form">
                    <div className="form-header">
                        <h3>Edit User: {editingUser.name}</h3>
                    </div>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName">User Name *</label>
                            <input
                                type="text"
                                id="userName"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter user name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="userEmail">Email *</label>
                            <input
                                type="email"
                                id="userEmail"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter user email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="userPhone">Phone *</label>
                            <input
                                type="tel"
                                id="userPhone"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter user phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="userRole">Role *</label>
                            <select
                                id="userRole"
                                name="role"
                                className="form-control"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                                <option value="vendor">Vendor</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Updating User...' : '✅ Update User'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleUpdateCancel}
                                disabled={loading}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
}

export default AdminUsers;
