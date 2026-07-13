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

function PriorityChart({ data }) {

    const chartData = {

        labels: data.map(item => item.priority),

        datasets: [

            {

                label: "Tickets",

                data: data.map(item => item.count),

                backgroundColor: [

                    "#dc3545",
                    "#ffc107",
                    "#0d6efd"

                ]

            }

        ]

    };

    return (

        <div className="card shadow">

            <div className="card-body">

                <h4 className="text-center">

                    Priority Distribution

                </h4>

                <Bar data={chartData} />

            </div>

        </div>

    );

}

export default PriorityChart;