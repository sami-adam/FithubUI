import Add from '@mui/icons-material/Add';
import { Button, useTheme } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

export default function AddNewButton({ title, formUrl }){
    const theme = useTheme();
    const navogate = useNavigate();
    const {t} = useTranslation();
    return (
        <Button variant="solid"
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
        <Button variant='soft' sx={{ position: "absolute", zIndex: 9999, top:1, right:1}} onClick={() => window.history.back()}>
            <ArrowLeftIcon/>
        </Button>
    )
}