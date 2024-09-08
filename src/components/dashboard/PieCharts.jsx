import React from "react";
import { Chart } from "react-google-charts";

export function PieChart({ data = [], options ={}, width = "50%", height = "300px" }) {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={width}
      height={height}
    />
  );
}
