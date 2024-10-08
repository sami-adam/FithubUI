import { useEffect } from "react";
import useProductStore from "../state/productState";
import ProductCard from "../components/product/ProductCard";
import { Box, Grid, Typography } from "@mui/joy";
import AddNewButton from "../components/common/Buttons";
import { useTranslation } from "react-i18next";

export default function ProductPage() {
    const [products, fetchProducts] = useProductStore((state) => [state.products, state.fetchProducts]);
    const {t} = useTranslation();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


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
            <AddNewButton title="Product" formUrl={"/product-form"} />
        </Box>
        <div style={{marginTop:"20px", width:"95%"}}>
            

            <Grid
                container
                spacing={{ xs: 1, md: 1 }}
                columns={{ xs: 2, sm: 8, md: 16 }}
                sx={{ flexGrow: 1 , pl:{xs:8, md:"auto"}}}>
                {products.map((product, index) => (
                    <Grid xs={2} sm={4} md={4} key={index}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </div>
        </div>
    )
}