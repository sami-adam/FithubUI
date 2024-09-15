import React, { useState } from "react";
import { Line } from "react-chartjs-2";
function LineChart({ data }) {
  const [chartData, setChartData] = useState({
    labels: data.map((data) => data.name), 
    datasets: [
      {
        label: "Users Gained ",
        data: data.map((data) => data.account),
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
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Line Chart</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}
export default LineChart;