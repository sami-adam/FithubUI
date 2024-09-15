import React, { useState } from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);
export default function PieChart({ data }) {
  console.log("Before Data In Pie:::::::::::::",data);
  const [chartData, setChartData] = useState({
    labels: data.map((rec) => rec.year || rec.id ),
    datasets: [
      {
        label: "Users Gained ",
        data: data.map((rec) => rec.count || rec.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });
  console.log("After Data In Pie:::::::::::::",chartData);
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
      <Pie key={chartData.labels}
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            }
          }
        }}
      />
    </div>
  );
}
