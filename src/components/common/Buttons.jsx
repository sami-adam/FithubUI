import Add from '@mui/icons-material/Add';
import { Button, useTheme } from '@mui/joy';
import { useNavigate } from 'react-router-dom';


export default function AddNewButton({ title, formUrl }){
    const theme = useTheme();
    const navogate = useNavigate();
    return (
        <Button variant="solid"
            sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, color: theme.palette.primary.light, 
                '&:hover': { backgroundColor: theme.palette.primary.dark },
                '&:active': { backgroundColor: theme.palette.primary.dark, opacity: 0.8 },
            }}
            startDecorator={<Add />}
            onClick={() => navogate(formUrl, {state: {viewMode: "add"}})}
            size="sm">
            Add New {title}
        </Button>
    )
}