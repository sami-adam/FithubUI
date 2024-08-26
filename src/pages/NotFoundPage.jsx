import React from 'react';
import { Box, Typography, Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Navigate to the homepage or any other desired route
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 2,
      }}
    >
      <Typography level="h1" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        Oops! Page Not Found
      </Typography>
      <Typography level="body1" sx={{ mb: 4 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="solid" color="primary" onClick={handleGoHome}>
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFoundPage;
