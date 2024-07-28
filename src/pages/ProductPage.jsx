import { useEffect } from "react";
import useProductStore from "../state/productState";
import ProductCard from "../components/common/product/ProductCard";
import { Box, Grid, Typography } from "@mui/joy";
import AddNewButton from "../components/common/Buttons";

export default function ProductPage() {
    const [products, fetchProducts] = useProductStore((state) => [state.products, state.fetchProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div style={{paddingInlineStart:5}}>
        <Box
            sx={{
                display: 'flex',
                mb: 1,
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                pt: { xs: 5, sm: 5 },
            }}
            >
            <Typography level="h2" component="h1">
                Subscription Types
            </Typography>
            <AddNewButton title="Product" />
        </Box>
        <div style={{marginTop:"20px"}}>
            

            <Grid
                container
                spacing={{ xs: 1, md: 1 }}
                columns={{ xs: 2, sm: 8, md: 16 }}
                sx={{ flexGrow: 1 }}>
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