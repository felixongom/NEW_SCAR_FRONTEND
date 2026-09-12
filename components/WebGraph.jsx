"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WebGraph = ({ data = [] }) => {
  const chartData = {
    labels: data.map(item => item.subject),

    datasets: [
      {
        label: "A",
        data: data.map(item => item.APer ?? 0),
        backgroundColor: "#22c55e",
      },
      {
        label: "B",
        data: data.map(item => item.BPer ?? 0),
        backgroundColor: "#3b82f6",
      },
      {
        label: "C",
        data: data.map(item => item.CPer ?? 0),
        backgroundColor: "#eab308",
      },
      {
        label: "D",
        data: data.map(item => item.DPer ?? 0),
        backgroundColor: "#f97316",
      },
      {
        label: "E",
        data: data.map(item => item.EPer ?? 0),
        backgroundColor: "#ef4444",
      },
      {
        label: "MISS",
        data: data.map(item => item.MISSPer ?? 0),
        backgroundColor: "#6b7280",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Percentage of Grades per Subject",
      },

      tooltip: {
        callbacks: {
          label: context =>
            `${context.dataset.label}: ${context.raw}%`,
        },
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "SUBJECTS",
        },
      },

      y: {
        beginAtZero: true,
        max: 100,

        title: {
          display: true,
          text: "PERCENTAGE (%)",
        },

        ticks: {
          callback: value => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="w-full h-[450px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default WebGraph;