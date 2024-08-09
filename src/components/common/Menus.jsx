import { Box, ListItemButton, ListItemContent, Typography } from "@mui/joy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export function Toggler({defaultExpanded = false, renderToggle, children}) {
    const [open, setOpen] = useState(defaultExpanded);
    return (
      <>
        {renderToggle({ open, setOpen })}
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: open ? '1fr' : '0fr',
            transition: '0.2s ease',
            '& > *': {
              overflow: 'hidden',
            },
          }}
        >
          {children}
        </Box>
      </>
    );
  }

  export function MenuToggler({mainMenu, children, icon=<KeyboardArrowDownIcon/>}) {
    const {t} = useTranslation();
    return (
        <Toggler
            renderToggle={({ open, setOpen }) => (
            <ListItemButton onClick={() => setOpen(!open)}>
                {icon}
                <ListItemContent>
                <Typography level="title-sm">{t(mainMenu)}</Typography>
                </ListItemContent>
                <KeyboardArrowDownIcon
                sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                />
            </ListItemButton>
            )}
        >
            {children}
        </Toggler>
    )
  }
  