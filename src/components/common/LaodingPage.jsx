import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LinearProgress, CircularProgress } from '@mui/joy';

const LoadingPage = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
      }}
    >
      <LinearProgress sx={{ width: 80}}/>
      {/* <Typography variant="h5" sx={{ mt: 2 }}>
        {t("Loading...")}
      </Typography> */}
    </Box>
  );
};

export default LoadingPage;


const CircularLoadingPage = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
      }}
    >
      <CircularProgress sx={{ width: 80}}/>
    </Box>
  );
}

export { CircularLoadingPage };