import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/joy';

export default function Carousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 3000);
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
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Typography
            level="h6"
            sx={{ position: 'absolute', bottom: 10, left: 10, color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}
          >
            {item.title}
          </Typography>
        </Box>
      ))}
      <Button
        onClick={handlePrev}
        sx={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)' }}
      >
        Prev
      </Button>
      <Button
        onClick={handleNext}
        sx={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)' }}
      >
        Next
      </Button>
    </Box>
  );
};