function SummaryCards({ summary }) {

    return (

        <div className="row mt-4">

            <div className="col-md-4 mb-3">
                <div className="card bg-primary text-white">
                    <div className="card-body">
                        <h5>Total Tickets</h5>
                        <h2>{summary.totalTickets}</h2>
                    </div>
                </div>
            </div>

            <div className="col-md-4 mb-3">
                <div className="card bg-warning text-dark">
                    <div className="card-body">
                        <h5>Open Tickets</h5>
                        <h2>{summary.openTickets}</h2>
                    </div>
                </div>
            </div>

            <div className="col-md-4 mb-3">
                <div className="card bg-success text-white">
                    <div className="card-body">
                        <h5>Closed Tickets</h5>
                        <h2>{summary.closedTickets}</h2>
                    </div>
                </div>
            </div>

            <div className="col-md-4 mb-3">
                <div className="card bg-info text-white">
                    <div className="card-body">
                        <h5>In Progress</h5>
                        <h2>{summary.inProgressTickets}</h2>
                    </div>
                </div>
            </div>

            <div className="col-md-4 mb-3">
                <div className="card bg-danger text-white">
                    <div className="card-body">
                        <h5>Critical</h5>
                        <h2>{summary.criticalTickets}</h2>
                    </div>
                </div>
            </div>

            <div className="col-md-4 mb-3">
                <div className="card bg-dark text-white">
                    <div className="card-body">
                        <h5>High Priority</h5>
                        <h2>{summary.highPriorityTickets}</h2>
                    </div>
                </div>
            </div>

            <div className="col-md-4 mb-3">
                <div className="card text-white" style={{ background: "linear-gradient(135deg, #f85032 0%, #e73827 100%)"}}>
                    <div className="card-body">
                        <h5>SLA Breaches (Escalated)</h5>
                        <h2>{summary.escalatedTickets || 0} <span style={{fontSize: "0.5em", opacity: 0.8}}>tickets</span></h2>
                    </div>
                </div>
            </div>

            <div className="col-md-4 mb-3">
                <div className="card text-white" style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"}}>
                    <div className="card-body">
                        <h5>Human Hours Saved</h5>
                        <h2>{Math.max(4, Math.floor(summary.totalTickets * 0.5))} <span style={{fontSize: "0.5em", opacity: 0.8}}>hrs</span></h2>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default SummaryCards;