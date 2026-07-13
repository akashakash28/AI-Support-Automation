import { useContext } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

function EmployeeLayout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { path: "/ask-ai", label: "Ask AI", icon: "bi-robot" },
        { path: "/create-ticket", label: "Create Ticket", icon: "bi-plus-circle" },
        { path: "/tickets", label: "My Tickets", icon: "bi-ticket" },
        { path: "/knowledge-base", label: "Knowledge Base", icon: "bi-book" },
    ];

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Top Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3 sticky-top" style={{ background: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(10px)" }}>
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white" to="/ask-ai">
                        <i className="bi bi-robot text-primary fs-4"></i>
                        <span>AI Helpdesk</span>
                    </Link>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#employeeNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="employeeNav">
                        <ul className="navbar-nav mx-auto gap-2">
                            {navItems.map(item => (
                                <li className="nav-item" key={item.path}>
                                    <Link 
                                        className={`nav-link px-3 py-2 rounded-pill transition-all text-white ${location.pathname.startsWith(item.path) ? "bg-primary shadow" : "hover-bg-secondary"}`} 
                                        to={item.path}
                                        style={{ fontWeight: location.pathname.startsWith(item.path) ? "600" : "400" }}
                                    >
                                        <i className={`bi ${item.icon} me-1`}></i> {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="d-flex align-items-center gap-3">
                            <NotificationBell />
                            <div className="d-flex align-items-center gap-3 text-white">
                                <span className="small d-none d-md-block"><i className="bi bi-person-circle me-1"></i> {user?.name || 'Employee'}</span>
                                <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container flex-grow-1 py-4 text-white-override">
                <Outlet />
            </main>
            
            {/* Footer */}
            <footer className="py-4 mt-auto" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div className="container text-center text-light small">
                    <p className="mb-0">© {new Date().getFullYear()} AI Support Automation. Empowered by AI.</p>
                </div>
            </footer>
        </div>
    );
}

export default EmployeeLayout;
