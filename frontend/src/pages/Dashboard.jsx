import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import {
    getSummary,
    getCategory,
    getPriority,
    getTeam
} from "../services/DashboardService";

import SummaryCards from "../components/SummaryCards";
import CategoryChart from "../components/CategoryChart";
import PriorityChart from "../components/PriorityChart";
import TeamChart from "../components/TeamChart";

function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [category, setCategory] = useState([]);
    const [priority, setPriority] = useState([]);
    const [team, setTeam] = useState([]);
    const [aiInsights, setAiInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        Promise.all([
            getSummary(),
            getCategory(),
            getPriority(),
            getTeam()
        ])

        .then(([summaryRes, categoryRes, priorityRes, teamRes]) => {

            setSummary(summaryRes.data);
            setCategory(categoryRes.data);
            setPriority(priorityRes.data);
            setTeam(teamRes.data);

            setLoading(false);

        })

        .catch((error) => {
            console.log(error);
            setLoading(false);
        });

        // Fetch AI Insights separately so it doesn't block chart rendering
        import("../api/axios").then(module => {
            const api = module.default;
            api.get('/ai/dashboard-insights')
               .then(res => {
                   setAiInsights(res.data.insights);
                   setLoadingInsights(false);
               })
               .catch(err => {
                   console.log("Failed to fetch AI Insights", err);
                   setLoadingInsights(false);
               });
        });

    }, []);

    if (loading) {

        return (
            <div className="container mt-5">
                <h3>Loading Dashboard...</h3>
            </div>
        );

    }

    return (

        <div className="container mt-5">

            <h1 className="mb-4 text-white-override">
                AI Ops Center Dashboard
            </h1>

            {/* AI Insights Banner */}
            <div className="card shadow-sm mb-4 border-primary">
                <div className="card-header bg-primary text-white d-flex align-items-center">
                    <i className="bi bi-robot fs-4 me-2"></i>
                    <h5 className="mb-0">AI Operations Insights</h5>
                </div>
                <div className="card-body text-light">
                    {loadingInsights ? (
                        <div className="d-flex align-items-center text-muted">
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Generating real-time insights...
                        </div>
                    ) : (
                        <div>
                            <ReactMarkdown>{aiInsights || "No insights available at the moment."}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            <SummaryCards summary={summary} />

            <div className="row mt-4">

                <div className="col-md-6">
                    <CategoryChart data={category} />
                </div>

                <div className="col-md-6">
                    <PriorityChart data={priority} />
                </div>

            </div>

            <div className="row mt-4">

                <div className="col-md-12">
                    <TeamChart data={team} />
                </div>

            </div>

        </div>

    );

}

export default Dashboard;