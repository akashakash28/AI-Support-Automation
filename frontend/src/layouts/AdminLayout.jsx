import { useContext } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

function AdminLayout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { path: "/dashboard", label: "Analytics", icon: "bi-graph-up" },
        { path: "/tickets", label: "All Tickets", icon: "bi-ticket-detailed" },
        { path: "/knowledge-base", label: "Knowledge Base", icon: "bi-book" },
        { path: "/users", label: "User Management", icon: "bi-people" },
    ];

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <div className="text-white p-4 shadow" style={{ width: "260px", display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                <h4 className="mb-4 text-center fw-bold text-primary">
                    <i className="bi bi-robot"></i> AI Admin
                </h4>
                
                <div className="nav flex-column flex-grow-1 gap-2">
                    {navItems.map(item => (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className={`nav-link rounded px-3 py-2 text-white ${location.pathname.startsWith(item.path) ? "bg-primary shadow" : "hover-bg-secondary"}`}
                            style={{ transition: "all 0.2s" }}
                        >
                            <i className={`bi ${item.icon} me-2`}></i> {item.label}
                        </Link>
                    ))}
                </div>

                <div className="mt-auto border-top border-secondary pt-3 text-center">
                    <div className="mb-3">
                        <small className="d-block text-muted">Logged in as</small>
                        <strong className="d-block">{user?.name}</strong>
                        <span className="badge bg-secondary mt-1">{user?.role}</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline-light btn-sm w-100">
                        <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flexDirection-column overflow-hidden">
                {/* Topbar */}
                <header className="shadow-sm p-3 d-flex justify-content-between align-items-center z-1" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
                    <h5 className="mb-0 text-white fw-bold">Admin Console</h5>
                    <div className="d-flex align-items-center gap-3">
                        <NotificationBell />
                        <div className="text-light small">{new Date().toLocaleDateString()}</div>
                    </div>
                </header>
                
                {/* Dynamic Content */}
                <main className="p-4 overflow-auto flex-grow-1 text-white-override">
                    <div className="container-fluid">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
