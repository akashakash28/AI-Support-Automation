import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const UserManagement = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                alert("Failed to delete user");
            }
        }
    };

    if (loading) return <div className="container mt-5"><h3>Loading Users...</h3></div>;

    return (
        <div className="container mt-5 text-white-override">
            <h2 className="mb-4">User Management</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Job Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td><span className="badge bg-secondary">{u.role}</span></td>
                                        <td>{u.department || 'N/A'}</td>
                                        <td>{u.jobTitle || 'N/A'}</td>
                                        <td>
                                            {user.role === 'ADMIN' && (
                                                <button 
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(u.id)}
                                                >
                                                    <i className="bi bi-trash"></i> Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
