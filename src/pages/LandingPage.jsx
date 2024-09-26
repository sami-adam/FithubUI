import React from 'react';
import { CssBaseline, Box, Typography, Button, Grid, Container, Card, CardContent } from '@mui/joy';
import DarkMode from '../components/common/DarkMode';
import { position } from 'stylis';

function LandingPage() {
  return (
    <Box>
      <CssBaseline />
      {/* Header */}
      <Box
        sx={{
          background: 'url(https://source.unsplash.com/featured/?fitness)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          px: 3,
        }}
      >
        <DarkMode sx={{position: "absolute", top: 8, left:8}} />
        <Container>
          <Typography level="display1" component="h1" sx={{ fontWeight: 'bold'}} color='neutral'>
            Manage Your Gym, Spa, or Health Center with Ease
          </Typography>
          <Typography level="h4" sx={{ mt: 2, mb: 4 }}>
            All-in-one software to streamline operations, boost efficiency, and keep your customers happy!
          </Typography>
          <Button size="lg" variant="solid" color="primary">
            <Typography level="button" color='primary'><a href="mailto:fithubsoft@gmail.com"> Get Started Today </a></Typography>
          </Button>
        </Container>
      </Box>

      {/* Features */}
      <Container sx={{ py: 8 }}>
        <Typography level="h2" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {[
            { title: 'Membership Management', description: 'Easily manage memberships, renewals, and billing.' },
            { title: 'Class Scheduling', description: 'Schedule fitness classes and spa appointments seamlessly.' },
            { title: 'Performance Tracking', description: 'Track customer progress and generate insightful reports.' },
            { title: 'Online Payments', description: 'Integrate with online payment systems for easy billing.' },
            { title: 'Customer Support', description: '24/7 customer support to help you every step of the way.' },
            { title: 'Mobile App', description: 'Access your data on the go with our mobile app.' },
            { title: 'Reporting & Analytics', description: 'Get detailed insights to make informed business decisions.' },
            { title: 'Accounting Integration', description: 'Sync with popular accounting software for seamless bookkeeping.' }
          ].map((feature, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography level="h3" sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography level="body1">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          backgroundColor: 'var(--joy-palette-primary-softBg)',
          py: 8,
          textAlign: 'center',
          color: 'var(--joy-palette-primary-contrastText)',
        }}
      >
        <Typography level="h2" component="h2" sx={{ mb: 4 }}>
          Ready to Get Started?
        </Typography>
        {/* <Button size="lg" variant="solid" color="primary">
          Sign Up Now
        </Button> */}
      </Box>

      {/* Testimonials */}
      <Container sx={{ py: 8 }}>
        <Typography level="h2" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
          What Our Clients Are Saying
        </Typography>
        <Grid container spacing={4}>
          {[
            { name: 'John Doe', feedback: 'This software revolutionized how we manage our gym operations!' },
            { name: 'Jane Smith', feedback: 'Easy to use and has all the features we need for our spa.' },
            { name: 'David Lee', feedback: 'Our health center is now more organized and efficient.' },
          ].map((testimonial, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography level="h4" sx={{ mb: 2 }}>
                    {testimonial.name}
                  </Typography>
                  <Typography level="body1">"{testimonial.feedback}"</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: 'var(--joy-palette-neutral-800)',
          color: 'var(--joy-palette-neutral-50)',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography level="body2">© 2024 FitHub Inc. All rights reserved.</Typography>
        <Typography level="body2">Contact us at <a href="mailto:fithubsoft@gmail.com">fithubsoft@gmail.com</a> | +123 456 7890</Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;
