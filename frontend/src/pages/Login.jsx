import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";

function Login() {
    const { login, isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const [loginType, setLoginType] = useState("employee"); // "employee" or "admin"

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await login(credentials.email, credentials.password);
        if (res.success) {
            if (res.role === "ADMIN" || res.role === "MANAGER" || res.role === "SUPPORT_AGENT") {
                navigate("/dashboard");
            } else {
                navigate("/ask-ai");
            }
        } else {
            setError(res.message || "Login failed");
        }
    };

    // If already logged in, send them to the correct dashboard
    if (isAuthenticated && user) {
        if (user.role === "ADMIN" || user.role === "MANAGER") {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/ask-ai" replace />;
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <div className="card shadow-lg border-0">
                <div className="card-header bg-white border-0 pt-4 pb-0">
                    <ul className="nav nav-tabs nav-fill">
                        <li className="nav-item">
                            <button 
                                className={`nav-link fw-bold ${loginType === "employee" ? "active text-primary" : "text-muted"}`} 
                                onClick={() => setLoginType("employee")}
                            >
                                <i className="bi bi-person me-2"></i> Employee
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link fw-bold ${loginType === "admin" ? "active text-primary" : "text-muted"}`} 
                                onClick={() => setLoginType("admin")}
                            >
                                <i className="bi bi-shield-lock me-2"></i> Admin
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-4">
                    <h4 className="text-center mb-4">
                        {loginType === "employee" ? "Employee Portal" : "Admin Console"}
                    </h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={credentials.email}
                                onChange={handleChange}
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                value={credentials.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Login
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/register">Don't have an account? Register</Link>
                    </div>
                    
                    <hr className="mt-4 mb-3" />
                    <div className="text-center">
                        <p className="text-muted small mb-2">Quick Auto-Fill For Testing:</p>
                        <div className="d-flex justify-content-center gap-2">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setCredentials({email: 'employee@example.com', password: 'password'})}
                            >
                                Fill Employee
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setCredentials({email: 'admin@example.com', password: 'password'})}
                            >
                                Fill Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
