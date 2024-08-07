import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import {ListItem, ListItemButton, ListItemContent, Typography, useTheme } from '@mui/joy';
import { Language } from '@mui/icons-material';


const LanguageSwitch = () => {
    const theme = useTheme();
    const {t} = useTranslation();

    useEffect(() => {
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        theme.direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language, theme.direction]);

    const handleChange = (language) => {
        i18n.changeLanguage(language);
        window.location.reload();
    };

  return (
    <div>
      <ListItem>
        <ListItemButton role="menuitem" onClick={()=> handleChange(i18n.language === 'ar' ? 'en' : 'ar')}>
          <Language sx={{ paddingInlineStart:1}}/>
          <ListItemContent>
            <Typography level="title-sm">
              {i18n.language === 'ar' ? t('English') : t('Arabic')}
            </Typography>
          </ListItemContent>
        </ListItemButton>
      </ListItem>
    </div>
  );
};

export default LanguageSwitch;
