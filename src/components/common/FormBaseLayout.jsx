import { Box, Button, Card, Typography, useTheme } from "@mui/joy";
import { FormBackButton } from "./Buttons";
import LoadingPage from "./LaodingPage";
import backgroundImage from '../../assets/background.jpg';
import backgroundImageDark from '../../assets/backgrounddm.jpg';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { BsSave } from "react-icons/bs";
import { IoTrashBinOutline } from "react-icons/io5";
import { Add } from "@mui/icons-material";



export default function FormBaseLayout({ children, loading=false }) {
    const theme = useTheme();
    return (
        <>
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
                backgroundColor: "#ffffff00" //theme.palette.mode == "light" ? "white" : "black",
                
                }}>
                {children}
            </Card>
            }
        </Box>
        <ToastContainer autoClose={3000}/>
        </>

    )
}

export function FormHeader({ children, loading=false, mode, setMode, handleSave, handleAdd, handelDelete }) {
    const theme = useTheme();
    const {t} = useTranslation();
    return (
        <Box flex={1} sx={{ width: "100%"}}>
        {loading && <LoadingPage/> || 
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                //alignItems: 'center',
                mx: 'auto',
                px: 1,
                pb: 1,
                borderBottom: '1px solid',
                border: "none",
                width: { xs: "90%", md: "70%" },
                mt: { xs: 10, md: 4 },
                backgroundImage: theme.palette.mode === 'dark'? `url(${backgroundImageDark})`: `url(${backgroundImage})`
                }}>
                <FormBackButton/>
                {children}
                <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16, width:"100%"}}>
                <Typography level="title-lg">
                    {t("Employee Information")}
                </Typography>
                <div style={{ display: "flex", flexDirection:"row"}}>
                    <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
                    <Button variant='soft' startDecorator={<BsSave fontSize={18}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
                    <Box flexGrow={1} width={4}/>
                    <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
                    <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
                    <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={handelDelete} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("DELETE")}</Button>
                </div>
                </div>
            </Box>
        }
        </Box>
    )
}

export function FormFooter({ children, loading=false }) {
    return (
        <Box flex={1} sx={{ width: "100%"}}>
        {loading && <LoadingPage/> || 
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
            width: { xs: "90%", md: "71%" },
            mt: { xs: 2, md: 1 },
            }}>
            {children}
        </Box>
        }
        </Box>
    )
}