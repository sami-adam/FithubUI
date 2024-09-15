import { useState } from "react";
import { Bar } from "react-chartjs-2";
export const BarChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: data.map((data) => data.name), 
    datasets: [
      {
        label: "Users Gained ",
        data: data.map((data) => data.count),
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
      <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
      <Bar style={{ marginBottom: "20px" }}
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
};