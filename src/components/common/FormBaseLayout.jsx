import { Box, Card } from "@mui/joy";
import { FormBackButton } from "./Buttons";
import LoadingPage from "./LaodingPage";



export default function FormBaseLayout({ children, loading=false }) {
    return (
        <Box flex={1} sx={{ width: "100%"}}>
            {loading && <LoadingPage/> ||
            <Card
            variant="plain"
            sx={{
                maxHeight: 'max-content',
                //maxWidth: '100%',
                mx: 'auto',
                // to make the demo resizable
                overflow: 'auto',
                resize: 'vertical',
                width: { xs: "90%", md: "70%" },
                mt: { xs: 10, md: 4 },
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                
                }}>
                <FormBackButton/>
                {children}
            </Card>
            }
        </Box>

    )
}