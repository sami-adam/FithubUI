import Add from '@mui/icons-material/Add';
import { Button, useTheme } from '@mui/joy';


export default function AddNewButton({ title }){
    const theme = useTheme();
    return (
        <Button variant="solid"
            sx={{ backgroundColor: theme.palette.primary.dark, color: theme.palette.primary.light, 
                '&:hover': { backgroundColor: theme.palette.primary.dark },
                '&:active': { backgroundColor: theme.palette.primary.dark, opacity: 0.8 },
            }}
            startDecorator={<Add />}
            size="sm">
            Add New {title}
        </Button>
    )
}