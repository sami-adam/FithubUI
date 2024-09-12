import Add from '@mui/icons-material/Add';
import { Button, useTheme } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IoTrashBinOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';

export default function AddNewButton({ title, formUrl }){
    const theme = useTheme();
    const navogate = useNavigate();
    const {t} = useTranslation();
    return (
        <Button variant="solid" className='shadow-inner'
            sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, color: theme.palette.primary.light, 
                '&:hover': { backgroundColor: theme.palette.primary.dark },
                '&:active': { backgroundColor: theme.palette.primary.dark, opacity: 0.8 },
            }}
            startDecorator={<Add />}
            onClick={() => navogate(formUrl, {state: {viewMode: "add"}})}
            size="sm">
            {t("Add New")} {t(title)}
        </Button>
    )
}

export function FormBackButton(){
    return (
        <>
        <Button variant='soft' sx={{ position: "absolute", top: {xs: 56, sm: 1}, right:1, margin:0.5}} onClick={() => window.history.back()}>
            <ArrowBackIcon sx={{ fontSize:24 }}/>
        </Button>
        <br/>
        </>
    )
}

export function TableBackButton(){
    return (
        <>
        <Button variant='soft' sx={{ position: "absolute", top:1, right:1, margin:0.5}} onClick={() => window.history.back()}>
            <ArrowBackIcon sx={{ fontSize:24 }}/>
        </Button>
        <br/>
        </>
    )
}

export function DeleteButton({deleteMethod, ids=[], mode, error, message}){
    const theme = useTheme();
    const {t} = useTranslation();
    const {id} = useParams();
    const handelDelete = () => {
        Swal.fire({
          title: t("Are you sure?"),
          text: t("You won't be able to revert this!"),
          color: theme.palette.mode === 'dark' ? "white" : "black",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: theme.palette.primary.main,
          cancelButtonColor: theme.palette.mode === 'dark' ? "brown" : "brown",
          confirmButtonText: t("Yes, delete it!"),
          cancelButtonText: t("Cancel"),
          background: theme.palette.mode === 'dark' ? 'black' : '#fff',
        }).then((result) => {
          if (result.isConfirmed) {
            deleteMethod(id);
            if(error){
              Swal.fire({
                title: t("Error"),
                text: t(error),
                icon: "error",
                confirmButtonText: t("OK"),
              });
              return;
            }
            Swal.fire({
              title: t("Deleted!"),
              text: t(message),
              icon: "success",
              confirmButtonText: t("OK"),
            });
            window.history.back();
          }
        });
          // setOpenSnackbar(true);
          // setSnack({type: 'success', title: 'Success', message: 'Employee deleted successfully'});
      }
    return (
        <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={handelDelete} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("DELETE")}</Button>
    );
}