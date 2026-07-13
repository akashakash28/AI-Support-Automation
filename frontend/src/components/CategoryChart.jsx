import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function CategoryChart({ data }) {

    const chartData = {

        labels: data.map(item => item.category),

        datasets: [

            {

                data: data.map(item => item.count),

                backgroundColor: [

                    "#0d6efd",
                    "#198754",
                    "#dc3545",
                    "#ffc107",
                    "#6f42c1",
                    "#20c997"

                ]

            }

        ]

    };

    return (

        <div className="card shadow">

            <div className="card-body">

                <h4 className="text-center">

                    Ticket Categories

                </h4>

                <Pie data={chartData} />

            </div>

        </div>

    );

}

export default CategoryChart;