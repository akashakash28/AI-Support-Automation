import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">AI Support</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/knowledge-base">
                                <i className="bi bi-book"></i> Knowledge Base
                            </Link>
                        </li>
                        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">Analytics</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/tickets">All Tickets</Link>
                                </li>
                            </>
                        )}
                        {user?.role === "EMPLOYEE" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-primary fw-bold" to="/ask-ai">
                                        <i className="bi bi-robot"></i> Ask AI
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/tickets">My Tickets</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/create-ticket">Create Ticket</Link>
                                </li>
                            </>
                        )}
                        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/knowledge-base">Knowledge Base</Link>
                            </li>
                        )}
                        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/users">Users</Link>
                            </li>
                        )}
                        {user?.role === "SUPPORT_AGENT" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/tickets">Assigned Tickets</Link>
                            </li>
                        )}
                    </ul>
                    
                    <div className="d-flex align-items-center text-white">
                        <NotificationBell />
                        <span className="me-3">
                            Hello, {user?.name} <span className="badge bg-secondary">{user?.role}</span>
                        </span>
                        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
