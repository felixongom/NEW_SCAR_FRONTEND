"use client";

import { useDataContext } from "@/context/DataProvider";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

const WebGraph = ({ data = [] , title_text=null}) => {
  const {selected_clas} = useDataContext();
  const clas = parseInt(selected_clas.split(' ')[1])
  // let fbar = clas>4?[{
  //       label: "F",
  //       data: data.map(item => item.FPer ?? 0),
  //       backgroundColor: "#ff0000",
  //     }]:[]

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
        backgroundColor: "#ff0066",
      },
      {
        label: "D",
        data: data.map(item => item.DPer ?? 0),
        backgroundColor: "#f97316",
      },
      {
        label: "E",
        data: data.map(item => item.EPer ?? 0),
        backgroundColor: "#730099",
      },
      // ...fbar,
      {
        label: "MISS",
        data: data.map(item => item.MISSPer ?? 0),
        backgroundColor: "#333",
      }
    ],
  };
  const subsidiary_chartData = {
    labels: data.map(item => item.subject),

    datasets: [
      {
        label: "P",
        data: data.map(item => item.PPer ?? 0),
        backgroundColor: "#22c55e",
      },
      {
        label: "F",
        data: data.map(item => item.FPer ?? 0),
        backgroundColor: "#ef4444",
      },
      {
        label: "MISS",
        data: data.map(item => item.MISSPer ?? 0),
        backgroundColor: "#333",
      }
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
          text: clas<5?'SUBJECTS':title_text,
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
      <Bar data={title_text=="SUBSIDIARY SUBJECTS"?subsidiary_chartData:chartData} options={options} />
    </div>
  );
};

export default WebGraph;