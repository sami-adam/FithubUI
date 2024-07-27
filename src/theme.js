// theme.js
import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#008299',
          light: '#FAFBFF',
          dark: '#004E64',
        },
        secondary: {
          main: '#2196F3',
          light: '#BBDEFB',
          dark: '#0D47A1',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#90CAF9',
          light: '#E3F2FD',
          dark: '#1E88E5',
        },
        secondary: {
          main: '#F48FB1',
          light: '#F8BBD0',
          dark: '#AD1457',
        },
      },
    },
  },
});

export default theme;
