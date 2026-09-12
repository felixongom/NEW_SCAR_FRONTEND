// chartUtils.js
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export async function generateChartImage(grade_count,is_a_level, clas) {
    // console.log(grade_count);
    
// 
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    let data_set = [
        {
          label: "A",
          data: grade_count.map(data=>data.Aper),
          backgroundColor: "#008000",
        
        },
        {
          label: "B",
          data: grade_count.map(data=>data.Bper),
          backgroundColor: "#cc6600",

        },
        {
          label: "C",
          data: grade_count.map(data=>data.Cper),
          backgroundColor: "#002266",
        
        },
        {
          label: "D",
          data: grade_count.map(data=>data.Dper),
          backgroundColor: "#008080",
        },
        {
          label: "E",
          data: grade_count.map(data=>data.Eper),
          backgroundColor: "#cc0066",
        }, 
      ]
      // 
      let a_level_dataset = [{
          label: "O",
          data: grade_count.map(data=>data.Oper),
          backgroundColor: "#8c1aff",
        },
        {
          label: "F",
          data: grade_count.map(data=>data.Fper),
          backgroundColor: "#660000",
        },
        {
          label: "MISS",
          data: grade_count.map(data=>clas.includes('UNEB')?data.X:data.MISSper),
          backgroundColor: "#ff0000",
        },]
      let o_level_dataset = [
        {
          label: clas.includes('UNEB')?'X': "MISS",
          data: grade_count.map(data=>clas.includes('UNEB')?data.X:data.MISSper),
          backgroundColor: "#ff0000",
        },]

    const chartData = {
      labels: grade_count.map(data=>data.subject),
      datasets: is_a_level?[...data_set, ...a_level_dataset]:[...data_set, ...o_level_dataset]
    };

    new Chart(ctx, {
    //   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      type: "bar",
      data: chartData,
      options: { 
        responsive: false,
        legend: {
            position: 'left'
        }
     },
    });

    // Wait a moment for rendering before exporting
    setTimeout(() => {
      resolve(canvas.toDataURL("image/png"));
    }, 500);
  });
}
export  async function generateSubsidiaryChartImage(grade_count) {    
// 
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    const chartData = {
      labels: grade_count.map(data=>data.subject),
      datasets: [
        {
          label: "O",
          data: grade_count.map(data=>data.Oper),
          backgroundColor: "#008000",
        },
        {
          label: "F",
          data: grade_count.map(data=>data.Fper),
          backgroundColor: "#660000",
        },
        {
          label: "MISS",
          data: grade_count.map(data=>data.MISSper),
          backgroundColor: "#ff0000",
        },
      ],
    };

    new Chart(ctx, {
    //   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      type: "bar",
      data: chartData,
      options: { 
        responsive: false,
        legend: {
            position: 'left'
        }
     },
    });

    // Wait a moment for rendering before exporting
    setTimeout(() => {
      resolve(canvas.toDataURL("image/png"));
    }, 500);
  });
}
