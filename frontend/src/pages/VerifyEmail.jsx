import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [message, setMessage] = useState("Verifying...");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setMessage("Invalid verification link.");
            return;
        }

        api.get(`/auth/verify-email?token=${token}`)
            .then(res => {
                setMessage(res.data);
                if (res.data === "Email verified successfully") {
                    setSuccess(true);
                }
            })
            .catch(() => {
                setMessage("Verification failed. The link may be invalid or expired.");
            });
    }, [token]);

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4 text-center" style={{ width: "400px" }}>
                <h3 className="mb-4">Email Verification</h3>
                <div className={`alert ${success ? "alert-success" : "alert-warning"}`}>
                    {message}
                </div>
                <div className="mt-3">
                    <Link to="/login" className="btn btn-primary w-100">Go to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
