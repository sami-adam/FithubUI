import { useEffect, useState } from "react";
import { PieChart } from "../components/dashboard/PieCharts";
import useDashboardStore from "../state/dashboardState";
import { Box, Grid, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
    const getSubscriptionsByProduct = useDashboardStore((state) => state.getSubscriptionsByProduct);
    const [subscriptionsByProduct, setSubscriptionsByProduct] = useState([["Product", "Subscriptions"]]);
    const [fetchData, setFetchData] = useState(true);
    const {t} = useTranslation();

    useEffect(() => {
        async function fetchData() {
            const data = await getSubscriptionsByProduct();
            var localSubscriptionData = [["Product", "Subscriptions"]];
            for(var productId in data) {
                var nameSplit = data[productId].name.split(" ");
                localSubscriptionData.push([nameSplit[1] + " " + nameSplit[2], data[productId].subscriptionCount]);
            }
            setSubscriptionsByProduct(localSubscriptionData);
        }
        if (fetchData) {
            fetchData();
            setFetchData(false);
        }
    }, [getSubscriptionsByProduct, fetchData]);
    const options = { legend: 'none', pieSliceText: 'label', title: "Subscriptions By Product"};
    return (
        <div style={{paddingInlineStart:5, width:"100%"}}>
        <Box
            sx={{
                display: 'flex',
                mb: 1,
                gap: 1,
                px: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                pt: { xs: 8, sm: 5 },
                pl: { xs: 6, sm: 8 },
            }}
            >
            <Typography level="h2" component="h1">
                {t("Subscription Types")}
            </Typography>
        </Box>
        <div style={{marginTop:"20px", width:"95%"}}>
            

            <Grid
                container
                spacing={{ xs: 1, md: 1 }}
                columns={{ xs: 2, sm: 8, md: 16 }}
                sx={{ flexGrow: 1 , pl:{xs:8, md:"auto"}}}>
                    <Grid xs={2} sm={4} md={4}>
                        <Box sx={{display: "flex", justifyContent: "center", backgroundColor: "gray"}}>
                            <PieChart data={subscriptionsByProduct} options={options} width="100%" height="300px" />
                        </Box>
                    </Grid>

                    <Grid xs={2} sm={4} md={4}>
                        <Box sx={{display: "flex", justifyContent: "center", backgroundColor: "gray"}}>
                            <PieChart data={subscriptionsByProduct} options={options} width="100%" height="300px" />
                        </Box>
                    </Grid>

                    <Grid xs={2} sm={4} md={4}>
                        <Box sx={{display: "flex", justifyContent: "center", backgroundColor: "gray"}}>
                            <PieChart data={subscriptionsByProduct} options={options} width="100%" height="300px" />
                        </Box>
                    </Grid>

                    <Grid xs={2} sm={4} md={4}>
                        <Box sx={{display: "flex", justifyContent: "center", backgroundColor: "gray"}}>
                            <PieChart data={subscriptionsByProduct} options={options} width="100%" height="300px" />
                        </Box>
                    </Grid>
            </Grid>
        </div>
        </div>
    );
    }