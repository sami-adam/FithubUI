import { useEffect, useState } from "react";
import { PieChart } from "../components/dashboard/PieCharts";
import useDashboardStore from "../state/dashboardState";

export default function Dashboard() {
    const getSubscriptionsByProduct = useDashboardStore((state) => state.getSubscriptionsByProduct);
    const [subscriptionsByProduct, setSubscriptionsByProduct] = useState([["Product", "Subscriptions"]]);
    const [fetchData, setFetchData] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const data = await getSubscriptionsByProduct();
            var localSubscriptionData = [["Product", "Subscriptions"]];
            for(var productId in data) {
                localSubscriptionData.push([data[productId].name, data[productId].subscriptionCount]);
            }
            setSubscriptionsByProduct(localSubscriptionData);
        }
        if (fetchData) {
            fetchData();
            setFetchData(false);
        }
    }, [getSubscriptionsByProduct, fetchData]);
    const options = { legend: "none", title: "Subscriptions By Product" };
    return (
        <PieChart data={[...new Set(subscriptionsByProduct)]} options={options} width="50%" height="300px" />
    );
    }