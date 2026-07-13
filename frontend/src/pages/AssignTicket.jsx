import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function AssignTicket() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [ticket, setTicket] = useState(null);
    const [agents, setAgents] = useState([]);
    const [assignedAgent, setAssignedAgent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch ticket details and list of support agents
        Promise.all([
            api.get(`/tickets/${id}`),
            api.get("/auth/agents")
        ])
        .then(([ticketRes, agentsRes]) => {
            setTicket(ticketRes.data);
            setAssignedAgent(ticketRes.data.assignedAgent || "");
            setAgents(agentsRes.data);
            setLoading(false);
        })
        .catch(err => {
            setError("Failed to load ticket or agents data.");
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await api.put(`/tickets/${id}/assign`, { assignedAgent });
            navigate("/tickets");
        } catch (err) {
            const errorData = err.response?.data;
            const errorMessage = typeof errorData === 'string' 
                ? errorData 
                : (errorData?.message || "Failed to assign ticket");
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container mt-5"><h4>Loading...</h4></div>;
    if (!ticket) return <div className="container mt-5"><h4>Ticket not found.</h4></div>;

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-center mb-4">Assign Ticket #{id}</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <div className="mb-4">
                        <h5><strong>Title:</strong> {ticket.title}</h5>
                        <p className="text-muted mb-1"><strong>Priority:</strong> {ticket.priority}</p>
                        <p className="text-muted mb-1"><strong>Category:</strong> {ticket.category}</p>
                        <p className="text-muted mb-1"><strong>AI Assigned Team:</strong> <span className="badge bg-info text-dark">{ticket.assignedTeam || "Pending"}</span></p>
                        <p className="text-muted"><strong>Current Agent:</strong> {ticket.assignedAgent || "Unassigned"}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Select Support Agent</label>
                            <select
                                className="form-control"
                                value={assignedAgent}
                                onChange={(e) => setAssignedAgent(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Select an Agent --</option>
                                {agents.map(agent => (
                                    <option key={agent.id} value={agent.email}>
                                        {agent.name} ({agent.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={saving}>
                            {saving ? "Assigning..." : "Assign Agent"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AssignTicket;
