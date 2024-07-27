import { Button } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';
import { useEffect, useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function DarkMode() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);
  
    // necessary for server-side rendering
    // because mode is undefined on the server
    useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) {
      return <Button variant="soft">Change mode</Button>;
    }
  
    return (
      <Button
        variant="soft"
        onClick={() => {
          setMode(mode === 'light' ? 'dark' : 'light');
        }}
      >
        {mode === 'light' ? <DarkModeIcon/> : <LightModeIcon/>}
      </Button>
    );
  }
  