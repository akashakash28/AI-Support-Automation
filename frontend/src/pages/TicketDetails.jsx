import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function TicketDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    
    const [newComment, setNewComment] = useState("");
    const [file, setFile] = useState(null);
    
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [ticketRes, commentsRes, attachmentsRes] = await Promise.all([
                api.get(`/tickets/${id}`),
                api.get(`/tickets/${id}/comments`),
                api.get(`/tickets/${id}/attachments`)
            ]);
            setTicket(ticketRes.data);
            setComments(commentsRes.data);
            setAttachments(attachmentsRes.data);
        } catch (error) {
            console.error("Failed to fetch ticket details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tickets/${id}/comments`, { 
                message: newComment,
                author: user.email 
            });
            setNewComment("");
            fetchData(); // Refresh comments
        } catch (error) {
            alert("Failed to add comment");
        }
    };

    // Phase 7: AI Copilot
    const [fetchingDraft, setFetchingDraft] = useState(false);

    const handleFetchDraft = async () => {
        setFetchingDraft(true);
        try {
            const res = await api.get(`/ai/ticket-draft/${id}`);
            if (res.data && res.data.draft) {
                setNewComment(res.data.draft);
            }
        } catch (error) {
            alert("Failed to generate draft. Please try again.");
        } finally {
            setFetchingDraft(false);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        
        const formData = new FormData();
        formData.append("file", file);
        
        try {
            await api.post(`/tickets/${id}/attachments`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFile(null);
            fetchData(); // Refresh attachments
        } catch (error) {
            alert("Failed to upload file");
        }
    };

    if (loading) return <div className="container mt-5"><h4>Loading...</h4></div>;
    if (!ticket) return <div className="container mt-5"><h4>Ticket not found.</h4></div>;

    return (
        <div className="container mt-5 text-white-override">
            <h2>
                Ticket #{ticket.id}: {ticket.title} 
                {ticket.escalated && (
                    <span className="badge bg-danger ms-2">ESCALATED</span>
                )}
            </h2>
            <div className="row mt-4">
                
                {/* Left Column: Details & AI Suggestion */}
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body text-dark">
                            <h5 className="card-title">Description</h5>
                            <div className="card-text"><ReactMarkdown>{ticket.description}</ReactMarkdown></div>
                            
                            {ticket.parentTicketId && (
                                <div className="alert alert-secondary mt-3">
                                    <strong><i className="bi bi-info-circle"></i> Duplicate Ticket</strong><br />
                                    This ticket has been auto-flagged as a duplicate. 
                                    Please refer to <Link to={`/tickets/${ticket.parentTicketId}`} className="alert-link">Ticket #{ticket.parentTicketId}</Link> for updates.
                                </div>
                            )}
                            
                            <hr />
                            
                            <h5 className="card-title text-primary">🤖 AI Prediction & Suggestion</h5>
                            <div className="alert alert-info">
                                <strong>Suggested Solution:</strong> 
                                <div><ReactMarkdown>{ticket.aiSuggestion || "No AI suggestion available."}</ReactMarkdown></div>
                            </div>
                            
                            {ticket.resolutionRemarks && (
                                <>
                                    <h5 className="card-title text-success mt-4">Resolution Notes</h5>
                                    <div className="alert alert-success">
                                        <ReactMarkdown>{ticket.resolutionRemarks}</ReactMarkdown>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white text-dark">
                            <h5 className="mb-0">Comments</h5>
                        </div>
                        <div className="card-body text-dark">
                            {comments.length === 0 ? (
                                <p className="text-muted">No comments yet.</p>
                            ) : (
                                <ul className="list-group list-group-flush mb-3">
                                    {comments.map((c, idx) => (
                                        <li key={idx} className="list-group-item px-0">
                                            <strong>{c.author || "User"}: </strong>
                                            <span>{c.message}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                            <form onSubmit={handleAddComment} className="mt-3">
                                <div className="d-flex gap-2">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-primary">Post</button>
                                </div>
                                
                                {/* Phase 7: AI Copilot Button */}
                                {(user?.role === "SUPPORT_AGENT" || user?.role === "ADMIN" || user?.role === "MANAGER") && (
                                    <div className="mt-2 text-end">
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-outline-info"
                                            onClick={handleFetchDraft}
                                        >
                                            <i className="bi bi-magic"></i> AI Copilot Draft
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta Info & Attachments */}
                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body text-dark">
                            <h5 className="card-title">Details</h5>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2"><strong>Status:</strong> <span className={`badge bg-${
                                    ticket.status === 'OPEN' ? 'warning' :
                                    ticket.status === 'ASSIGNED' ? 'info' :
                                    ticket.status === 'IN_PROGRESS' ? 'primary' :
                                    ticket.status === 'WAITING_FOR_USER' ? 'secondary' :
                                    ticket.status === 'RESOLVED' ? 'success' :
                                    ticket.status === 'CLOSED' ? 'dark' :
                                    ticket.status === 'REOPENED' ? 'danger' : 'secondary'
                                }`}>{ticket.status?.replace(/_/g, ' ')}</span></li>
                                <li className="mb-2"><strong>Priority:</strong> <span className={`badge bg-${
                                    ticket.priority === 'Critical' ? 'danger' :
                                    ticket.priority === 'High' ? 'warning' :
                                    ticket.priority === 'Medium' ? 'info' : 'secondary'
                                }`}>{ticket.priority}</span></li>
                                <li className="mb-2"><strong>Category:</strong> {ticket.category}</li>
                                <li className="mb-2">
                                    <strong>Type:</strong>{" "}
                                    <span className={`badge bg-${ticket.ticketType === 'RESOURCE_REQUEST' ? 'primary' : 'secondary'}`}>
                                        {ticket.ticketType === 'RESOURCE_REQUEST' ? 'Resource Request' : 'Issue'}
                                    </span>
                                </li>
                                {ticket.ticketType === 'RESOURCE_REQUEST' && (
                                    <li className="mb-2">
                                        <strong>AI Decision:</strong>{" "}
                                        {ticket.aiApproved === true ? (
                                            <span className="badge bg-success">✅ Approved</span>
                                        ) : ticket.aiApproved === false ? (
                                            <span className="badge bg-warning text-dark">⚠️ Requires Human Review</span>
                                        ) : (
                                            <span className="badge bg-secondary">Pending</span>
                                        )}
                                    </li>
                                )}
                                <li className="mb-2"><strong>Assigned Team:</strong> {ticket.assignedTeam || "—"}</li>
                                <li className="mb-2"><strong>Assigned Agent:</strong> {ticket.assignedAgent || "Unassigned"}</li>
                                <li className="mb-2"><strong>Created By:</strong> {ticket.createdBy}</li>
                                <li className="mb-2">
                                    <strong>SLA Deadline:</strong>{" "}
                                    {ticket.slaDeadline ? (
                                        <span className={ticket.slaDeadline && new Date(ticket.slaDeadline) < new Date() && ticket.status !== 'CLOSED' ? "text-danger fw-bold" : ""}>
                                            {new Date(ticket.slaDeadline).toLocaleString()}
                                        </span>
                                    ) : (
                                        "Not Set"
                                    )}
                                </li>
                                {ticket.escalated && (
                                    <li className="mb-2">
                                        <span className="badge bg-danger w-100 py-2">⚠️ ESCALATED (SLA BREACH)</span>
                                    </li>
                                )}
                            </ul>

                            {/* Close Ticket Button - Only for ticket creator when ticket is not already closed */}
                            {user?.email === ticket.createdBy && ticket.status !== "CLOSED" && (
                                <button
                                    className="btn btn-danger w-100 mt-3"
                                    onClick={async () => {
                                        if (window.confirm("Are you sure you want to close this ticket?")) {
                                            try {
                                                await api.put(`/tickets/${id}/close`);
                                                fetchData();
                                            } catch (err) {
                                                alert("Failed to close ticket");
                                            }
                                        }
                                    }}
                                >
                                    ✕ Close Ticket
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-white text-dark">
                            <h5 className="mb-0">Attachments</h5>
                        </div>
                        <div className="card-body text-dark">
                            {attachments.length === 0 ? (
                                <p className="text-muted">No attachments.</p>
                            ) : (
                                <ul className="list-group list-group-flush mb-3">
                                    {attachments.map((a, idx) => (
                                        <li key={idx} className="list-group-item px-0 text-truncate">
                                            📄 <a href={`http://localhost:8080/uploads/${a.fileName}`} target="_blank" rel="noreferrer">{a.fileName}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <form onSubmit={handleFileUpload}>
                                <div className="mb-2">
                                    <input 
                                        type="file" 
                                        className="form-control form-control-sm"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                                <button type="submit" className="btn btn-secondary btn-sm w-100">Upload File</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketDetails;
