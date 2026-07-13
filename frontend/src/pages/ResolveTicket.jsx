import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";

function ResolveTicket() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [ticket, setTicket] = useState(null);
    const [resolutionRemarks, setResolutionRemarks] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch ticket details
        api.get(`/tickets/${id}`)
        .then(res => {
            setTicket(res.data);
            setResolutionRemarks(res.data.resolutionRemarks || "");
            setLoading(false);
        })
        .catch(err => {
            setError("Failed to load ticket data.");
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await api.put(`/tickets/${id}/resolve`, { resolutionRemarks });
            navigate("/tickets");
        } catch (err) {
            const errorData = err.response?.data;
            const errorMessage = typeof errorData === 'string' 
                ? errorData 
                : (errorData?.message || "Failed to resolve ticket");
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container mt-5"><h4>Loading...</h4></div>;
    if (!ticket) return <div className="container mt-5"><h4>Ticket not found.</h4></div>;

    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-center mb-4 text-success">Resolve Ticket #{id}</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <div className="list-group mb-4">
                        <div className="list-group-item bg-light text-dark">
                            <h6 className="mb-1">Ticket Details</h6>
                            <p className="mb-1"><strong>Title:</strong> {ticket.title}</p>
                            <div className="mb-1"><strong>Description:</strong> <ReactMarkdown>{ticket.description}</ReactMarkdown></div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-muted mb-1"><strong>Priority:</strong> {ticket.priority}</p>
                        <p className="text-muted mb-1"><strong>Category:</strong> {ticket.category}</p>
                        <p className="text-muted"><strong>Created By:</strong> {ticket.employeeName} ({ticket.createdBy})</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label><strong>Resolution Remarks</strong></label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Explain how you solved the issue..."
                                value={resolutionRemarks}
                                onChange={(e) => setResolutionRemarks(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success w-100 mt-3" disabled={saving}>
                            {saving ? "Resolving..." : "Mark as Resolved"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResolveTicket;
