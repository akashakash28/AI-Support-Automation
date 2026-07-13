import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!token) {
            setMessage("Invalid reset link.");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post("/auth/reset-password", { token, newPassword });
            setMessage(res.data);
            if (res.data === "Password reset successfully") {
                setSuccess(true);
            }
        } catch (error) {
            setMessage("An error occurred. The token may be invalid or expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-4">Reset Password</h3>
                {message && <div className={`alert ${success ? "alert-success" : "alert-danger"}`}>{message}</div>}
                
                {!success && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
                
                {success && (
                    <div className="text-center">
                        <Link to="/login" className="btn btn-primary w-100">Go to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
