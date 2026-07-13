import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CreateTicket() {
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({
        title: "",
        description: "",
        priority: "Low",
        category: "Network"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setTicket({
            ...ticket,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Note: employeeName and employeeEmail are populated automatically by the backend
            // from the JWT token identity.
            await api.post("/tickets", ticket);
            navigate("/tickets");
        } catch (err) {
            const errorData = err.response?.data;
            const errorMessage = typeof errorData === 'string' 
                ? errorData 
                : (errorData?.message || "Failed to create ticket");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-center mb-4">Create Ticket</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={ticket.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                rows="4"
                                value={ticket.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label>Priority</label>
                                <select
                                    name="priority"
                                    className="form-control"
                                    value={ticket.priority}
                                    onChange={handleChange}
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label>Category</label>
                                <select
                                    name="category"
                                    className="form-control"
                                    value={ticket.category}
                                    onChange={handleChange}
                                >
                                    <option>Network</option>
                                    <option>Hardware</option>
                                    <option>Software</option>
                                    <option>Security</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                            {loading ? "Creating..." : "Create Ticket"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTicket;