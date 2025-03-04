"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 

const Chartj: React.FC = () => {


  // X-axis labels
  const labels: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
  ];

  // Data to show on the chart
  const datasets: number[] = [12, 45, 67, 43, 89, 34, 67, 43];

  const data = {
    labels,
    datasets: [
      {
        label: "Transaction Analysis",
        data: datasets,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Configuration options
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: "Y-axis Label",
        },
        min: 10,
      },
      x: {
        title: {
          display: true,
          text: "X-axis Label",
        },
      },
    },
  };

  return (
    <div style={{ width: "700px",height:"400px", margin:"0 200px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default Chartj;