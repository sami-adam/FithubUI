import { Box, Card, useTheme } from "@mui/joy";
import { FormBackButton } from "./Buttons";
import LoadingPage from "./LaodingPage";



export default function FormBaseLayout({ children, loading=false }) {
    const theme = useTheme();
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
                mt: { xs: 2, md: 1 },
                boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.1)",
                backgroundColor: theme.palette.mode == "light" ? "white" : "black",
                
                }}>
                {children}
            </Card>
            }
        </Box>

    )
}

export function FormHeader({ children }) {
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            //alignItems: 'center',
            mx: 'auto',
            px: 1,
            borderBottom: '1px solid',
            border: "none",
            width: { xs: "90%", md: "70%" },
            mt: { xs: 10, md: 4 },
            }}>
            <FormBackButton/>
            {children}
        </Box>
    )
}

export function FormFooter({ children }) {
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mx: 'auto',
            px: 1,
            borderTop: '1px solid',
            border: "none",
            width: { xs: "90%", md: "70%" },
            mt: { xs: 2, md: 1 },
            }}>
            {children}
        </Box>
    )
}