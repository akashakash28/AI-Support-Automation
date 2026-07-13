import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditTicket() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [ticket, setTicket] = useState({
        title: "",
        description: "",
        priority: "Low",
        category: "Network",
        status: "OPEN"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/tickets/${id}`)
            .then(res => {
                setTicket(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load ticket details.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setTicket({
            ...ticket,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await api.put(`/tickets/${id}`, ticket);
            navigate("/tickets");
        } catch (err) {
            const errorData = err.response?.data;
            const errorMessage = typeof errorData === 'string' 
                ? errorData 
                : (errorData?.message || "Failed to update ticket");
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container mt-5"><h4>Loading ticket...</h4></div>;

    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-center mb-4">Edit Ticket #{id}</h2>
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

                        <button type="submit" className="btn btn-warning w-100 mt-3" disabled={saving}>
                            {saving ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditTicket;
