import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function LandingPage() {
    const { isAuthenticated, user } = useContext(AuthContext);

    // If already logged in, route to correct portal
    if (isAuthenticated && user) {
        if (user.role === "ADMIN" || user.role === "MANAGER") {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/tickets" replace />;
        }
    }

    return (
        <div className="landing-page">
            <div className="landing-container">
                {/* Hero Section */}
                <div className="landing-hero">
                    <div className="landing-logo">
                        <span className="logo-icon">🛡️</span>
                    </div>
                    <h1 className="landing-title">AI Support Automation</h1>
                    <p className="landing-subtitle">
                        Intelligent IT Help Desk & Ticket Management System
                    </p>
                </div>

                {/* Portal Cards */}
                <div className="portal-grid">
                    {/* Employee Portal */}
                    <div className="portal-card employee-portal">
                        <div className="portal-icon">👤</div>
                        <h2 className="portal-title">Employee Portal</h2>
                        <p className="portal-desc">
                            Submit support tickets, track progress, and get AI-powered solutions instantly.
                        </p>
                        <ul className="portal-features">
                            <li>✅ Create & track tickets</li>
                            <li>✅ AI-powered suggestions</li>
                            <li>✅ Real-time status updates</li>
                            <li>✅ Comment & attach files</li>
                        </ul>
                        <Link to="/login?portal=employee" className="portal-btn employee-btn">
                            Sign In as Employee
                        </Link>
                        <Link to="/register" className="portal-link">
                            New employee? Register here →
                        </Link>
                    </div>

                    {/* Admin Portal */}
                    <div className="portal-card admin-portal">
                        <div className="portal-icon">⚙️</div>
                        <h2 className="portal-title">Admin Portal</h2>
                        <p className="portal-desc">
                            Manage tickets, assign agents, view analytics, and monitor SLA performance.
                        </p>
                        <ul className="portal-features">
                            <li>📊 Analytics Dashboard</li>
                            <li>🔧 Assign & manage tickets</li>
                            <li>👥 Team management</li>
                            <li>🔔 Real-time notifications</li>
                        </ul>
                        <Link to="/login?portal=admin" className="portal-btn admin-btn">
                            Sign In as Admin
                        </Link>
                        <p className="portal-hint">
                            For IT Admins & Support Agents
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="landing-footer">
                    <p>Powered by Spring Boot • React • MySQL • AI</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
