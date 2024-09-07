import Add from '@mui/icons-material/Add';
import { Button, useTheme } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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