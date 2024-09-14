import { Box, Button, Card, Typography, useTheme } from "@mui/joy";
import { DeleteButton, FormBackButton } from "./Buttons";
import LoadingPage from "./LaodingPage";
import backgroundImage from '../../assets/background.jpg';
import backgroundImageDark from '../../assets/backgrounddm.jpg';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { BsSave } from "react-icons/bs";
import { IoTrashBinOutline } from "react-icons/io5";
import { Add } from "@mui/icons-material";
import { validateInputs } from "../../utils/validations";
import Swal from "sweetalert2";
import { useState } from "react";
import { SnackbarCustom } from "./Common";
import { position } from "stylis";



export default function FormBaseLayout({ children, loading=false }) {
    const theme = useTheme();
    const { i18n } = useTranslation();
    return (
        <>
        <Box flex={1} sx={{ width: "100%"}}>
            {(loading && <LoadingPage/>) ||
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
        <ToastContainer autoClose={3000} theme={theme.palette.mode} rtl={i18n.dir() === 'rtl'} position="top-center"/>
        </>

    )
}

export function FormHeader({ children, loading=false, title="", mode, setMode, updateMethod, updateFields, addMethod, addFields, deleteMethod, deleteMessage, validateFields=[], stateStore, setRecord }) {
    const theme = useTheme();
    const {t} = useTranslation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});
    const handleAdd = async () => {
        const validInputs = validateInputs(validateFields);
        if(!validInputs){
            return;
        }
        const res = await addMethod(addFields);
        if(res.success){
            console.log(res.data);
            window.history.replaceState(null, "", window.location.pathname.replace("new", res.data.id));
        }
        if(res.success && setRecord){
            setRecord(res.data);
        }
        if(res && res.error){
            Swal.fire({
                title: t(res.error.message),
                text: t(res.error.details),
                icon: "error",
                confirmButtonText: t("OK"),
            });
            return
        }
        setMode('view');
        toast.success(t(`${title} added successfully!`));
        // setOpenSnackbar(true);
        // setSnack({type: 'success', title: 'Success', message: t(`${title} added successfully!`)});
    }
    const handleSave = async () => {
        const validInputs = validateInputs(validateFields);
        if(!validInputs){
            return;
        }
        // const res = await updateMethod(updateFields);
        // if(res && res.error){
        //     Swal.fire({
        //         title: t(res.error.message),
        //         text: t(res.error.details),
        //         icon: "error",
        //         confirmButtonText: t("OK"),
        //     });
        //     return
        // }
        toast.promise(
            updateMethod(updateFields),
            {
              pending: 'Saving...',
              success: t(`${title} updated successfully!`) + ' 🥳',
              error: t('An error occurred while updating the record'),
            },
        )
        setMode('view');
        // setOpenSnackbar(true);
        // setSnack({type: 'success', title: 'Success', message: t(`${title} updated successfully!`)});
    }
    return (
        <Box flex={1} sx={{ width: "100%"}}>
        <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
        {(loading && <LoadingPage/>) || 
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
                    {t(title)}
                </Typography>
                <div style={{ display: "flex", flexDirection:"row"}}>
                    <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
                    <Button variant='soft' startDecorator={<BsSave fontSize={18}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
                    <Box flexGrow={1} width={4}/>
                    <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
                    <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
                    <DeleteButton deleteMethod={deleteMethod} mode={mode} message={deleteMessage || t("Deleted successfully!")}/>
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
        {(loading && <LoadingPage/>) || 
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