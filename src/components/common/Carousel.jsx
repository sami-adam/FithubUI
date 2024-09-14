import React, { useState, useEffect } from 'react';
import { AspectRatio, Box, Button, Typography, useTheme } from '@mui/joy';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export default function Carousel({ items, duration = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme  = useTheme();

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const interval = setInterval(handleNext, duration);
    return () => clearInterval(interval);
  }, [currentIndex, items.length]);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, margin: 'auto', overflow: 'hidden' }}>
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: index === currentIndex ? 'block' : 'none',
            width: '100%',
            transition: 'opacity 0.5s ease-in-out',
            position: 'relative'
          }}
        >
          <Typography
            level="h5"
            variant="soft"
            sx={{ position: 'absolute', top: 10, left: 10, backgroundColor:theme.palette.primary, padding: '5px'}}
          >
            {item.title}
          </Typography>
          <iframe
            src={item.image}
            alt={item.title} className="w-full aspect-[4/3]"
            style={{ width: '100%', height: 155.5, objectFit:"revert-layer",borderRadius: 5 }}
          />
          
        </Box>
      ))}
      <Button variant="contained"
        onClick={handlePrev}
        sx={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', color: theme.palette.common.white }}
      >
        <ArrowForward />
      </Button>
      <Button variant="contained"
        onClick={handleNext}
        sx={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', color: theme.palette.common.white }}
      >
        <ArrowBack />
      </Button>
    </Box>
  );
};
