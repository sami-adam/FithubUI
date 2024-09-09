import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Data } from "../utils/Data";
import { useEffect, useState } from "react";
import PieChart from "../components/dashboard/PieChart";
import LineChart from "../components/dashboard/LineChart";
import { BarChart } from "../components/dashboard/BarChart";
import useDashboardStore from "../state/dashboardState";
import { Box, Card, Grid, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import LoadingPage, { CircularLoadingPage } from "../components/common/LaodingPage";

Chart.register(CategoryScale);
export default function Dashboard() {
    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.year), 
        datasets: [
          {
            label: "Users Gained ",
            data: Data.map((data) => data.userGain),
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
        <div style={{ width: "100%"}}>
          <div style={{width:"100%"}}>
            <Card sx={{ width: "25%", height:"15%", gridColumn: { xs: '1/-1', md: '1/1' }}}>
                <PieChart chartData={chartData} />
            </Card>
          </div>
          <div style={{width:"100%", display: "flex", flexDirection: "row", alignItems:"baseline"}}>
            <Card sx={{ width: "45%", gridColumn: { xs: '1/-1', md: '1/2' } }}>
                <BarChart chartData={chartData}/>
            </Card>
            <Card sx={{ width: "45%", gridColumn: { xs: '1/-1', md: '2/2' }}}>
              <LineChart chartData={chartData} />
            </Card>
          </div>
        </div>
    );
    }