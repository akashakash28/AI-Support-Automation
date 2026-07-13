import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await api.post("/auth/forgot-password", { email });
            setMessage(res.data || "If that email exists, a reset link has been sent.");
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-4">Forgot Password</h3>
                {message && <div className="alert alert-info">{message}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
