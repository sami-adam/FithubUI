import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { Button, Card, ListItem, ListItemButton, ListItemContent, Stack, styled, ToggleButtonGroup, toggleButtonGroupClasses, Typography, useTheme } from '@mui/joy';
import { Language } from '@mui/icons-material';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
      margin: theme.spacing(0.5),
      border: 0,
      borderRadius: theme.shape.borderRadius,
      [`&.${toggleButtonGroupClasses.disabled}`]: {
        border: 0,
      },
    },
    [`& .${toggleButtonGroupClasses.selected}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.light
    },
    [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
      {
        //marginLeft: -1,
        borderLeft: '1px solid transparent',
      },
  }));

const LanguageSwitch = () => {
    const theme = useTheme();
    const primaryMainColor = theme.palette.primary.main;
    const primaryLightColor = theme.palette.primary.light;
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
        <ListItemButton role="menuitem" onClick={()=> handleChange(i18n.language == 'ar' ? 'en' : 'ar')}>
          <Language sx={{ paddingInlineStart:1}}/>
          <ListItemContent>
            <Typography level="title-sm">
              {i18n.language == 'ar' ? t('English') : t('Arabic')}
            </Typography>
          </ListItemContent>
        </ListItemButton>
      </ListItem>
      {/* <Card
        elevation={0}
        sx={{
          display: 'flex',
          border: "none",
          flexWrap: 'wrap',
        }}
      >
      <Stack direction="row" spacing={4}>
      <StyledToggleButtonGroup
          size="small"
          value={i18n.language}
          exclusive
          onChange={handleChange} 
          sx={{height:"30px"}}
          aria-label="change language">
            <Button value="en" aria-label="left aligned">
                {t("English")}
            </Button>
            <Button value="ar" aria-label="centered">
                {t("Arabic")}
            </Button>
        </StyledToggleButtonGroup>
        </Stack>
    </Card> */}
    </div>
  );
};

export default LanguageSwitch;
