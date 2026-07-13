import { useContext, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useContext(AuthContext);
    const [user, setUser] = useState({ name: "", email: "", password: "", role: "EMPLOYEE", jobTitle: "", department: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/register", user);
            setSuccess("Registration successful! Logging you in...");
            
            // Automatically log them in
            const res = await login(user.email, user.password);
            if (res.success) {
                if (res.role === "ADMIN" || res.role === "MANAGER") {
                    setTimeout(() => navigate("/dashboard"), 1000);
                } else {
                    setTimeout(() => navigate("/tickets"), 1000);
                }
            } else {
                setTimeout(() => navigate("/login"), 1000);
            }
        } catch (err) {
            const errorData = err.response?.data;
            const errorMessage = typeof errorData === 'string' 
                ? errorData 
                : (errorData?.message || "Registration failed");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/tickets" replace />;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <div className="card shadow">
                <div className="card-body">
                    <h3 className="text-center mb-4">Create Account</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={user.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={user.email}
                                onChange={handleChange}
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={user.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Job Title (e.g. Software Engineer, Sales Manager)</label>
                            <input
                                type="text"
                                name="jobTitle"
                                className="form-control"
                                value={user.jobTitle || ""}
                                onChange={handleChange}
                                placeholder="Enter your role"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Department (e.g. Engineering, Marketing, HR)</label>
                            <input
                                type="text"
                                name="department"
                                className="form-control"
                                value={user.department || ""}
                                onChange={handleChange}
                                placeholder="Enter your department"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Register As</label>
                            <select
                                name="role"
                                className="form-select"
                                value={user.role}
                                onChange={handleChange}
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPPORT_AGENT">Support Agent</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success w-100" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/login">Already have an account? Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
