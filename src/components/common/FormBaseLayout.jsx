import { Box, Card } from "@mui/joy";
import { FormBackButton } from "./Buttons";
import LoadingPage from "./LaodingPage";



export default function FormBaseLayout({ children, loading=false }) {
    return (
        <Box flex={1} sx={{ width: "100%"}}>
            {loading && <LoadingPage/> ||
            <Card
            variant="outlined"
            sx={{
                maxHeight: 'max-content',
                //maxWidth: '100%',
                mx: 'auto',
                // to make the demo resizable
                overflow: 'auto',
                resize: 'vertical',
                width: { xs: "90%", md: "70%" },
                mt: { xs: 10, md: 4 },
                
                }}>
                <FormBackButton/>
                {children}
            </Card>
            }
        </Box>

    )
}