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
  const getSubscriptionsByProduct = useDashboardStore((state) => state.getSubscriptionsByProduct);
  const [subscriptionsByProduct, setSubscriptionsByProduct] = useState([]);
  const [fetchData, setFetchData] = useState(true);
  const data = Data;

  useEffect(() => {
    const getData = async () => {
      const response = await getSubscriptionsByProduct();
      var data = [];
      for (const [key, value] of Object.entries(response.data)) {
        data.push({ id: key,name: value.productName , count: value.subscriptionCount });
      }
      setSubscriptionsByProduct(data);
    };
    getData();
  }, []);
  return (
    <div style={{ width: "100%"}}>
      <div style={{width:"100%", display: "flex", flexDirection: "row", alignItems:"baseline"}}>
        <Card sx={{ width: "45%", m: 1}}>
            <BarChart data={data}/>
        </Card>
        <Card sx={{ width: "45%", m: 1 }}>
          <LineChart data={data} />
        </Card>
      </div>
      <div style={{width:"100%", display: "flex", flexDirection: "row", alignItems:"baseline"}}>
        <Card sx={{ width: "22%", height:"15%", m:1 }}>
            <PieChart data={subscriptionsByProduct} />
        </Card>
        <Card sx={{ width: "22%", height:"15%", m:1 }}>
            <PieChart data={data} />
        </Card>
        <Card sx={{ width: "22%", height:"15%", m:1 }}>
            <PieChart data={data} />
        </Card>
        <Card sx={{ width: "22%", height:"15%", m:1 }}>
            <PieChart data={data} />
        </Card>
      </div>
    </div>
    );
    }