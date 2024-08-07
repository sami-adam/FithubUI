import { useEffect } from "react";
import useFitnessClassStore from "../state/fitnessClassState";
import FitnessClassCard from "../components/fitnessClass/FitnessClassCard";
import { Box, Grid, Typography } from "@mui/joy";
import AddNewButton from "../components/common/Buttons";
import { useTranslation } from "react-i18next";

export default function FitnessClassPage() {
    const [fitnessClasses, fetchFitnessClasses] = useFitnessClassStore((state) => [state.fitnessClasses, state.fetchFitnessClasses]);
    const {t} = useTranslation();

    useEffect(() => {
        fetchFitnessClasses();
    }, [fetchFitnessClasses]);

    return (
        <div style={{paddingInlineStart:5, width:"100%"}}>
        <Box
            sx={{
                display: 'flex',
                mb: 1,
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                pt: { xs: 8, sm: 5 },
                pl: { xs: 6, sm: 8 },
            }}
            >
            <Typography level="h2" component="h1">
                {t("Fitness Classes")}
            </Typography>
            <AddNewButton title="Fitness Class" formUrl={"/fitness-class-form"} />
        </Box>
        <div style={{marginTop:"20px"}}>
            

            <Grid
                container
                spacing={{ xs: 1, md: 1 }}
                columns={{ xs: 2, sm: 8, md: 16 }}
                sx={{ flexGrow: 1 , pl:{xs:8, md:"auto"}}}>
                {fitnessClasses.map((fitnessClass, index) => (
                    <Grid xs={2} sm={4} md={4} key={index} width={{ xs: 1, sm: 1 , md: 1 }}>
                        <FitnessClassCard fitnessClass={fitnessClass} />
                    </Grid>
                ))}
            </Grid>
        </div>
        </div>
    )
}