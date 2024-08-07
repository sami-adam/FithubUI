// theme.js
import { extendTheme } from '@mui/joy/styles';
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
export { cacheRtl, cacheLtr };
