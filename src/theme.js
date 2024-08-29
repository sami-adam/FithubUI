// theme.js
import { extendTheme } from '@mui/joy';
import createCache from '@emotion/cache';
import i18n from './i18n';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

const cacheRtl = createCache({
  key: 'joyrtl',
  stylisPlugins: [prefixer, stylisRTLPlugin],
});

const cacheLtr = createCache({
  key: 'joyltr',
  stylisPlugins: [prefixer],
});

const theme = extendTheme({
  components: {
    JoyCard: {
      styleOverrides: {
        root: {
          backgroundColor: "common.white",
          border: "1px solid common.white",
          width: { xs: 1, sm: 1, md: 1 },
        }
      }
    },
    JoyAutocomplete: {
      styleOverrides: {
        root: {
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          backgroundColor: "var(--palette-primary-solidBg)",
        }
      }
    },
    JoyInput: {
      styleOverrides: {
        root: {
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          backgroundColor: "var(--palette-primary-solidBg)",
        },
      },
    },
    JoySelect: {
      styleOverrides: {
        root: {
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          backgroundColor: "var(--palette-primary-solidBg)",
        },
      },
    },
    JoyFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
  },
  fontFamily: {
    display: i18n.language === 'ar' ? 'IBM Sans Arabic' : 'sans-serif', // applies to `h1`–`h4`
    body: i18n.language === 'ar' ? 'IBM Sans Arabic' : 'sans-serif', // applies to `title-*` and `body-*`
  },
  typography: {
    fontFamily: i18n.language === 'ar' ? 'IBM Sans Arabic' : 'sans-serif',
  },
  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#008299',
          light: '#FAFBFF',
          dark: '#004E64',
          // Light mode primary color settings
          solidBg: '#1a759f', // Primary main color
          solidHoverBg: '#1e6091', // Darker shade for hover
          solidActiveBg: '#184e77', // Even darker shade for active state
          plainColor: '#115293', // Text color or icon color
          outlinedBorder: '#1976D2', // Border color for outlined variant
        },
        secondary: {
          main: '#2196F3',
          light: '#BBDEFB',
          dark: '#0D47A1',
          // Light mode secondary color settings
          solidBg: '#9C27B0', // Secondary main color
          solidHoverBg: '#6A1B9A', // Darker shade for hover
          solidActiveBg: '#4A148C', // Even darker shade for active state
          plainColor: '#6A1B9A', // Text color or icon color
          outlinedBorder: '#9C27B0', // Border color for outlined variant
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#90CAF9',
          light: '#E3F2FD',
          dark: '#1E88E5',
          // Dark mode primary color settings
          solidBg: '#90CAF9', // Primary main color
          solidHoverBg: '#64B5F6', // Lighter shade for hover
          solidActiveBg: '#42A5F5', // Even lighter shade for active state
          plainColor: '#64B5F6', // Text color or icon color
          outlinedBorder: '#90CAF9', // Border color for outlined variant
        },
        secondary: {
          main: '#F48FB1',
          light: '#F8BBD0',
          dark: '#AD1457',
          // Dark mode secondary color settings
          solidBg: '#CE93D8', // Secondary main color
          solidHoverBg: '#BA68C8', // Lighter shade for hover
          solidActiveBg: '#AB47BC', // Even lighter shade for active state
          plainColor: '#BA68C8', // Text color or icon color
          outlinedBorder: '#CE93D8', // Border color for outlined variant
        },
      },
    },
  },
});

export default theme;
export { cacheRtl, cacheLtr };
