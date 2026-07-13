import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(

    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend

);

function TeamChart({ data }) {

    const chartData = {

        labels: data.map(item => item.assignedTeam),

        datasets: [

            {

                label: "Tickets",

                data: data.map(item => item.count),

                backgroundColor: "#198754"

            }

        ]

    };

    return (

        <div className="card shadow">

            <div className="card-body">

                <h4 className="text-center">

                    Assigned Teams

                </h4>

                <Bar data={chartData} />

            </div>

        </div>

    );

}

export default TeamChart;