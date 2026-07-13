import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { getAllTickets } from "../services/DashboardService";

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchTickets = () => {
        setLoading(true);
        getAllTickets()
            .then((response) => {
                setTickets(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch tickets", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            try {
                await api.delete(`/tickets/${id}`);
                fetchTickets(); // Refresh list
            } catch (err) {
                alert("Failed to delete ticket");
            }
        }
    };

    if (loading) {
        return <div className="container mt-5 text-white-override"><h2>Loading...</h2></div>;
    }

    return (
        <div className="container mt-5 text-white-override">
            <h2>Ticket Management</h2>
            <h4>Total Tickets: {tickets.length}</h4>
            
            <table className="table table-bordered mt-4 shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Category</th>
                        <th>AI Team</th>
                        <th>Status</th>
                        <th>SLA Deadline</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => {
                        const isBreached = ticket.slaDeadline && new Date(ticket.slaDeadline) < new Date();
                        return (
                        <tr key={ticket.id} className={ticket.escalated ? "table-danger" : ""}>
                            <td>{ticket.id}</td>
                            <td>
                                {ticket.title}
                                {ticket.escalated && <span className="badge bg-danger ms-2">ESCALATED</span>}
                                {ticket.parentTicketId && <span className="badge bg-secondary ms-2">DUPLICATE</span>}
                            </td>
                            <td>
                                <span className={`badge bg-${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'danger' : 'info'}`}>
                                    {ticket.priority}
                                </span>
                            </td>
                            <td>{ticket.category}</td>
                            <td>
                                <span className="badge bg-secondary text-light">
                                    {ticket.assignedTeam || "AI Parsing"}
                                </span>
                            </td>
                            <td>
                                <span className={`badge bg-${ticket.status === 'OPEN' ? 'warning' : ticket.status === 'CLOSED' ? 'success' : 'secondary'}`}>
                                    {ticket.status}
                                </span>
                            </td>
                            <td>
                                {ticket.slaDeadline ? (
                                    <span className={isBreached && ticket.status !== 'CLOSED' ? "text-danger fw-bold" : ""}>
                                        {new Date(ticket.slaDeadline).toLocaleString()}
                                    </span>
                                ) : (
                                    "Not Set"
                                )}
                            </td>
                            <td>
                                {/* Global Action: View Details */}
                                <Link 
                                    to={`/tickets/${ticket.id}`} 
                                    className="btn btn-sm btn-primary me-2 mb-1"
                                >
                                    View
                                </Link>

                                {/* Only Admin can edit and delete */}
                                {user?.role === 'ADMIN' && (
                                    <>
                                        <Link 
                                            to={`/edit-ticket/${ticket.id}`} 
                                            className="btn btn-sm btn-warning me-2 mb-1"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            className="btn btn-sm btn-danger me-2 mb-1"
                                            onClick={() => handleDelete(ticket.id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}

                                {/* Admin only action: Assign Agent */}
                                {user?.role === 'ADMIN' && (
                                    <Link 
                                        to={`/assign-ticket/${ticket.id}`} 
                                        className="btn btn-sm btn-info me-2 mb-1"
                                    >
                                        Assign
                                    </Link>
                                )}

                                {/* Support Agent only action: Resolve Ticket */}
                                {user?.role === 'SUPPORT_AGENT' && ticket.status !== 'CLOSED' && (
                                    <Link 
                                        to={`/resolve-ticket/${ticket.id}`} 
                                        className="btn btn-sm btn-success me-2 mb-1"
                                    >
                                        Resolve
                                    </Link>
                                )}
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Tickets;